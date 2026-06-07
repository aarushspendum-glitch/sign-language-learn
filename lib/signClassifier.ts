"use client";

/**
 * ASL Sign Classifier — landmark geometry based on MediaPipe Hands 21-pt model.
 *
 * Reference: Lifeprint.com (ASL University, Dr. Bill Vicars)
 *            HandSpeak.com
 *
 * Landmark indices:
 *  0=wrist | 1-4=thumb(CMC,MCP,IP,TIP) | 5-8=index(MCP,PIP,DIP,TIP)
 *  9-12=middle(MCP,PIP,DIP,TIP) | 13-16=ring | 17-20=pinky
 */

export interface Landmark { x: number; y: number; z: number; }
export type Landmarks = Landmark[];

// ─── Geometry primitives ─────────────────────────────────────────────────────

function dist(a: Landmark, b: Landmark) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/** Palm width: index MCP → pinky MCP. Used for normalization. */
function palmWidth(lms: Landmarks): number {
  return Math.max(dist(lms[5], lms[17]), 0.01);
}

/**
 * Finger is extended — tip clearly above its PIP joint.
 * Threshold 0.3 (palm-width units). Lower = more sensitive; higher = stricter.
 */
function up(lms: Landmarks, tip: number, pip: number): boolean {
  return (lms[pip].y - lms[tip].y) / palmWidth(lms) > 0.3;
}

/**
 * Thumb is abducted (sticking out sideways away from palm).
 * Lateral x-distance of thumb tip from index MCP, normalized by palm width.
 */
function thumbAbducted(lms: Landmarks): boolean {
  return Math.abs(lms[4].x - lms[5].x) / palmWidth(lms) > 0.55;
}

/**
 * Thumb is pointing straight UP — tip significantly above the index MCP.
 * Distinguishes 10 (thumbs-up) from A/S (fist, thumb at side or over).
 */
function thumbUp(lms: Landmarks): boolean {
  return (lms[5].y - lms[4].y) / palmWidth(lms) > 0.28;
}

/** Two landmarks are near each other (normalized dist below threshold). */
function near(lms: Landmarks, a: number, b: number, thresh = 0.35): boolean {
  return dist(lms[a], lms[b]) / palmWidth(lms) < thresh;
}

/** Normalized distance between two landmarks. */
function ndist(lms: Landmarks, a: number, b: number): number {
  return dist(lms[a], lms[b]) / palmWidth(lms);
}

/** Finger tip is curled — tip is NOT clearly above its DIP joint. */
function curled(lms: Landmarks, tip: number, dip: number): boolean {
  return (lms[dip].y - lms[tip].y) / palmWidth(lms) < 0.12;
}

/** Two fingertips are close on x-axis (together / not spread). */
function together(lms: Landmarks, a: number, b: number, thresh = 0.22): boolean {
  return Math.abs(lms[a].x - lms[b].x) / palmWidth(lms) < thresh;
}

/** Two fingertips are spread apart on x-axis. */
function spreadApart(lms: Landmarks, a: number, b: number, thresh = 0.28): boolean {
  return Math.abs(lms[a].x - lms[b].x) / palmWidth(lms) > thresh;
}

// ─── Finger extension aliases ────────────────────────────────────────────────

const fI  = (lms: Landmarks) => up(lms, 8,  6);   // index up
const fM  = (lms: Landmarks) => up(lms, 12, 10);  // middle up
const fR  = (lms: Landmarks) => up(lms, 16, 14);  // ring up
const fP  = (lms: Landmarks) => up(lms, 20, 18);  // pinky up
const fTH = (lms: Landmarks) => thumbAbducted(lms);

// ─── Motion history ──────────────────────────────────────────────────────────

const HIST = 30;
let _hist: Landmarks[] = [];

export function pushHistory(lms: Landmarks) {
  _hist.push(lms.map(l => ({ ...l })));
  if (_hist.length > HIST) _hist.shift();
}
export function clearHistory() { _hist = []; }

/**
 * Detect J: pinky traces upward arc then hooks sideways.
 * I-handshape (pinky up), draw a J — up then hook to the right.
 */
function detectJ(): boolean {
  if (_hist.length < 16) return false;
  const n = _hist.length;
  const pw = palmWidth(_hist[0]);
  const early = _hist[0][20];
  const mid   = _hist[Math.floor(n * 0.5)][20];
  const late  = _hist[n - 1][20];
  const wentUp  = (mid.y - early.y) / pw < -0.3;
  const hooked  = Math.abs(late.x - mid.x) / pw > 0.22;
  return wentUp && hooked;
}

/**
 * Detect Z: index traces a Z — net rightward and downward motion.
 * 1-handshape (index up), draw Z.
 */
