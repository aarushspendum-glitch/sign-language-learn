"use client";

// Hand landmark indices from MediaPipe Hands
// 0=wrist, 1-4=thumb, 5-8=index, 9-12=middle, 13-16=ring, 17-20=pinky

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

type Landmarks = Landmark[];

function tipBase(landmarks: Landmarks, tip: number, base: number): boolean {
  return landmarks[tip].y < landmarks[base].y;
}

function fingerUp(landmarks: Landmarks, tip: number, pip: number): boolean {
  return landmarks[tip].y < landmarks[pip].y;
}

function distance(a: Landmark, b: Landmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function isThumbOut(landmarks: Landmarks): boolean {
  return landmarks[4].x < landmarks[3].x - 0.03;
}

function fingersExtended(landmarks: Landmarks): boolean[] {
  return [
    isThumbOut(landmarks),
    fingerUp(landmarks, 8, 6),
    fingerUp(landmarks, 12, 10),
    fingerUp(landmarks, 16, 14),
    fingerUp(landmarks, 20, 18),
  ];
}

export function classifySign(landmarks: Landmarks): string | null {
  if (!landmarks || landmarks.length < 21) return null;

  const [thumb, index, middle, ring, pinky] = fingersExtended(landmarks);
  const allCurled = !thumb && !index && !middle && !ring && !pinky;
  const allOpen = thumb && index && middle && ring && pinky;

  // A — fist, thumb on side (thumb not way out)
  if (!index && !middle && !ring && !pinky && !thumb) return "A";

  // B — 4 fingers up, thumb in
  if (!thumb && index && middle && ring && pinky) return "B";

  // C — all fingers curve (use distance between thumb tip and index tip as proxy)
  if (!allOpen && !allCurled) {
    const d = distance(landmarks[4], landmarks[8]);
    if (d > 0.08 && d < 0.18 && !index && !middle && !ring && !pinky && thumb) return "C";
  }

  // D — index up, others curled with thumb making circle
  if (index && !middle && !ring && !pinky) {
    const d = distance(landmarks[4], landmarks[12]);
    if (d < 0.06) return "D";
    return "L";
  }

  // E — all fingers curled, thumb tucked under
  if (allCurled) return "E";

  // F — index-thumb circle, others up
  if (!index && middle && ring && pinky && thumb) {
    const d = distance(landmarks[4], landmarks[8]);
    if (d < 0.05) return "F";
  }

  // I — only pinky up
  if (!thumb && !index && !middle && !ring && pinky) return "I";

  // K — index and middle up, thumb between
  if (!thumb && index && middle && !ring && !pinky) {
    const thumbBetween =
      landmarks[4].x > landmarks[8].x && landmarks[4].x < landmarks[12].x;
    if (thumbBetween) return "K";
    return "U";
  }

  // L — index up, thumb out
  if (thumb && index && !middle && !ring && !pinky) return "L";

  // O — all fingers curve to meet thumb
  if (!allOpen) {
    const d = distance(landmarks[4], landmarks[8]);
    if (d < 0.05 && !index && !middle && !ring && !pinky) return "O";
  }

  // R — index and middle crossed (hard to detect, approx with close distance)
  if (!thumb && index && middle && !ring && !pinky) {
    const crossed =
      Math.abs(landmarks[8].x - landmarks[12].x) < 0.03;
    if (crossed) return "R";
    return "U";
  }

  // S — fist, thumb over fingers
  if (allCurled && landmarks[4].x > landmarks[8].x) return "S";

  // V — index and middle spread
  if (!thumb && index && middle && !ring && !pinky) {
    const spread = Math.abs(landmarks[8].x - landmarks[12].x) > 0.04;
    if (spread) return "V";
    return "U";
  }

  // W — three fingers spread
  if (!thumb && index && middle && ring && !pinky) return "W";

  // Y — thumb and pinky out
  if (thumb && !index && !middle && !ring && pinky) return "Y";

  // Numbers
  if (allOpen) return "5";
  if (thumb && !index && !middle && !ring && !pinky) return "10";
  if (!thumb && index && !middle && !ring && !pinky) return "1";
  if (!thumb && index && middle && !ring && !pinky) return "2";
  if (thumb && index && middle && !ring && !pinky) return "3";
  if (!thumb && index && middle && ring && pinky) return "4";

  // Common signs (gesture-based, approximate)
  // HELLO — open flat hand near forehead
  if (allOpen && landmarks[0].y > landmarks[8].y) {
    const wristHigh = landmarks[0].y < 0.5;
    if (wristHigh) return "HELLO";
  }

  // YES — fist nodding (detected as A sign with motion — handled at component level)
  if (allCurled) return "A";

  return null;
}

// Maps sign classifier output to lesson sign IDs
export function matchSignToLesson(detected: string | null, expected: string): boolean {
  if (!detected) return false;
  return detected.toUpperCase() === expected.toUpperCase();
}
