"use client";

/**
 * ASL Sign Classifier — landmark geometry based on MediaPipe Hands 21-pt model.
 *
 * Reference: Lifeprint.com (ASL University, Dr. Bill Vicars)
 *            HandSpeak.com
 *            MediaPipe Hands landmark map
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
 * Finger is extended — tip is significantly higher (smaller y) than its PIP joint.
 * Threshold raised to 0.35 for stricter detection (reduces false positives).
 */
function up(lms: Landmarks, tip: number, pip: number): boolean {
  return (lms[pip].y - lms[tip].y) / palmWidth(lms) > 0.35;
}

/**
 * Thumb is abducted (sticking out to the side, away from palm).
 * Measured as lateral (x-axis) distance of thumb tip from index MCP, normalized.
 * L, G, Q, Y, 3, 5 all have abducted thumb.
 */
function thumbAbducted(lms: Landmarks): boolean {
  const pw = palmWidth(lms);
  const lateral = Math.abs(lms[4].x - lms[5].x) / pw;
  return lateral > 0.6;
}

/**
 * Thumb is pointing upward — tip is significantly above wrist AND above index MCP.
 * Used to detect 10 (thumbs-up) vs A/S/E (fist shapes).
 */
function thumbUp(lms: Landmarks): boolean {
  const pw = palmWidth(lms);
  // Thumb tip must be above index MCP by >0.3 palm widths
  return (lms[5].y - lms[4].y) / pw > 0.3;
}

/** Two landmarks are "near" each other (touching/pinching). */
function near(lms: Landmarks, a: number, b: number, thresh = 0.35): boolean {
  return dist(lms[a], lms[b]) / palmWidth(lms) < thresh;
}

/** Tip is curled — tip is NOT significantly above its DIP joint. */
function curled(lms: Landmarks, tip: number, dip: number): boolean {
  return (lms[dip].y - lms[tip].y) / palmWidth(lms) < 0.15;
}

/** Two fingertips are close together on the x-axis. */
function together(lms: Landmarks, a: number, b: number, thresh = 0.22): boolean {
  return Math.abs(lms[a].x - lms[b].x) / palmWidth(lms) < thresh;
}

/** Two fingertips are spread apart on the x-axis. */
function spreadApart(lms: Landmarks, a: number, b: number, thresh = 0.28): boolean {
  return Math.abs(lms[a].x - lms[b].x) / palmWidth(lms) > thresh;
}

// ─── Convenience finger-extension aliases ────────────────────────────────────

const I  = (lms: Landmarks) => up(lms, 8, 6);    // index extended
const M  = (lms: Landmarks) => up(lms, 12, 10);   // middle extended
const R  = (lms: Landmarks) => up(lms, 16, 14);   // ring extended
const P  = (lms: Landmarks) => up(lms, 20, 18);   // pinky extended
const TH = (lms: Landmarks) => thumbAbducted(lms);

// ─── Motion history ──────────────────────────────────────────────────────────

const HIST = 30;
let _hist: Landmarks[] = [];

export function pushHistory(lms: Landmarks) {
  _hist.push(lms.map(l => ({ ...l })));
  if (_hist.length > HIST) _hist.shift();
}
export function clearHistory() { _hist = []; }

/** Net motion of a single landmark tip over the history buffer. */
function tipMotion(tipIdx: number) {
  if (_hist.length < 8) return { dx: 0, dy: 0, mag: 0 };
  const pw = palmWidth(_hist[0]);
  const a = _hist[0][tipIdx], b = _hist[_hist.length - 1][tipIdx];
  const dx = (b.x - a.x) / pw;
  const dy = (b.y - a.y) / pw;
  return { dx, dy, mag: Math.sqrt(dx * dx + dy * dy) };
}

/**
 * Detect J: pinky traces upward then hooks to the side.
 * Per Lifeprint: I-handshape (pinky up), draw a J in the air — up then hook right.
 */