function detectZ(): boolean {
  if (_hist.length < 16) return false;
  const n = _hist.length;
  const pw = palmWidth(_hist[0]);
  const a = _hist[0][8], b = _hist[n - 1][8];
  return (b.x - a.x) / pw > 0.4 && (b.y - a.y) / pw > 0.06;
}

/**
 * Detect YES: S-handshape fist nods up and down at the wrist.
 */
function detectNod(): boolean {
  if (_hist.length < 12) return false;
  const ys = _hist.map(f => f[0].y);
  const mn = Math.min(...ys), mx = Math.max(...ys);
  return (mx - mn) / palmWidth(_hist[0]) > 0.20;
}

// ─── Classifier ──────────────────────────────────────────────────────────────

export function classifySign(lms: Landmarks): string | null {
  if (!lms || lms.length < 21) return null;
  pushHistory(lms);

  const i = fI(lms), m = fM(lms), r = fR(lms), p = fP(lms), th = fTH(lms);
  const none = !i && !m && !r && !p;
  const all  =  i &&  m &&  r &&  p;

  // ════════════════════════════════════════════════════════════════════════════
  // NUMBERS 0–10  (checked before alphabet — same handshapes, number wins)
  // ════════════════════════════════════════════════════════════════════════════

  // 0: O-shape — all fingertips near thumb (same as letter O; number context wins)
  if (none && near(lms, 8, 4, 0.42) && near(lms, 12, 4, 0.45) && near(lms, 16, 4, 0.52)) return "0";

  // 1: Index only up, thumb tucked (NOT abducted = not L)
  if (i && !m && !r && !p && !th) {
    if (detectZ()) return "Z";
    return "1";
  }

  // 2: Index + middle up, spread (= V)
  if (i && m && !r && !p && spreadApart(lms, 8, 12)) return "2";

  // 3: Index + middle up, thumb abducted
  if (i && m && !r && !p && th) return "3";

  // 4: All four up, thumb tucked
  if (all && !th) return "4";

  // 5: All four up, thumb out
  if (all && th) return "5";

  // 6: Pinky tip touches thumb tip; index+middle+ring up
  if (i && m && r && !p && near(lms, 20, 4, 0.45)) return "6";

  // 7: Ring tip touches thumb tip; index+middle+pinky up
  if (i && m && !r && p && near(lms, 16, 4, 0.45)) return "7";

  // 8: Middle tip touches thumb tip; index+ring+pinky up
  if (i && !m && r && p && near(lms, 12, 4, 0.45)) return "8";
  if (!i && !m && r && p && near(lms, 12, 4, 0.5)) return "8";

  // 9: Index tip touches thumb (like F); middle+ring+pinky up
  if (!i && m && r && p && near(lms, 8, 4, 0.38)) return "9";

  // 10: Thumbs-up — fist with thumb pointing straight up
  if (none && thumbUp(lms)) return "10";

  // ════════════════════════════════════════════════════════════════════════════
  // ALPHABET
  // ════════════════════════════════════════════════════════════════════════════

  // ── No fingers extended ───────────────────────────────────────────────────

  if (none) {
    const ti_idx = ndist(lms, 4, 8);   // thumb tip → index tip
    const ti_mid = ndist(lms, 4, 12);  // thumb tip → middle tip

    // C: hand curves into C shape — fingers semi-curled, visible gap between thumb & fingers
    //    Key: thumb-to-index distance is moderate (not tight like A/S, not touching like O)
    //    Thumb abducted slightly OR significant gap visible
    if (ti_idx > 0.5 && ti_idx < 1.3 && ti_mid > 0.4) return "C";

    // S: Fist, thumb wraps OVER front of fingers — thumb near index tip
    if (near(lms, 4, 8, 0.33)) return "S";

    // E: Fingers clawed/bent at knuckle — fingertips toward palm, thumb tucked
    const claw = [8, 12, 16, 20].filter(t => curled(lms, t, t - 1)).length >= 3;
    if (claw) return "E";

    // T: Thumb pokes between index and middle (thumb visible between knuckles)
    //    Thumb x is between index MCP and middle MCP, and thumb is above wrist
    const txBetween = lms[4].x > Math.min(lms[5].x, lms[9].x) - 0.03 &&
                      lms[4].x < Math.max(lms[5].x, lms[9].x) + 0.03 &&
                      lms[4].y < lms[5].y;
    if (txBetween) return "T";

    // A: default closed fist, thumb alongside
    return "A";
  }

  // ── Index only ───────────────────────────────────────────────────────────

  if (i && !m && !r && !p) {
    if (th) {
      // G: index + thumb both horizontal (sideways pointing)
      const indexHoriz = Math.abs(lms[8].x - lms[5].x) > Math.abs(lms[8].y - lms[5].y);
      if (indexHoriz) return "G";
      // L: index up, thumb out sideways
      return "L";
    }
    // X: index hooked (tip curled)
    if (curled(lms, 8, 7)) return "X";
    // D: index up, thumb + middle form a circle
    if (near(lms, 4, 12, 0.42)) return "D";
    // Q: index + thumb pointing downward (like G but down)
    if (lms[8].y > lms[5].y + 0.05) return "Q"; // index pointing downward
    // Already returned 1/Z above — this is a fallback
    return "1";
  }

  // ── Pinky only ───────────────────────────────────────────────────────────

  if (!i && !m && !r && p) {
    if (th) return "Y";  // pinky + thumb = Y (shaka)
    if (detectJ()) return "J";
    return "I";
  }

  // ── Two fingers up ───────────────────────────────────────────────────────

  if (i && m && !r && !p) {
    // K: index + middle up, thumb tucked BETWEEN them and above MCP
    const thumbBetween = lms[4].x > Math.min(lms[8].x, lms[12].x) - 0.03 &&
                         lms[4].x < Math.max(lms[8].x, lms[12].x) + 0.03 &&
                         lms[4].y < lms[9].y;
    if (thumbBetween && !th) return "K";

    if (spreadApart(lms, 8, 12)) return "V";  // spread = V (number 2 already caught above)

    if (together(lms, 8, 12)) {
      // H or U: two fingers together
      const horizontal = Math.abs(lms[8].x - lms[6].x) > Math.abs(lms[8].y - lms[6].y);
      if (horizontal) return "H";
      // R: fingers crossed (very close x, both up)
      if (ndist(lms, 8, 12) < 0.15) return "R";
      return "U";
    }

    return "U";
  }

  // ── Pinky + ring (index + middle down) ──────────────────────────────────

  if (!i && !m && r && p) return "N";

  // ── Ring + middle + pinky (index down) ──────────────────────────────────

  if (!i && m && r && p) {
    if (near(lms, 4, 8, 0.40)) return "F";  // F: index+thumb circle, others up
    return "M";  // approximation
  }

  // ── Three fingers up ─────────────────────────────────────────────────────

  if (i && m && r && !p) {
    // W: three spread fingers, no thumb
    return "W";
  }

  // ── All four fingers up ──────────────────────────────────────────────────

  if (all) {
    if (th) {
      if (lms[0].y < 0.42) return "HELLO";  // hand near forehead
      return "5";
    }
    // B: four fingers flat together
    if (together(lms, 8, 12) && together(lms, 12, 16)) return "B";
    return "4";
  }

  // ── Gesture signs ────────────────────────────────────────────────────────

  if (none && detectNod()) return "YES";

  // P: K-shape but pointing downward (handled as fallback)
  if (i && m && !r && !p && lms[8].y > lms[0].y) return "P";

  return null;
}

