/**
 * ASL curriculum — sign descriptions and tips sourced from:
 *  - Lifeprint.com / ASL University (Dr. Bill Vicars) — primary reference
 *  - HandSpeak.com — secondary reference
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: "video" | "practice" | "quiz";
  signs: Sign[];
  passingScore: number;
}

export interface Sign {
  id: string;
  label: string;
  description: string;
  landmarks?: string;
  imagePath?: string;
  tips: string[];
}

export interface Module {
  id: string;
  accent: "emerald" | "sky" | "amber" | "violet" | "coral";
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  order: number;
  lessons: Lesson[];
  thumbnail: string;
}

export const MODULES: Module[] = [
  // ════════════════════════════════════════════════════════
  // MODULE 1: ASL ALPHABET
  // Source: Lifeprint.com Lesson 1 — Fingerspelling
  // ════════════════════════════════════════════════════════
  {
    id: "alphabet",
    title: "ASL Alphabet",
    description: "Learn all 26 letters of the American Sign Language fingerspelled alphabet",
    level: "beginner",
    order: 1,
    accent: "emerald",
    thumbnail: "🤟",
    lessons: [
      {
        id: "letters-a-e",
        title: "Letters A–E",
        description: "The first five letters — all involve closed or curled hand shapes",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "A",
            label: "A",
            // Lifeprint: "Make a fist. Thumb rests alongside — pointing upward, not across the fingers."
            description: "Compact fist with thumb resting against the side — thumb tip shows at the side, not tucked under.",
            tips: [
              "Curl all four fingers into a tight fist",
              "Thumb rests ALONGSIDE the fist — pointing up the side, not crossing over the knuckles",
              "This is NOT the same as S — in S the thumb crosses over the front of the fingers",
              "Think of it as a gentle fist where the thumb is parked to the side",
            ],
          },
          {
            id: "B",
            label: "B",
            // Lifeprint: "All four fingers straight up and touching. Thumb folds flat across the palm."
            description: "Four fingers straight up together, thumb folded flat across the palm.",
            tips: [
              "Press all four fingers tightly together — no gaps",
              "Thumb folds ACROSS the palm (not pointing out to the side)",
              "Fingers should be perfectly straight and vertical",
              "Palm faces forward — like showing someone a flat 'stop' hand",
            ],
          },
          {
            id: "C",
            label: "C",
            // Lifeprint: "Curve the fingers and thumb into the shape of the letter C."
            description: "Hand curved into a C shape — all fingers curve together, thumb curves below them.",
            tips: [
              "Imagine holding a drinking glass from the side",
              "All fingers curve uniformly — no single finger should stick out",
              "Thumb is curved below, forming the bottom of the C",
              "The opening of the C faces to the left (for right-hand signers)",
            ],
          },
          {
            id: "D",
            label: "D",
            // Lifeprint: "Index finger points up. Middle, ring, and pinky curl to touch the thumb tip."
            description: "Index finger points straight up; middle, ring, and pinky curl down to touch the thumb, forming a circle.",
            tips: [
              "Only the index finger is straight and up",
              "Middle, ring, and pinky fingers curl down and touch the thumb tip",
              "The thumb + three fingers form a circular 'O' shape at the base",
              "The loop made by thumb and middle finger is what separates D from a simple point",
            ],
          },
          {
            id: "E",
            label: "E",
            // Lifeprint: "Curl all four fingers so the fingertips rest on the lower palm. Thumb is tucked under the fingers."
            description: "All four fingers bend at the knuckles — fingertips point toward the palm. Thumb tucked under.",
            tips: [
              "Bend your fingers at the large knuckle (MCP joint) so tips point toward your palm",
              "The thumb tucks underneath the curled fingers",
              "It looks like a 'claw' shape viewed from the front",
              "Different from a full fist — the fingers are NOT fully closed; they hover near the palm",
            ],
          },
        ],
      },
      {
        id: "letters-f-j",
        title: "Letters F–J",
        description: "F through J — including J which requires motion",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "F",
            label: "F",
            // Lifeprint: "Index finger and thumb touch forming a circle (like OK). Middle, ring, pinky extended and spread."
            description: "Index and thumb form a small circle (touching tips). Middle, ring, and pinky extend upward.",
            tips: [
              "Touch only the index finger tip to the thumb tip — creating a small O/circle",
              "Let middle, ring, and pinky fingers extend naturally upward",
              "Those three fingers can be slightly spread",
              "This is the same base shape as number 9 — but context/motion differs",
            ],
          },
          {
            id: "G",
            label: "G",
            // Lifeprint: "Index finger and thumb point to the side (horizontally). Other three fingers curled in."
            description: "Index finger and thumb point horizontally to the side — like pointing a finger gun sideways.",
            tips: [
              "Index finger extends to the SIDE, not upward",
              "Thumb extends alongside the index finger, also horizontal",
              "Middle, ring, and pinky curl in toward the palm",
              "Key: the index points SIDEWAYS — if it points up, that's L or 1",
            ],
          },
          {
            id: "H",
            label: "H",
            // Lifeprint: "Index and middle fingers extend together horizontally, side by side."
            description: "Index and middle fingers extended side by side, pointing horizontally to the side.",
            tips: [
              "Extend index AND middle fingers together, both in the same direction",
              "They should point to the SIDE (horizontal), not upward",
              "Keep the two fingers touching/close together",
              "This is the horizontal version of U — same fingers but rotated 90°",
            ],
          },
          {
            id: "I",
            label: "I",
            // Lifeprint: "Pinky finger points straight up. Other fingers and thumb make a fist."
            description: "Only the pinky finger extends straight up. The other four fingers and thumb make a fist.",
            tips: [
              "ONLY the pinky goes up — all other fingers in a fist",
              "Don't let the ring finger sneak up — keep it firmly curled",
              "Thumb wraps over the curled fingers",
              "If you add the J motion (hook downward), it becomes the letter J",
            ],
          },
          {
            id: "J",
            label: "J",
            // Lifeprint: "Start with I (pinky up). Draw a J in the air with your pinky — curve up then hook to the right."
            description: "I-handshape (pinky up), then trace a J in the air — move up, curve, and hook to the right.",
            tips: [
              "Start with I: pinky up, fist closed",
              "Move your whole hand UPWARD as if drawing the top of a J",
              "Then curve and hook to the right (like the bottom of the letter J)",
              "The motion matters — a still I-hand is just 'I', not 'J'",
              "Practice slowly: up, then sweep to the right",
            ],
          },
        ],
      },
      {
        id: "letters-k-o",
        title: "Letters K–O",
        description: "K through O — some tricky shapes in this group",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "K",
            label: "K",
            // Lifeprint: "Index and middle finger form a V (spread), thumb between them touching middle finger's underside."
            description: "Index and middle fingers spread in a V; thumb pokes up between them, touching the underside of the middle finger.",
            tips: [
              "Spread index and middle fingers like a V or peace sign",
              "Thumb comes up between the two fingers",
              "The thumb tip should touch or nearly touch the middle finger's lower segment",
              "Ring and pinky are curled in",
              "This looks like a V with the thumb added in the middle",
            ],
          },
          {
            id: "L",
            label: "L",
            // Lifeprint: "Index finger points straight up. Thumb extends out to the side. Forms an L shape."
            description: "Index finger points straight up, thumb extends straight out to the side — making a clear L shape.",
            tips: [
              "Index finger points STRAIGHT UP",
              "Thumb extends out to the SIDE — perpendicular to the index finger",
              "The L shape should be very clear — like the letter L",
              "Middle, ring, and pinky are curled into the palm",
              "KEY difference from number 1: in '1' the thumb is TUCKED IN. In 'L' the thumb sticks OUT sideways",
            ],
          },
          {
            id: "M",
            label: "M",
            // Lifeprint: "Three fingers (index, middle, ring) fold down over the top of the thumb."
            description: "Three fingers (index, middle, ring) fold over the tucked thumb; pinky curls in too.",
            tips: [
              "Tuck your thumb into your palm first",
              "Then fold index, middle, and ring fingers DOWN over the thumb",
              "All three fingers cover the thumb",
              "Pinky folds in as well",
              "N is similar but uses only two fingers over the thumb",
            ],
          },
          {
            id: "N",
            label: "N",
            // Lifeprint: "Two fingers (index and middle) fold over the thumb."
            description: "Index and middle fingers fold down over the tucked thumb; ring and pinky curled in.",
            tips: [
              "Tuck thumb into palm first",
              "Fold ONLY index and middle fingers over the thumb",
              "Ring and pinky curl in but do NOT go over the thumb",
              "Like M but with two fingers instead of three",
            ],
          },
          {
            id: "O",
            label: "O",
            // Lifeprint: "All five fingertips meet the thumb to form a rounded O shape."
            description: "All fingers curve to meet the thumb — fingertips and thumb tip all touch, forming a hollow O.",
            tips: [
              "Curve all four fingers together toward the thumb",
              "All fingertips touch the thumb tip",
              "Leave a hollow circular opening in the middle",
              "This is the same handshape as the number 0",
              "The hand should look like you're holding a small ball",
            ],
          },
        ],
      },
      {
        id: "letters-p-t",
        title: "Letters P–T",
        description: "P through T — include some downward-pointing shapes",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "P",
            label: "P",
            // Lifeprint: "Like K but rotated so the fingers point downward."
            description: "K-handshape rotated downward — index and middle point down, thumb between them.",
            tips: [
              "Make a K shape first: index + middle spread, thumb between them",
              "Now rotate your wrist so the fingers point DOWNWARD toward the floor",
              "The thumb should still be between the two fingers",
              "Palm generally faces down or to the side",
            ],
          },
          {
            id: "Q",
            label: "Q",
            // Lifeprint: "Like G but pointing downward."
            description: "G-handshape rotated downward — index and thumb point toward the floor.",
            tips: [
              "Make a G shape: index + thumb horizontal, others curled",
              "Rotate so the index and thumb point DOWNWARD",
              "Like you're pointing at the floor with your index and thumb pinched together",
            ],
          },
          {
            id: "R",
            label: "R",
            // Lifeprint: "Cross the index and middle fingers."
            description: "Index and middle fingers extended and crossed over each other, other fingers curled in.",
            tips: [
              "'Cross your fingers for luck' — that's the R handshape",
              "Index and middle fingers both extend and cross over each other",
              "Ring and pinky curl in, thumb tucked",
              "The crossing should be visible from the front",
            ],
          },
          {
            id: "S",
            label: "S",
            // Lifeprint: "Fist with thumb wrapped across the front of the fingers."
            description: "Fist with the thumb crossing OVER the front of the curled fingers (index through ring).",
            tips: [
              "Make a fist first, then bring the thumb ACROSS the front",
              "Thumb should rest across the front of index and middle finger knuckles",
              "Different from A: in A the thumb is at the SIDE; in S the thumb is across the FRONT",
              "Different from E: E has fingers bent/clawed; S has fingers fully curled in a true fist",
            ],
          },
          {
            id: "T",
            label: "T",
            // Lifeprint: "Make a fist. Thumb tip pokes up between the index and middle fingers."
            description: "Fist with the thumb poked up between the index and middle fingers from inside the fist.",
            tips: [
              "Start with a fist",
              "Slip the thumb between the index and middle fingers so the thumb tip peeks out",
              "From the front it looks like a fist with a thumb tip showing between two knuckles",
              "It is a small but distinct shape — the key is the thumb-between-fingers position",
            ],
          },
        ],
      },
      {
        id: "letters-u-z",
        title: "Letters U–Z",
        description: "Complete the alphabet — including Z which uses motion",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "U",
            label: "U",
            // Lifeprint: "Index and middle fingers up and together (touching), pointing upward."
            description: "Index and middle fingers straight up, pressed together side by side, other fingers and thumb down.",
            tips: [
              "Index and middle fingers both point straight UP",
              "Keep them pressed together — no gap between them",
              "Ring and pinky curl in, thumb folds across",
              "This is the vertical version of H — same two fingers, different direction",
            ],
          },
          {
            id: "V",
            label: "V",
            // Lifeprint: "Index and middle fingers up and spread apart (V shape / peace sign)."
            description: "Index and middle fingers extended up and spread apart in a V or peace sign shape.",
            tips: [
              "Two fingers up like a peace sign",
              "Spread them APART — this is what separates V from U (which keeps fingers together)",
              "Same handshape as the number 2",
              "Palm can face forward or slightly outward",
            ],
          },
          {
            id: "W",
            label: "W",
            // Lifeprint: "Index, middle, and ring fingers spread up in a W. Pinky and thumb in."
            description: "Index, middle, and ring fingers all up and spread wide in a W shape. Pinky and thumb folded in.",
            tips: [
              "Three fingers spread wide — creates three visible peaks like the letter W",
              "Pinky curls in (distinguishes W from 4 or 5)",
              "Thumb tucks across the palm",
              "Spread the three fingers as wide as comfortable",
            ],
          },
          {
            id: "X",
            label: "X",
            // Lifeprint: "Index finger is hooked/bent at the top joint. Other fingers in a fist."
            description: "Index finger bent into a hook at the top joint. All other fingers in a fist.",
            tips: [
              "Make a fist, then extend only the index finger",
              "Bend just the top joint of the index finger — creating a hook",
              "It should look like a bent finger or a beckoning 'come here' gesture",
              "The thumb can be tucked or rest alongside the fist",
            ],
          },
          {
            id: "Y",
            label: "Y",
            // Lifeprint: "Thumb and pinky both extended outward. Middle three fingers curled in. 'Hang loose' / shaka."
            description: "Thumb and pinky both extend outward; index, middle, and ring fingers curl into the palm — the 'hang loose' / shaka sign.",
            tips: [
              "Only thumb AND pinky stick out — opposite ends of the hand",
              "Middle three fingers (index, middle, ring) are curled in tightly",
              "Same as the 'hang loose' or 'shaka' surf gesture",
              "Thumb points out to one side, pinky out to the other",
            ],
          },
          {
            id: "Z",
            label: "Z",
            // Lifeprint: "Index finger extended (1-handshape). Draw a Z in the air — right, diagonal down-left, right."
            description: "Index finger extended (number 1 shape), then trace a Z in the air.",
            tips: [
              "Start with number 1: only index finger up, thumb tucked",
              "Draw the Z by moving right, then diagonally down-left, then right again",
              "The motion makes the letter — a still index finger is just '1'",
              "Keep the motion small and controlled — about 6 inches wide",
              "Practice the three strokes of Z: right → diagonal → right",
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // MODULE 2: NUMBERS
  // Source: Lifeprint.com Lesson 7 — Numbers
  // ════════════════════════════════════════════════════════
  {
    id: "numbers",
    title: "Numbers 0–10",
    description: "Count from zero to ten in American Sign Language",
    level: "beginner",
    order: 2,
    accent: "sky",
    thumbnail: "🔢",
    lessons: [
      {
        id: "numbers-0-5",
        title: "Numbers 0–5",
        description: "Zero through five — foundational number handshapes",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "0",
            label: "0",
            // Lifeprint: "Same as letter O. All fingertips meet the thumb forming an O/circle."
            description: "O-shape: all four fingertips curve to meet the thumb tip, forming a hollow circle.",
            tips: [
              "Same handshape as the letter O",
              "Curve ALL four fingers toward the thumb",
              "All fingertips touch the thumb tip",
              "Leave a hollow circular space inside the hand",
              "Palm faces forward, the circle opening faces whoever you're signing to",
            ],
          },
          {
            id: "1",
            label: "1",
            // Lifeprint: "Point index finger up. Thumb stays FOLDED against the palm — NOT sticking out."
            description: "Only the index finger points straight up. Thumb stays tucked against the palm — NOT out to the side.",
            tips: [
              "Just point your index finger straight up",
              "ALL other fingers curl into a fist",
              "CRITICAL: keep your thumb tucked AGAINST your fingers — not sticking out to the side",
              "If your thumb sticks out to the side, that's an L, not a 1",
              "Think 'fist + index up' — not 'L shape'",
            ],
          },
          {
            id: "2",
            label: "2",
            // Lifeprint: "Index and middle fingers up and spread apart. Same as V or peace sign."
            description: "Index and middle fingers both up and spread apart in a V / peace sign. Other fingers and thumb down.",
            tips: [
              "Two fingers up and SPREAD APART — same as the peace sign or letter V",
              "If you hold them together (not spread) that becomes U, not 2",
              "Thumb stays tucked in",
              "Ring and pinky curl down",
              "The spread apart is key — make a clear V shape",
            ],
          },
          {
            id: "3",
            label: "3",
            // Lifeprint: "Thumb, index, and middle finger extended. Ring and pinky folded in."
            description: "Thumb, index finger, and middle finger all extend outward. Ring and pinky fold in.",
            tips: [
              "Three things sticking out: thumb + index + middle",
              "Thumb extends OUT to the side (abducted) — not tucked",
              "Ring and pinky curl into the palm",
              "It should look like you're holding up three fingers with your thumb included",
              "The thumb being OUT separates 3 from W (W has no thumb out)",
            ],
          },
          {
            id: "4",
            label: "4",
            // Lifeprint: "All four fingers straight up, spread a little. Thumb folds across the palm."
            description: "All four fingers extended straight up (can be slightly spread). Thumb folds across the palm.",
            tips: [
              "Four fingers point straight up",
              "The thumb folds flat across the palm — NOT sticking out",
              "Fingers can be slightly spread or held together",
              "Same base as letter B — but B holds fingers tightly together",
              "Think 'four fingers up, thumb in'",
            ],
          },
          {
            id: "5",
            label: "5",
            // Lifeprint: "All five fingers extended and spread wide open. Natural open hand."
            description: "All five fingers extended and spread wide — a fully open hand.",
            tips: [
              "Open your hand completely and spread all five fingers wide",
              "Thumb also extends out to the side",
              "Relax your hand — don't strain or over-extend",
              "Palm faces forward",
              "This is literally just an open, relaxed hand",
            ],
          },
        ],
      },
      {
        id: "numbers-6-10",
        title: "Numbers 6–10",
        description: "Six through ten — each uses a different finger touching the thumb",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "6",
            label: "6",
            // Lifeprint: "Pinky tip touches thumb tip. Index, middle, and ring fingers extend upward."
            description: "PINKY tip touches the thumb tip. Index, middle, and ring fingers extend upward.",
            tips: [
              "Touch your PINKY tip to your THUMB tip — they pinch together",
              "Index, middle, and ring fingers point straight up",
              "It looks like an open hand where only pinky+thumb are touching",
              "Some call it the 'Spider-Man' or 'call me' shape",
              "Remember: 6=pinky, 7=ring, 8=middle, 9=index — each number uses the next finger",
            ],
          },
          {
            id: "7",
            label: "7",
            // Lifeprint: "Ring finger tip touches thumb tip. Index, middle, pinky extended upward."
            description: "RING finger tip touches the thumb tip. Index, middle, and pinky fingers extend upward.",
            tips: [
              "Touch your RING finger tip to your THUMB tip",
              "Index, middle, and pinky all extend upward",
              "The ring finger curves down to meet the thumb while others stay up",
              "Memory trick: 6=pinky, 7=ring, 8=middle, 9=index touches thumb",
            ],
          },
          {
            id: "8",
            label: "8",
            // Lifeprint: "Middle finger tip touches thumb tip. Index, ring, and pinky extended."
            description: "MIDDLE finger tip touches the thumb tip. Index, ring, and pinky extend upward.",
            tips: [
              "Touch your MIDDLE finger tip to your THUMB tip",
              "Index, ring, and pinky extend upward",
              "The middle finger bends down while others stay up — this creates an unusual shape",
              "It can feel awkward at first — practice slowly",
            ],
          },
          {
            id: "9",
            label: "9",
            // Lifeprint: "Index finger and thumb form a circle/loop (like OK sign). Middle, ring, pinky extended."
            description: "INDEX tip touches the thumb tip forming a circle. Middle, ring, and pinky extend upward.",
            tips: [
              "Touch your INDEX finger tip to your THUMB tip — like an OK sign",
              "Middle, ring, and pinky extend straight up",
              "This is the same handshape as the letter F",
              "The circle made by index + thumb is the key feature",
            ],
          },
          {
            id: "10",
            label: "10",
            // Lifeprint: "Thumbs up fist — all fingers in fist, thumb pointing up. Can shake the hand."
            description: "Thumbs-up: all four fingers curl into a fist, thumb points straight UP. Optionally shake slightly.",
            tips: [
              "Make a fist, then extend only the THUMB straight upward",
              "Thumb should point clearly UP — like a 'thumbs up' gesture",
              "This is how you say '10' — just a thumbs up",
              "Some signers shake the hand slightly to emphasize it's 10",
              "KEY: don't let any other finger extend — a clean fist with thumb up",
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // MODULE 3: GREETINGS
  // Source: Lifeprint.com Lessons 1 & 2 — Greetings
  // ════════════════════════════════════════════════════════
  {
    id: "greetings",
    title: "Greetings & Introductions",
    description: "Say hello, goodbye, introduce yourself, and ask how someone is doing",
    level: "beginner",
    order: 3,
    accent: "amber",
    thumbnail: "👋",
    lessons: [
      {
        id: "basic-greetings",
        title: "Basic Greetings",
        description: "Hello, goodbye, please, and thank you",
        type: "practice",
        passingScore: 60,
        signs: [
          {
            id: "HELLO",
            label: "Hello",
            // Lifeprint: "Flat B hand near forehead, palm out, sweep hand forward and away from forehead (like a salute)."
            description: "Flat hand (B-shape) near your temple, palm facing out — sweep it forward away from your head like a salute.",
            tips: [
              "Hold a flat B hand (four fingers together, thumb in) near your forehead/temple",
              "Palm faces OUTWARD (away from you)",
              "Move your hand forward and slightly out — a salute motion",
              "The movement is smooth and outward, not up-down",
              "Smile — this is a greeting!",
            ],
          },
          {
            id: "GOODBYE",
            label: "Goodbye",
            // Lifeprint: "Open B hand, bend fingers down then back up repeatedly — like a finger-wave."
            description: "Open hand with fingers extended — bend just the fingers down and back up (a finger-wave, not a full wrist wave).",
            tips: [
              "Hold your hand up, palm facing the other person",
              "Bend only the fingers (at the knuckles) downward, then straighten — like a finger wave",
              "This is NOT a full wrist wave",
              "Repeat the bend 2–3 times",
              "Keep the wrist still — only the fingers move",
            ],
          },
          {
            id: "THANK_YOU",
            label: "Thank You",
            // Lifeprint: "Flat open hand starts at chin/lips, moves forward and slightly downward."
            description: "Flat open hand at your chin/lips, then sweep forward and down — like a 'thank you' bow with your hand.",
            tips: [
              "Touch the tips of your flat hand (B-shape) to your chin or lips",
              "Move your hand forward and slightly downward — toward the person you're thanking",
              "Palm faces upward as it moves forward",
              "It looks like you're 'tossing' a thank-you toward someone",
              "One fluid forward motion from chin outward",
            ],
          },
          {
            id: "PLEASE",
            label: "Please",
            // Lifeprint: "Flat hand on chest, rub in a circular motion."
            description: "Flat open hand placed on your chest, then rub in a clockwise circle.",
            tips: [
              "Place your flat hand on your chest (heart area)",
              "Rub in a smooth circular motion — clockwise from your perspective",
              "The whole hand moves together on the chest",
              "Keep it natural — like patting your heart gently",
              "This sign comes from rubbing the heart area to show sincerity",
            ],
          },
        ],
      },
      {
        id: "introductions",
        title: "Introductions",
        description: "My name is, nice to meet you, and how are you",
        type: "practice",
        passingScore: 60,
        signs: [
          {
            id: "MY_NAME",
            label: "My Name",
            // Lifeprint: "Point to self for 'my', then sign NAME (two bent index/middle fingers tap together twice)."
            description: "Point your index finger to your chest for 'MY', then tap two H-hands together twice for 'NAME'.",
            tips: [
              "First point your index finger at your chest — that's 'my'",
              "Then for 'name': make an H hand (index + middle extended together), do same with other hand",
              "Tap the two H hands together at the fingertips twice",
              "The tapping motion for NAME is small and quick — just two taps",
            ],
          },
          {
            id: "HOW_ARE_YOU",
            label: "How Are You?",
            // Lifeprint: "Both hands in bent B (bent at knuckles), knuckles facing each other, alternate moving upward."
            description: "Both hands bent at the knuckles (bent-B shape), alternate pushing upward from waist level.",
            tips: [
              "Curl all fingers at the large knuckles (MCP) — creating a bent-B or claw shape",
              "Both hands face each other or face upward",
              "Alternate lifting each hand upward slightly, like asking 'what's up'",
              "The motion is small — just a rhythmic upward alternation",
              "Add a questioning facial expression (raised eyebrows for WH-questions)",
            ],
          },
          {
            id: "NICE_TO_MEET",
            label: "Nice to Meet You",
            // Lifeprint: "Two flat hands meet fingertip-to-fingertip, then sweep apart (MEET + pleasantness)"
            description: "Flat hands meet at the fingertips facing each other, then sweep outward and apart.",
            tips: [
              "Hold both flat hands in front of you, fingertips facing each other",
              "Bring the hands together so fingertips touch",
              "Then sweep them apart outward — representing 'coming together and expanding'",
              "Combined with a warm expression, this conveys 'nice to meet you'",
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // MODULE 4: EVERYDAY WORDS
  // Source: Lifeprint.com Lessons 1, 2, 3 — Core vocabulary
  // ════════════════════════════════════════════════════════
  {
    id: "common-words",
    title: "Everyday Words",
    description: "Essential everyday vocabulary for basic ASL conversations",
    level: "intermediate",
    order: 4,
    accent: "violet",
    thumbnail: "💬",
    lessons: [
      {
        id: "yes-no-more",
        title: "Yes, No, More, Stop, Help",
        description: "Critical response and command words every signer needs",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "YES",
            label: "Yes",
            // Lifeprint: "S handshape (fist), nod the fist up and down at the wrist — like a head nodding yes."
            description: "S-handshape (closed fist), bend at the wrist to nod the fist up and down, like a head nodding yes.",
            tips: [
              "Make an S: closed fist with thumb across the front",
              "Bend at the WRIST to bob the fist up and down",
              "The motion is from the wrist — not the elbow or shoulder",
              "It should look like a little fist-head nodding 'yes'",
              "Repeat 2–3 times for emphasis",
            ],
          },
          {
            id: "NO",
            label: "No",
            // Lifeprint: "Index and middle fingers snap closed onto the thumb twice — like a duck beak."
            description: "Index and middle fingers extend, then snap down onto the thumb — like a duck beak snapping shut. Repeat twice.",
            tips: [
              "Start with index and middle fingers extended (like a 2/V), thumb out",
              "Snap them closed so fingertips touch the thumb — like a duck beak closing",
              "Open and snap closed twice quickly",
              "It should look like a hand 'saying no' by opening and closing",
            ],
          },
          {
            id: "MORE",
            label: "More",
            // Lifeprint: "Both hands in flat-O (all fingertips bunched to touch thumb), tap the two flat-O hands together at the fingertips twice."
            description: "Both hands in flat-O shape (fingertips pinched to thumb), tap them together at the fingertips twice.",
            tips: [
              "Make a 'flat O' on each hand: bring all four fingertips to meet the thumb (like holding a pinch of salt)",
              "Tap the fingertips of both flat-O hands together twice",
              "The tapping motion is small — just two quick taps at the fingertips",
              "This is a two-handed sign — both hands do the same shape",
            ],
          },
          {
            id: "STOP",
            label: "Stop",
            // Lifeprint: "Left hand flat (palm up). Right hand chops down onto the left palm."
            description: "Left hand flat with palm facing up. Right flat hand chops down sharply onto the left palm.",
            tips: [
              "Left hand is the base: hold it flat, palm up",
              "Right hand (dominant): held flat like a karate chop",
              "Bring the right hand down sharply onto the left palm — one decisive chop",
              "The right hand's pinky-side edge makes contact with the left palm",
              "It's a single clear movement — one chop, not repeated",
            ],
          },
          {
            id: "HELP",
            label: "Help",
            // Lifeprint: "A-handshape fist (thumbs up) placed on flat left palm. Both hands lift upward together."
            description: "Closed fist (A-shape) with thumb up placed on a flat left palm — then both hands lift upward together.",
            tips: [
              "Left hand: flat palm facing up, like a platform",
              "Right hand: A-shape fist with thumb pointing up — like a thumbs up",
              "Place the right fist (thumb side) on the left palm",
              "Lift BOTH hands upward together — the left hand carries/assists the right",
              "The upward lift represents 'giving assistance'",
            ],
          },
        ],
      },
      {
        id: "family-words",
        title: "Family",
        description: "Mother, father, brother, and sister",
        type: "practice",
        passingScore: 60,
        signs: [
          {
            id: "MOTHER",
            label: "Mother",
            // Lifeprint: "5-handshape (open hand spread), thumb touches the chin twice. Female signs are near the chin."
            description: "Open 5-hand, tap the thumb to your chin twice. Female signs are made near the chin/cheek.",
            tips: [
              "Open your hand into a 5-shape (all fingers spread)",
              "Tap your thumb to your chin twice — gently",
              "Female signs in ASL are made near the lower face/chin area",
              "The contact is thumb-to-chin, not fingertips-to-chin",
              "Two light taps",
            ],
          },
          {
            id: "FATHER",
            label: "Father",
            // Lifeprint: "5-handshape, thumb touches the forehead twice. Male signs are near the forehead."
            description: "Open 5-hand, tap the thumb to your forehead twice. Male signs are made near the forehead.",
            tips: [
              "Open your hand into a 5-shape (all fingers spread)",
              "Tap your thumb to your forehead twice — at the temple area",
              "Male signs in ASL are made near the upper face/forehead area",
              "Same motion as MOTHER but at the forehead instead of chin",
            ],
          },
          {
            id: "BROTHER",
            label: "Brother",
            // Lifeprint: "L handshape at forehead (male location), move down to chest level closing into flat-O."
            description: "L-hand at forehead (male area), move it down to neutral space while closing into a flat-O hand.",
            tips: [
              "Start with an L-hand (index up, thumb out) near your forehead/temple",
              "Move the hand downward to about chest/waist level",
              "As you move down, close the hand into a flat-O or compact shape",
              "The forehead start marks it as male (male = upper face area)",
            ],
          },
          {
            id: "SISTER",
            label: "Sister",
            // Lifeprint: "L handshape at chin (female location), move down to chest level closing into flat-O."
            description: "L-hand at chin (female area), move it down to neutral space while closing into a flat-O hand.",
            tips: [
              "Start with an L-hand (index up, thumb out) near your chin/cheek",
              "Move the hand downward to neutral (chest/waist level)",
              "As you move down, close the hand into a flat-O or compact shape",
              "The chin start marks it as female (female = lower face area)",
            ],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // MODULE 5: BASIC PHRASES
  // Source: Lifeprint.com Lessons 3, 4 — Question words and phrases
  // ════════════════════════════════════════════════════════
  {
    id: "phrases",
    title: "Basic Phrases",
    description: "Question words and useful conversational phrases",
    level: "advanced",
    order: 5,
    accent: "coral",
    thumbnail: "🗣️",
    lessons: [
      {
        id: "asking-questions",
        title: "Question Words",
        description: "What, where, who, and why — use with questioning facial expression",
        type: "practice",
        passingScore: 65,
        signs: [
          {
            id: "WHAT",
            label: "What",
            // Lifeprint: "Non-dominant hand fingers point out; dominant index finger brushes across them downward."
            description: "Left hand fingers point outward; right index finger brushes downward across the left fingertips.",
            tips: [
              "Left (non-dominant) hand: hold it with fingers extended and pointing out",
              "Right index finger sweeps downward across the tips of the left fingers",
              "The brushing motion is the key — one downward sweep",
              "Use a questioning face (furrowed brows for WH-questions)",
              "Some people sign WHAT with just one hand — a bent wrist shaking side to side",
            ],
          },
          {
            id: "WHERE",
            label: "Where",
            // Lifeprint: "Index finger points up and shakes side to side."
            description: "Index finger points up, wag it back and forth to the sides (like saying 'where?').",
            tips: [
              "Extend only your index finger pointing up",
              "Shake the hand side to side — the wag is from the wrist",
              "The motion is small and quick — just a side-to-side wag",
              "Add a questioning expression: brow furrowed for WH-questions",
            ],
          },
          {
            id: "WHO",
            label: "Who",
            // Lifeprint: "L-handshape or index finger, circle it around the lips."
            description: "Index finger extended, draw a small circle around the lips.",
            tips: [
              "Extend your index finger (or make an L-shape with index up, thumb out)",
              "Draw a small clockwise circle around your lips",
              "The circle should be about the size of your mouth",
              "Add a questioning expression",
              "Think 'who' — the circle around the lips asks 'who speaks?'",
            ],
          },
          {
            id: "WHY",
            label: "Why",
            // Lifeprint: "Touch forehead with middle finger (bent hand), pull away into Y handshape."
            description: "Touch your forehead with your middle finger, then pull your hand away and form a Y (thumb + pinky out).",
            tips: [
              "Bring your hand to your forehead with the middle finger touching it",
              "Pull your hand away from your forehead",
              "As you pull away, change to a Y-handshape: extend thumb and pinky only",
              "The motion is: touch-forehead → pull away → Y shape",
              "It happens in one fluid movement",
            ],
          },
        ],
      },
    ],
  },
];

export function getModule(moduleId: string): Module | undefined {
  return MODULES.find((m) => m.id === moduleId);
}

export function getLesson(moduleId: string, lessonId: string): Lesson | undefined {
  return getModule(moduleId)?.lessons.find((l) => l.id === lessonId);
}

/**
 * Diagnostic signs — hand-picked static signs clearly distinguishable by the classifier.
 * Motion signs excluded (need temporal data).
 */