function detectJ(): boolean {
  if (_hist.length < 16) return false;
  const n = _hist.length;
  const pw = palmWidth(_hist[0]);
  // Pinky tip (idx 20): moved upward significantly in first half
  const early = _hist[0][20];
  const mid   = _hist[Math.floor(n * 0.5)][20];
  const late  = _hist[n - 1][20];
  const wentUp   = (mid.y - early.y) / pw < -0.35;   // moved up
  const hookedX  = Math.abs(late.x - mid.x) / pw > 0.25; // then moved sideways (the hook)
  return wentUp && hookedX;
}

/**
 * Detect Z: index finger traces a Z — right, diagonal down-left, right.
 * Simplified: net rightward + downward movement over the buffer.
 * Per Lifeprint: one-handshape index draws a Z in front of body.
 */
function detectZ(): boolean {
  if (_hist.length < 16) return false;
  const n = _hist.length;
  const pw = palmWidth(_hist[0]);
  const a = _hist[0][8], b = _hist[n - 1][8];
  const movedRight = (b.x - a.x) / pw > 0.45;
  const movedDown  = (b.y - a.y) / pw > 0.08;
  return movedRight && movedDown;
}

/**
 * Detect YES: S-handshape (fist) nods up and down at the wrist.
 * Per Lifeprint: make an S, bend wrist up/down repeatedly.
 */
function detectNod(): boolean {
  if (_hist.length < 12) return false;
  const ys = _hist.map(f => f[0].y);  // wrist y
  const mn = Math.min(...ys), mx = Math.max(...ys);
  return (mx - mn) / palmWidth(_hist[0]) > 0.22;
}

// ─── Main classifier ─────────────────────────────────────────────────────────