/**
 * Match detected sign to expected lesson sign.
 * Handles visually identical handshapes (aliases).
 * Source: Lifeprint.com equivalences.
 */
export function matchSignToLesson(detected: string | null, expected: string): boolean {
  if (!detected) return false;
  const d = detected.toUpperCase();
  const e = expected.toUpperCase();
  if (d === e) return true;

  const ALIASES: Record<string, string[]> = {
    "0":  ["O"],
    "O":  ["0"],
    // 1 and L are DIFFERENT (thumb tucked vs out) — no alias
    "2":  ["V"],
    "V":  ["2"],
    "4":  ["B"],
    "B":  ["4"],
    "9":  ["F"],
    "F":  ["9"],
    "I":  ["J"],          // J without motion = I
    "J":  ["I"],
    "Z":  ["1"],          // Z without motion = 1
    "1":  ["Z"],
    "A":  ["S"],
    "S":  ["A", "E"],
    "E":  ["A", "S"],
    "U":  ["H"],
    "H":  ["U"],
    "YES":   ["A", "S"],
    "HELLO": ["5"],
    "5":     ["HELLO"],
  };

  return ALIASES[e]?.includes(d) ?? false;
}

/** Whether a sign requires movement to detect correctly. */
export function requiresMotion(signId: string): boolean {
  const MOTION = new Set([
    "J","Z",
    "YES","NO","MORE","STOP","HELP","PLEASE","THANK_YOU",
    "HELLO","GOODBYE","HOW_ARE_YOU","NICE_TO_MEET","MY_NAME",
    "WHAT","WHERE","WHO","WHY",
    "MOTHER","FATHER","BROTHER","SISTER",
  ]);
  return MOTION.has(signId.toUpperCase());
}