export const DIAGNOSTIC_SIGNS: Sign[] = [
  {
    id: "A", label: "A",
    description: "Compact fist, thumb resting alongside (not over the fingers, not sticking out sideways)",
    tips: ["Curl all fingers into a tight fist", "Thumb rests at the SIDE — not crossing the front and not sticking out"],
  },
  {
    id: "B", label: "B",
    description: "Four fingers flat and straight up together, thumb folds across the palm",
    tips: ["Fingers tight together and vertical", "Thumb folds flat across the palm toward you"],
  },
  {
    id: "C", label: "C",
    description: "Hand curved into a C — all fingers curve together with thumb below",
    tips: ["Imagine holding a tennis ball from the side", "Opening of the C faces sideways"],
  },
  {
    id: "L", label: "L",
    description: "Index points straight up, thumb points straight out to the side — clear L shape",
    tips: ["This is NOT number 1 — the thumb MUST stick out to the side", "Classic L-for-Love or L-for-Loser shape"],
  },
  {
    id: "O", label: "O",
    description: "All fingertips curve to meet the thumb — round hollow O shape",
    tips: ["Same as number 0", "All five fingertips touch — leave a hollow center"],
  },
  {
    id: "V", label: "V",
    description: "Index and middle fingers up and SPREAD in a V / peace sign",
    tips: ["Same as number 2", "Key: fingers must be spread apart, not together"],
  },
  {
    id: "Y", label: "Y",
    description: "Thumb AND pinky extended; middle three fingers curled in — shaka / hang loose",
    tips: ["Only thumb and pinky stick out", "Middle three fingers are firmly curled"],
  },
  {
    id: "1", label: "1",
    description: "Only index finger points up — thumb stays tucked AGAINST the palm",
    tips: ["NOT like L — the thumb must stay folded IN", "If thumb sticks out sideways that's L, not 1"],
  },
  {
    id: "5", label: "5",
    description: "Fully open hand, all five fingers spread wide apart",
    tips: ["Open hand completely", "Spread all fingers as wide as comfortable — thumb too"],
  },
  {
    id: "10", label: "10",
    description: "All fingers in a fist, thumb pointing straight UP — thumbs up",
    tips: ["Clean fist with only the thumb sticking UP", "Like a standard 'thumbs up' gesture"],
  },
];

export function getDiagnosticSigns(): Sign[] {
  return DIAGNOSTIC_SIGNS;
}

export function getStartingModule(score: number): string {
  if (score >= 80) return "common-words";
  if (score >= 50) return "greetings";
  if (score >= 25) return "numbers";
  return "alphabet";
}