export function classifySign(lms: Landmarks): string | null {
  if (!lms || lms.length < 21) return null;
  pushHistory(lms);

  const i = I(lms), m = M(lms), r = R(lms), p = P(lms), th = TH(lms);
  const none = !i && !m && !r && !p;
  const all  =  i &&  m &&  r &&  p;

  // ══════════════════════════════════════════════════════════════════════════
  // NUMBERS 0–10  — checked FIRST to prevent conflicts with alphabet
  // (1 vs L, 2 vs V, 4 vs B, 9 vs F, 0 vs O)
  // Source: Lifeprint.com Numbers lesson
  // ══════════════════════════════════════════════════════════════════════════

  // 0: O-shape — all fingertips gathered near thumb tip
  //    All fingers curl to meet thumb; palm faces forward.
  if (none && near(lms, 8, 4, 0.42) && near(lms, 12, 4, 0.45) && near(lms, 16, 4, 0.52)) return "0";

  // 1: Index ONLY up, thumb tucked (NOT abducted — that would be L)
  //    Per Lifeprint: "Just point your index finger up with thumb folded"
  if (i && !m && !r && !p && !th) {
    // Don't return 1 if Z motion detected (Z uses same handshape + motion)
    if (!detectZ()) return "1";
  }

  // 2: Index + middle up and SPREAD APART (same handshape as V)
  //    Per Lifeprint: "Index and middle fingers spread in a V"
  if (i && m && !r && !p && spreadApart(lms, 8, 12)) return "2";

  // 3: Thumb + index + middle — thumb abducted outward
  //    Per Lifeprint: "Thumb, index, and middle extended; ring and pinky folded"
  if (i && m && !r && !p && th) return "3";

  // 4: All FOUR fingers up, thumb folded across palm (NOT abducted)
  //    Per Lifeprint: "All four fingers up, thumb tucked"
  if (all && !th) return "4";

  // 5: Open hand — all fingers + thumb spread out
  //    Per Lifeprint: "Open relaxed hand, all five fingers spread"
  if (all && th) return "5";

  // 6: PINKY touches thumb tip, index+middle+ring extended
  //    Per Lifeprint: "Pinky and thumb tips touch, other three fingers point up"
  if (i && m && r && !p && near(lms, 20, 4, 0.45)) return "6";

  // 7: RING finger touches thumb tip, index+middle+pinky up
  //    Per Lifeprint: "Ring and thumb tips touch"
  if (i && m && !r && p && near(lms, 16, 4, 0.45)) return "7";

  // 8: MIDDLE finger touches thumb tip, index+ring+pinky up
  //    Per Lifeprint: "Middle and thumb tips touch"
  if (i && !m && r && p && near(lms, 12, 4, 0.45)) return "8";
  // Also when index is ambiguous
  if (!i && !m && r && p && near(lms, 12, 4, 0.5)) return "8";

  // 9: INDEX tip touches thumb (OK/loop), middle+ring+pinky up or curled
  //    Per Lifeprint: "Index and thumb form a circle — like letter F"
  if (!i && m && r && p && near(lms, 8, 4, 0.35)) return "9";

  // 10: THUMBS UP — all four fingers in fist, thumb pointing straight up
  //     Per Lifeprint: "A-handshape with thumb extended upward (thumbs up), shake"
  //     Key: thumb UP above index MCP distinguishes from A/S (where thumb is beside or over fist)
  if (none && thumbUp(lms)) return "10";

  // ══════════════════════════════════════════════════════════════════════════
  // ALPHABET A–Z
  // Source: Lifeprint.com ASL Alphabet lessons
  // ══════════════════════════════════════════════════════════════════════════

  // ── Closed fist shapes (none extended) ───────────────────────────────────

  if (none) {
    // S: Fist, thumb wraps OVER the front of curled fingers
    //    Thumb is close to index+middle fingertips (in front of them)
    if (near(lms, 4, 8, 0.32) && lms[4].x > lms[8].x - 0.05) return "S";

    // E: Fingers curled forward (bent at MCP and PIP), thumb tucked UNDER
    //    Fingertips roughly at mid-palm height; distinctive bent-finger look
    const tipsCurled = [8, 12, 16, 20].filter(t => curled(lms, t, t - 1)).length >= 3;
    if (tipsCurled && !thumbUp(lms)) return "E";

    // A: Fist, thumb rests ALONGSIDE (not over, not up)
    //    This is the default closed fist when thumb is beside the fingers
    if (!thumbUp(lms) && !th) return "A";

    // T: Thumb between index and middle (but looks like fist from front)
    //    Detected by thumb abduction check failing + thumb tucked
    return "A"; // default closed fist → A
  }

  // ── One finger ───────────────────────────────────────────────────────────

  // Index only
  if (i && !m && !r && !p) {
    if (th) {
      // G: index + thumb horizontal (pointing to the side)
      //    Per Lifeprint: "Like pointing a gun sideways"
      const indexHoriz = Math.abs(lms[8].x - lms[5].x) > Math.abs(lms[8].y - lms[5].y);
      if (indexHoriz) return "G";
      // L: index up, thumb out — classic L shape
      return "L";
    }
    // X: index hooked/bent (tip curled)
    if (curled(lms, 8, 7)) return "X";
    // D: index up, thumb + middle form circle touching
    if (near(lms, 4, 12, 0.4)) return "D";
    // 1 with Z motion = Z
    if (detectZ()) return "Z";
    // Default: index up, thumb tucked = 1
    return "1";
  }

  // Pinky only
  if (!i && !m && !r && p) {
    if (th) return "Y"; // pinky + thumb = Y (shaka)
    // J: pinky + upward hook motion; I: pinky static
    if (detectJ()) return "J";
    return "I";
  }

  // ── Two fingers ───────────────────────────────────────────────────────────

  if (i && m && !r && !p) {
    if (th) return "3"; // already returned above but safety fallback

    // K: index + middle up, thumb UP between them
    //    Per Lifeprint: "Thumb tip touches underside of middle finger, index+middle spread"
    const thumbBetween = lms[4].x > Math.min(lms[8].x, lms[12].x) - 0.02 &&
                         lms[4].x < Math.max(lms[8].x, lms[12].x) + 0.02 &&
                         lms[4].y < lms[9].y; // thumb above middle MCP
    if (thumbBetween) return "K";

    if (together(lms, 8, 12)) {
      // H: index + middle together, pointing sideways
      const horizontal = Math.abs(lms[8].x - lms[6].x) > Math.abs(lms[8].y - lms[6].y);
      if (horizontal) return "H";
      // R: crossed fingers (index and middle cross each other)
      const crossed = Math.abs(lms[8].x - lms[12].x) / palmWidth(lms) < 0.12;
      if (crossed) return "R";
      return "U"; // two fingers together, vertical = U
    }

    // V: spread apart (already handled in numbers as 2, but for alphabet context)
    if (spreadApart(lms, 8, 12)) return "V";

    return "U"; // default two-finger
  }

  // Ring + pinky only (index + middle down)
  if (!i && !m && r && p) {
    // N: index + middle curl over thumb; ring + pinky up approximation
    return "N";
  }

  // Index + pinky (middle + ring down) — devil horns, not standard ASL letter

  // Pinky + middle only
  if (!i && m && !r && p) {
    return "M"; // approximate — M has 3 fingers over thumb
  }

  // ── Three fingers ─────────────────────────────────────────────────────────

  if (i && m && r && !p) {
    if (th) return "6"; // safety fallback (handled above with near check)
    // W: index + middle + ring spread, no thumb
    return "W";
  }

  if (!i && m && r && p) {
    // F: index + thumb form circle, middle+ring+pinky extended
    if (near(lms, 4, 8, 0.38)) return "F";
    return "M"; // approximate
  }

  // ── Four fingers ─────────────────────────────────────────────────────────

  if (all) {
    if (th) {
      // HELLO: open hand near forehead level
      if (lms[0].y < 0.42) return "HELLO";
      return "5";
    }
    // B: all four together, flat
    if (together(lms, 8, 12) && together(lms, 12, 16)) return "B";
    return "4";
  }

  // ── Gesture signs ─────────────────────────────────────────────────────────

  // YES: fist nodding (none + nod motion)
  if (none && detectNod()) return "YES";

  return null;
}

