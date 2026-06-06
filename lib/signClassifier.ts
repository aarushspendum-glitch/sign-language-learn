"use client";

/**
 * ASL Sign Classifier
 * Uses MediaPipe 21-point hand landmarks to classify static and motion signs.
 *
 * Landmark map:
 *  0 = wrist
 *  1–4  = thumb  (MCP, IP, TIP)
 *  5–8  = index  (MCP, PIP, DIP, TIP)
 *  9–12 = middle (MCP, PIP, DIP, TIP)
 * 13–16 = ring   (MCP, PIP, DIP, TIP)
 * 17–20 = pinky  (MCP, PIP, DIP, TIP)
 */

export interface Landmark { x: number; y: number; z: number; }
export type Landmarks = Landmark[];

// ── Geometry helpers ─────────────────────────────────────────────────────────

function dist(a: Landmark, b: Landmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/** True if finger tip is above its PIP joint (finger extended upward). */
function extended(lms: Landmarks, tip: number, pip: number): boolean {
  return lms[tip].y < lms[pip].y - 0.02;
}

/**
 * True if thumb is abducted (spread away from palm).
 * Uses the angle between thumb tip and index MCP relative to the wrist.
 * Works for both left and right hands after mirroring.
 */
function thumbOut(lms: Landmarks): boolean {
  // Thumb tip should be far from index MCP laterally
  const thumbTip  = lms[4];
  const indexMcp  = lms[5];
  const wrist     = lms[0];
  // Palm width reference
  const palmWidth = dist(lms[5], lms[17]);
  // Lateral distance of thumb tip from index MCP
  const lateral   = Math.abs(thumbTip.x - indexMcp.x);
  // Thumb is "out" if its tip is more than 40% of palm width away laterally
  return lateral > palmWidth * 0.40;
}

/** True if thumb tip is CURLED (over the fingers). */
function thumbCurled(lms: Landmarks): boolean {
  return dist(lms[4], lms[8]) < dist(lms[3], lms[8]);
}

/** True if two fingertips are touching (within threshold). */
function touching(lms: Landmarks, a: number, b: number, thresh = 0.06): boolean {
  return dist(lms[a], lms[b]) < thresh;
}

/** True if two fingertips are spread apart (not touching). */
function spread(lms: Landmarks, a: number, b: number, thresh = 0.04): boolean {
  return Math.abs(lms[a].x - lms[b].x) > thresh;
}

/**
 * True if fingers are crossed (tip of a is past tip of b laterally).
 * Used for R detection.
 */
function crossed(lms: Landmarks, a: number, b: number): boolean {
  return Math.abs(lms[a].x - lms[b].x) < 0.025;
}

/** Normalized "curl" score for a finger: 0 = fully extended, 1 = fully curled. */
function curlScore(lms: Landmarks, mcp: number, pip: number, tip: number): number {
  const fullExt = dist(lms[mcp], { x: lms[mcp].x, y: lms[mcp].y - 0.2, z: 0 });
  const actual  = dist(lms[mcp], lms[tip]);
  return 1 - Math.min(actual / (dist(lms[mcp], lms[pip]) * 2), 1);
}

// ── Finger extension array ────────────────────────────────────────────────────

/** Returns [index, middle, ring, pinky] extension booleans. */
function fingers(lms: Landmarks): [boolean, boolean, boolean, boolean] {
  return [
    extended(lms, 8,  6),
    extended(lms, 12, 10),
    extended(lms, 16, 14),
    extended(lms, 20, 18),
  ];
}

// ── Motion detection (module-level history) ───────────────────────────────────

const HIST_SIZE = 20;
let _history: Landmarks[] = [];

export function pushHistory(lms: Landmarks) {
  _history.push(JSON.parse(JSON.stringify(lms)));
  if (_history.length > HIST_SIZE) _history.shift();
}

export function clearHistory() { _history = []; }

interface Motion { dx: number; dy: number; speed: number; }

function recentMotion(tipIdx: number): Motion {
  if (_history.length < 6) return { dx: 0, dy: 0, speed: 0 };
  const oldest = _history[0][tipIdx];
  const newest = _history[_history.length - 1][tipIdx];
  const dx = newest.x - oldest.x;
  const dy = newest.y - oldest.y;
  return { dx, dy, speed: Math.sqrt(dx * dx + dy * dy) };
}

/**
 * Detect a J-shape: pinky traces upward then curves down-right.
 * We look for upward then lateral motion in the pinky tip.
 */
function detectJ(): boolean {
  if (_history.length < 12) return false;
  const mid   = Math.floor(_history.length / 2);
  const early = _history[0][20];
  const midPt = _history[mid][20];
  const late  = _history[_history.length - 1][20];
  // Phase 1: moved up, Phase 2: curved (x changed)
  const wentUp   = midPt.y < early.y - 0.05;
  const curved   = Math.abs(late.x - midPt.x) > 0.04;
  return wentUp && curved;
}

/**
 * Detect a Z-shape: index traces Z pattern (right, diagonal, right).
 */
function detectZ(): boolean {
  if (_history.length < 12) return false;
  const n = _history.length;
  const q1 = _history[0][8];
  const q4 = _history[n - 1][8];
  // Net rightward + downward movement
  const movedRight = q4.x - q1.x > 0.07;
  const movedDown  = q4.y - q1.y > 0.02;
  return movedRight && movedDown;
}

// ── Main classifier ───────────────────────────────────────────────────────────

export function classifySign(lms: Landmarks): string | null {
  if (!lms || lms.length < 21) return null;

  pushHistory(lms);

  const [idx, mid, rng, pky] = fingers(lms);
  const tOut    = thumbOut(lms);
  const tCurl   = thumbCurled(lms);
  const allCurl = !idx && !mid && !rng && !pky;
  const allOpen = idx && mid && rng && pky;

  // ── Alphabet (static) ─────────────────────────────────────────────────────

  // A — fist, thumb alongside (NOT out, NOT curled over)
  if (allCurl && !tOut && !tCurl) return "A";

  // S — fist, thumb curled OVER fingers
  if (allCurl && tCurl) return "S";

  // E — fingers curled DOWN (tips near palm), thumb tucked under
  if (!idx && !mid && !rng && !pky) {
    const tips = [8, 12, 16, 20].map(i => lms[i].y);
    const pip  = [6, 10, 14, 18].map(i => lms[i].y);
    const allTipsNearPip = tips.every((t, i) => t > pip[i] - 0.04);
    if (allTipsNearPip) return "E";
    return "A"; // default fist = A
  }

  // B — 4 fingers straight up, thumb folded across palm (not out)
  if (idx && mid && rng && pky && !tOut) return "B";

  // 5 / open hand — all 4 fingers up, thumb out
  if (allOpen && tOut) return "5";

  // 4 — 4 fingers up, thumb not out (same as B basically — context matters)
  // We'll return B here; diagnostic should not test both simultaneously

  // C — curved hand: fingers partially bent, NOT fully extended, NOT fist
  if (!idx && !mid && !rng && !pky) {
    const d = dist(lms[4], lms[8]);
    const palmW = dist(lms[5], lms[17]);
    if (d > palmW * 0.4 && d < palmW * 1.0) return "C";
  }

  // O / 0 — fingertips and thumb meet in a circle
  if (!idx && !mid && !rng && !pky) {
    const tipToThumb = [8, 12, 16, 20].map(i => dist(lms[i], lms[4]));
    const allClose = tipToThumb.every(d => d < 0.12);
    if (allClose) return "O"; // same shape for 0 and O
  }

  // D — index up, thumb and middle form circle (others curled)
  if (idx && !mid && !rng && !pky) {
    if (touching(lms, 4, 12) || touching(lms, 4, 11)) return "D";
  }

  // F — index + thumb circle, middle/ring/pinky up
  if (!idx && mid && rng && pky) {
    if (touching(lms, 4, 8) || touching(lms, 4, 7)) return "F";
    // 9: similar — index-thumb circle with others more spread
    return "F";
  }

  // G — index + thumb point horizontally (sideways)
  if (idx && !mid && !rng && !pky && tOut) {
    const indexHoriz = Math.abs(lms[8].x - lms[5].x) > Math.abs(lms[8].y - lms[5].y);
    if (indexHoriz) return "G";
    // Else: index up + thumb out = L
    return "L";
  }

  // L — index up, thumb out, others curled
  if (idx && !mid && !rng && !pky && tOut) return "L";

  // 1 — index up, thumb NOT out (tucked near palm), others curled
  if (idx && !mid && !rng && !pky && !tOut) return "1";

  // H — index + middle extended HORIZONTALLY together
  if (idx && mid && !rng && !pky && !tOut) {
    const horizontal = Math.abs(lms[8].x - lms[5].x) > 0.04;
    if (horizontal) return "H";
  }

  // I / pinky only
  if (!idx && !mid && !rng && pky && !tOut) return "I";

  // Y — pinky + thumb out
  if (!idx && !mid && !rng && pky && tOut) return "Y";

  // K — index + middle up, thumb between them (not spread)
  if (idx && mid && !rng && !pky) {
    const thumbBetween = lms[4].x > Math.min(lms[8].x, lms[12].x) &&
                         lms[4].x < Math.max(lms[8].x, lms[12].x);
    if (thumbBetween) return "K";
  }

  // U — index + middle up together (not spread), NO thumb
  if (idx && mid && !rng && !pky && !tOut) {
    if (!spread(lms, 8, 12)) return "U";
    // V — index + middle up and spread
    if (spread(lms, 8, 12)) return "V";
  }

  // 2 / V — same shape (context resolves)
  if (idx && mid && !rng && !pky) {
    if (spread(lms, 8, 12, 0.03)) return "V"; // also "2"
    if (crossed(lms, 8, 12))      return "R";
    return "U";
  }

  // W — 3 fingers up (index, middle, ring), spread
  if (idx && mid && rng && !pky && !tOut) return "W";

  // 6 — pinky + thumb touch, index/middle/ring up
  if (idx && mid && rng && !pky && tOut) {
    if (touching(lms, 4, 20)) return "6";
  }

  // 3 — thumb + index + middle out
  if (idx && mid && !rng && !pky && tOut) return "3";

  // 7 — ring + thumb touch
  if (idx && mid && !rng && pky) return "7"; // approx

  // 8 — middle + thumb touch
  if (idx && !mid && rng && pky) return "8"; // approx

  // X — index hooked
  if (!allCurl && !idx && !mid && !rng && !pky) {
    const hook = lms[8].y > lms[6].y - 0.01 && lms[7].y < lms[6].y;
    if (hook) return "X";
  }

  // P — like K but pointing down
  if (idx && mid && !rng && !pky) {
    const pointDown = lms[8].y > lms[0].y; // tips below wrist
    if (pointDown) return "P";
  }

  // M — three fingers folded over thumb
  if (!idx && !mid && !rng && pky) {
    if (tCurl) return "M";
  }

  // N — two fingers over thumb
  if (!idx && !mid && rng && pky) {
    if (tCurl) return "N";
  }

  // T — thumb between index and middle
  if (!idx && !mid && !rng && !pky && tOut) {
    if (lms[4].y < lms[6].y) return "T";
  }

  // 10 — thumbs up (thumb extended up, fingers in fist)
  if (!idx && !mid && !rng && !pky && !tOut) {
    const thumbUp = lms[4].y < lms[3].y - 0.04;
    if (thumbUp) return "10";
  }

  // ── Motion signs ──────────────────────────────────────────────────────────

  // J — pinky up + J motion
  if (!idx && !mid && !rng && pky && !tOut) {
    if (detectJ()) return "J";
    return "I"; // static I if no motion
  }

  // Z — index up + Z motion
  if (idx && !mid && !rng && !pky && !tOut) {
    if (detectZ()) return "Z";
    return "1"; // static 1 if no motion
  }

  // ── Common gesture signs ──────────────────────────────────────────────────

  // HELLO — flat hand near forehead (open hand, wrist high)
  if (allOpen && tOut) {
    const wristHigh = lms[0].y < 0.45;
    if (wristHigh) return "HELLO";
    return "5";
  }

  // YES — fist nodding (A shape with vertical motion)
  if (allCurl && !tOut) {
    const motion = recentMotion(0); // wrist
    if (motion.dy > 0.06 && motion.speed > 0.06) return "YES";
    return "A";
  }

  // NO — index + middle snap closed (hard to detect; approximate with 2 fingers)

  // THANK_YOU / PLEASE — open hand moving from face (motion)
  if (allOpen) {
    const motion = recentMotion(0);
    if (motion.dy > 0.04) return "THANK_YOU";
  }

  // MORE — flat O hands tapping (just detect O shape)
  // STOP — chop motion

  return null;
}

/**
 * Match detected sign to the expected sign.
 * Handles aliases (e.g. 2=V, 0=O, 9=F).
 */
export function matchSignToLesson(detected: string | null, expected: string): boolean {
  if (!detected) return false;
  const d = detected.toUpperCase();
  const e = expected.toUpperCase();
  if (d === e) return true;

  // Alias map — signs that are visually identical or nearly so
  const ALIASES: Record<string, string[]> = {
    "0":        ["O"],
    "O":        ["0"],
    "1":        ["Z"],   // Z without motion = 1
    "2":        ["V"],
    "V":        ["2"],
    "5":        ["HELLO", "THANK_YOU"],
    "HELLO":    ["5"],
    "A":        ["S", "E", "YES"],
    "S":        ["A"],
    "I":        ["J"],   // J without motion = I
    "J":        ["I"],
    "Z":        ["1"],
    "9":        ["F"],
    "F":        ["9"],
    "B":        ["4"],
    "4":        ["B"],
  };

  return ALIASES[e]?.includes(d) ?? false;
}

/** Whether a sign ID requires motion to distinguish from a similar static sign. */
export function requiresMotion(signId: string): boolean {
  return ["J", "Z", "YES", "NO", "MORE", "STOP", "HELLO", "GOODBYE",
          "THANK_YOU", "PLEASE", "HOW_ARE_YOU", "NICE_TO_MEET", "MY_NAME",
          "WHAT", "WHERE", "WHO", "WHY", "MOTHER", "FATHER", "BROTHER",
          "SISTER", "HELP"].includes(signId.toUpperCase());
}
