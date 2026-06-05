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
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  order: number;
  lessons: Lesson[];
  thumbnail: string;
}

export const MODULES: Module[] = [
  {
    id: "alphabet",
    title: "ASL Alphabet",
    description: "Learn all 26 letters of the American Sign Language alphabet",
    level: "beginner",
    order: 1,
    thumbnail: "🤟",
    lessons: [
      {
        id: "letters-a-e",
        title: "Letters A–E",
        description: "Start with the first five letters of the ASL alphabet",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "A",
            label: "A",
            description: "Make a fist with your thumb resting on the side",
            tips: ["Keep fingers curled tight", "Thumb points up along the side of your fist"],
          },
          {
            id: "B",
            label: "B",
            description: "Hold four fingers straight up together, thumb folded across palm",
            tips: ["Fingers should be flat and touching", "Thumb crosses the palm horizontally"],
          },
          {
            id: "C",
            label: "C",
            description: "Curve hand into a C shape",
            tips: ["Imagine holding a cup", "Thumb and fingers form a C opening to the side"],
          },
          {
            id: "D",
            label: "D",
            description: "Index finger points up, other fingers and thumb form a circle",
            tips: ["Middle, ring, and pinky touch the thumb", "Index points straight up"],
          },
          {
            id: "E",
            label: "E",
            description: "Curl all fingers down, thumb tucked under fingers",
            tips: ["Fingertips touch the lower palm", "Thumb is visible below the fingers"],
          },
        ],
      },
      {
        id: "letters-f-j",
        title: "Letters F–J",
        description: "Continue with letters F through J",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "F",
            label: "F",
            description: "Index finger and thumb touch forming a circle, other fingers up",
            tips: ["Three fingers point up and spread", "Index-thumb circle faces forward"],
          },
          {
            id: "G",
            label: "G",
            description: "Index finger and thumb point horizontally to the side",
            tips: ["Like pointing sideways", "Other fingers are curled in"],
          },
          {
            id: "H",
            label: "H",
            description: "Index and middle finger point horizontally together",
            tips: ["Two fingers extended side by side", "Palm faces inward"],
          },
          {
            id: "I",
            label: "I",
            description: "Pinky finger points up, other fingers curled in a fist",
            tips: ["Only the pinky extends", "Thumb can rest on curled fingers"],
          },
          {
            id: "J",
            label: "J",
            description: "Pinky up like I, then trace a J shape in the air",
            tips: ["It's the only letter with motion", "Draw the J hook at the bottom"],
          },
        ],
      },
      {
        id: "letters-k-o",
        title: "Letters K–O",
        description: "Master letters K through O",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "K",
            label: "K",
            description: "Index and middle finger form a V, thumb between them pointing up",
            tips: ["Thumb touches the side of the middle finger", "Looks like a K facing forward"],
          },
          {
            id: "L",
            label: "L",
            description: "Index finger up, thumb out to the side forming an L",
            tips: ["Classic L-shape", "Other fingers curled in"],
          },
          {
            id: "M",
            label: "M",
            description: "Three fingers folded over the thumb",
            tips: ["Index, middle, ring fingers cover the thumb", "Like N but with 3 fingers"],
          },
          {
            id: "N",
            label: "N",
            description: "Two fingers folded over the thumb",
            tips: ["Index and middle fingers cover the thumb"],
          },
          {
            id: "O",
            label: "O",
            description: "All fingers and thumb curved to form an O shape",
            tips: ["Fingertips and thumb meet at a point", "Round opening in the middle"],
          },
        ],
      },
      {
        id: "letters-p-t",
        title: "Letters P–T",
        description: "Practice letters P through T",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "P",
            label: "P",
            description: "Like K but pointing downward",
            tips: ["K rotated so fingers point down", "Middle finger tip extends"],
          },
          {
            id: "Q",
            label: "Q",
            description: "Like G but pointing downward",
            tips: ["Index and thumb pointing down", "Like holding a small object pointing at the floor"],
          },
          {
            id: "R",
            label: "R",
            description: "Index and middle fingers crossed",
            tips: ["Cross your fingers for luck", "Other fingers curled in"],
          },
          {
            id: "S",
            label: "S",
            description: "Fist with thumb over the fingers",
            tips: ["Thumb wraps across the front of curled fingers", "Different from A — thumb is in front"],
          },
          {
            id: "T",
            label: "T",
            description: "Thumb between index and middle finger",
            tips: ["Thumb pokes between the first two fingers", "Other fingers curled in"],
          },
        ],
      },
      {
        id: "letters-u-z",
        title: "Letters U–Z",
        description: "Complete the alphabet with U through Z",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "U",
            label: "U",
            description: "Index and middle fingers together pointing up",
            tips: ["Two fingers together and straight", "Like H but vertical"],
          },
          {
            id: "V",
            label: "V",
            description: "Index and middle fingers spread in a V shape",
            tips: ["Peace sign facing forward", "Fingers spread apart"],
          },
          {
            id: "W",
            label: "W",
            description: "Index, middle, and ring fingers spread in a W",
            tips: ["Three fingers spread wide", "Pinky and thumb tucked in"],
          },
          {
            id: "X",
            label: "X",
            description: "Index finger hooked/crooked",
            tips: ["Bend the index finger like a hook", "Other fingers in a fist"],
          },
          {
            id: "Y",
            label: "Y",
            description: "Pinky and thumb out, other fingers curled — 'hang loose'",
            tips: ["Shaka sign", "Thumb and pinky extended, middle three curled"],
          },
          {
            id: "Z",
            label: "Z",
            description: "Index finger draws a Z in the air",
            tips: ["Only letter drawn with a Z motion", "Start top-left, go right, diagonally, then right again"],
          },
        ],
      },
    ],
  },
  {
    id: "numbers",
    title: "Numbers 0–20",
    description: "Count from zero to twenty in American Sign Language",
    level: "beginner",
    order: 2,
    thumbnail: "🔢",
    lessons: [
      {
        id: "numbers-0-5",
        title: "Numbers 0–5",
        description: "Learn to sign zero through five",
        type: "practice",
        passingScore: 70,
        signs: [
          { id: "0", label: "0", description: "O handshape — fingers and thumb form a circle", tips: ["Same as the letter O"] },
          { id: "1", label: "1", description: "Index finger points up", tips: ["Like pointing to the sky"] },
          { id: "2", label: "2", description: "Index and middle fingers up and spread", tips: ["Peace sign / V shape"] },
          { id: "3", label: "3", description: "Thumb, index, and middle fingers extended", tips: ["Other two fingers curled in"] },
          { id: "4", label: "4", description: "Four fingers up, thumb tucked in", tips: ["All except thumb spread out"] },
          { id: "5", label: "5", description: "All five fingers spread open", tips: ["Open palm facing forward"] },
        ],
      },
      {
        id: "numbers-6-10",
        title: "Numbers 6–10",
        description: "Learn to sign six through ten",
        type: "practice",
        passingScore: 70,
        signs: [
          { id: "6", label: "6", description: "Pinky and thumb touch, other fingers up", tips: ["Spider-Man web-shooter"] },
          { id: "7", label: "7", description: "Ring finger and thumb touch", tips: ["Middle, index, pinky up"] },
          { id: "8", label: "8", description: "Middle finger and thumb touch", tips: ["Index, ring, pinky up"] },
          { id: "9", label: "9", description: "Index finger and thumb form a circle, others up", tips: ["Like F but with others more straight"] },
          { id: "10", label: "10", description: "Fist with thumb up, shake slightly", tips: ["Thumbs up with a small shake"] },
        ],
      },
    ],
  },
  {
    id: "greetings",
    title: "Greetings & Introductions",
    description: "Learn how to say hello, goodbye, and introduce yourself",
    level: "beginner",
    order: 3,
    thumbnail: "👋",
    lessons: [
      {
        id: "basic-greetings",
        title: "Basic Greetings",
        description: "Hello, goodbye, thank you, and please",
        type: "practice",
        passingScore: 60,
        signs: [
          {
            id: "HELLO",
            label: "Hello",
            description: "Flat hand at forehead, move outward like a salute",
            tips: ["Palm faces out", "Start at your forehead temple and sweep forward"],
          },
          {
            id: "GOODBYE",
            label: "Goodbye",
            description: "Open hand, fingers together, bend fingers down and up like waving",
            tips: ["Like a finger-wave", "Palm faces the person you're saying bye to"],
          },
          {
            id: "THANK_YOU",
            label: "Thank You",
            description: "Flat hand at chin, move forward and slightly down",
            tips: ["Like blowing a kiss of gratitude", "Start at lips/chin area"],
          },
          {
            id: "PLEASE",
            label: "Please",
            description: "Flat hand on chest, move in a circle",
            tips: ["Rub the chest in a circular motion", "Shows sincerity"],
          },
        ],
      },
      {
        id: "introductions",
        title: "Introductions",
        description: "My name, nice to meet you, how are you",
        type: "practice",
        passingScore: 60,
        signs: [
          {
            id: "MY_NAME",
            label: "My Name",
            description: "Point to yourself, then spell your name using fingerspelling",
            tips: ["Index finger points to chest for 'my'", "Then use alphabet signs for your name"],
          },
          {
            id: "HOW_ARE_YOU",
            label: "How Are You?",
            description: "Bent hands move up from waist while alternating",
            tips: ["Both hands bent at knuckles", "Alternate moving them upward"],
          },
          {
            id: "NICE_TO_MEET",
            label: "Nice to Meet You",
            description: "Flat hands touch at fingertips then sweep apart",
            tips: ["Fingertips meet then pull apart outward", "Represents coming together"],
          },
        ],
      },
    ],
  },
  {
    id: "common-words",
    title: "Everyday Words",
    description: "Essential words for day-to-day conversations",
    level: "intermediate",
    order: 4,
    thumbnail: "💬",
    lessons: [
      {
        id: "yes-no-more",
        title: "Yes, No, More, Stop",
        description: "Critical response words every signer needs",
        type: "practice",
        passingScore: 70,
        signs: [
          {
            id: "YES",
            label: "Yes",
            description: "S handshape (fist) nods up and down",
            tips: ["Like a fist nodding", "Small up-down motion at the wrist"],
          },
          {
            id: "NO",
            label: "No",
            description: "Index and middle fingers close onto the thumb twice",
            tips: ["Like a duck beak snapping shut", "Two quick closes"],
          },
          {
            id: "MORE",
            label: "More",
            description: "Both hands in O shape, tap fingertips together twice",
            tips: ["Flat O hands meet fingertip to fingertip", "Tap twice"],
          },
          {
            id: "STOP",
            label: "Stop",
            description: "Flat left palm, right hand chops down onto it",
            tips: ["Left is the base/surface", "Right hand chops down firmly once"],
          },
          {
            id: "HELP",
            label: "Help",
            description: "Thumbs up fist rests on flat palm, both lift upward together",
            tips: ["A fist on top of a flat palm", "Lift both hands together"],
          },
        ],
      },
      {
        id: "family-words",
        title: "Family",
        description: "Mother, father, brother, sister, family",
        type: "practice",
        passingScore: 60,
        signs: [
          {
            id: "MOTHER",
            label: "Mother",
            description: "5 handshape, thumb touches chin twice",
            tips: ["Open hand, thumb taps chin", "Female signs are near the chin/cheek area"],
          },
          {
            id: "FATHER",
            label: "Father",
            description: "5 handshape, thumb touches forehead twice",
            tips: ["Open hand, thumb taps forehead", "Male signs are near the forehead area"],
          },
          {
            id: "BROTHER",
            label: "Brother",
            description: "L handshape from forehead, close to flat O at chest level",
            tips: ["Starts at forehead (male area)", "Moves down to neutral space"],
          },
          {
            id: "SISTER",
            label: "Sister",
            description: "L handshape from chin/cheek, close to flat O at chest level",
            tips: ["Starts at chin (female area)", "Moves down to neutral space"],
          },
        ],
      },
    ],
  },
  {
    id: "phrases",
    title: "Basic Phrases",
    description: "Put it all together with useful conversational phrases",
    level: "advanced",
    order: 5,
    thumbnail: "🗣️",
    lessons: [
      {
        id: "asking-questions",
        title: "Asking Questions",
        description: "Where, when, what, who, why",
        type: "practice",
        passingScore: 65,
        signs: [
          {
            id: "WHAT",
            label: "What",
            description: "Index finger brushes downward across the other hand's fingers",
            tips: ["Non-dominant hand fingers point out", "Dominant index brushes across them downward"],
          },
          {
            id: "WHERE",
            label: "Where",
            description: "Index finger points and shakes back and forth",
            tips: ["Single index finger wagging side to side", "Accompanied by a questioning face"],
          },
          {
            id: "WHO",
            label: "Who",
            description: "L handshape, index finger circles around the lips",
            tips: ["Circle around the mouth once", "Questioning eyebrows"],
          },
          {
            id: "WHY",
            label: "Why",
            description: "Touch forehead with middle finger, pull away into Y handshape",
            tips: ["Middle finger to temple", "Pull forward into a Y shape"],
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

export function getDiagnosticSigns(): Sign[] {
  const signs: Sign[] = [];
  // Pull a sample from each module
  for (const mod of MODULES) {
    for (const lesson of mod.lessons.slice(0, 1)) {
      signs.push(...lesson.signs.slice(0, 2));
    }
  }
  return signs.slice(0, 10);
}

export function getStartingModule(score: number): string {
  if (score >= 80) return "common-words";
  if (score >= 50) return "greetings";
  if (score >= 25) return "numbers";
  return "alphabet";
}