/**
 * Match a detected sign to the expected lesson sign.
 * Handles ASL signs that share the same handshape (aliases).
 * Source: Lifeprint.com sign equivalences
 */
export function matchSignToLesson(detected: string | null, expected: string): boolean {
  if (!detected) return false;
  const d = detected.toUpperCase();
  const e = expected.toUpperCase();
  if (d === e) return true;

  // Visually identical handshape pairs (per ASL University)
  const ALIASES: Record<string, string[]> = {
    // Numbers ↔ letters with same handshape
    "0":  ["O"],
    "O":  ["0"],
    "1":  [],             // 1 and L are DIFFERENT (thumb in vs out) — no alias
    "2":  ["V"],
    "V":  ["2"],
    "4":  ["B"],          // B has fingers together; 4 has them slightly spread
    "B":  ["4"],
    "9":  ["F"],
    "F":  ["9"],
    // Motion sign base shapes
    "I":  ["J"],          // J without motion = I
    "J":  ["I"],
    "Z":  ["1"],          // Z without motion = 1
    "1":  ["Z"],
    // Similar fist shapes
    "A":  ["S"],
    "S":  ["A", "E"],
    "E":  ["A"],
    // Similar two-finger shapes
    "U":  ["H"],
    "H":  ["U"],
    // Gesture ↔ handshape
    "YES":   ["A", "S"],
    "HELLO": ["5"],
    "5":     ["HELLO"],
  };

  return ALIASES[e]?.includes(d) ?? false;
}

/** Whether a sign requires motion to perform correctly. */
export function requiresMotion(signId: string): boolean {
  const MOTION_SIGNS = new Set([
    "J","Z",
    "YES","NO","MORE","STOP","HELP","PLEASE","THANK_YOU",
    "HELLO","GOODBYE","HOW_ARE_YOU","NICE_TO_MEET","MY_NAME",
    "WHAT","WHERE","WHO","WHY",
    "MOTHER","FATHER","BROTHER","SISTER",
    "GOOD","GOOD_MORNING","GOOD_NIGHT",
    "SORRY","EXCUSE_ME","YOU_WELCOME",
  ]);
  return MOTION_SIGNS.has(signId.toUpperCase());
}
