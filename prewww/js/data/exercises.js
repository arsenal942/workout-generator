var chestExercises = [
  {
    name: "Bench Press",
    value: "BenchPress",
    type: "Compound",
    category: ["Chest"],
    maxReps: 12,
    maxSets: 9,
    minReps: 1,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: false
  },
  {
    name: "Close Grip Bench Press",
    value: "CloseGripBenchPress",
    type: "Compound",
    category: ["Chest"],
    maxReps: 15,
    maxSets: 9,
    minReps: 1,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: false
  },
  {
    name: "2 count Bench Press",
    type: "Compound",
    value: "2ctBenchPress",
    category: ["Chest"],
    maxReps: 10,
    maxSets: 5,
    minReps: 3,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: false
  },
  {
    name: "Incline Bench Press",
    type: "Compound",
    value: "InclineBenchPress",
    category: ["Chest"],
    maxReps: 12,
    maxSets: 5,
    minReps: 3,
    minSets: 3,
    reps: 0,
    sets: 0,
    canSuperset: false
  },
  {
    name: "Pushups",
    value: "Pushups",
    type: "Accessory",
    category: ["Chest", "Triceps", "Arms"],
    maxReps: 25,
    maxSets: 5,
    minReps: 10,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: true
  },
  {
    name: "Flat Dumbbell Bench Press",
    type: "Accessory",
    value: "FlatDumbbellBenchPress",
    category: ["Chest"],
    maxReps: 15,
    maxSets: 5,
    minReps: 5,
    minSets: 3,
    reps: 0,
    sets: 0,
    canSuperset: true
  },
  {
    name: "Incline Dumbbell Bench Press",
    type: "Accessory",
    value: "InclineDumbbellBenchPress",
    category: ["Chest"],
    maxReps: 15,
    maxSets: 5,
    minReps: 5,
    minSets: 3,
    reps: 0,
    sets: 0,
    canSuperset: true
  },
  {
    name: "Incline Dumbbell Fly",
    type: "Accessory",
    value: "InclineDumbbellFly",
    category: ["Chest"],
    maxReps: 15,
    maxSets: 5,
    minReps: 5,
    minSets: 3,
    reps: 0,
    sets: 0,
    canSuperset: true
  },
  {
    name: "Flat Dumbbell Fly",
    type: "Accessory",
    value: "FlatDumbbellFly",
    category: ["Chest"],
    maxReps: 15,
    maxSets: 5,
    minReps: 5,
    minSets: 3,
    reps: 0,
    sets: 0,
    canSuperset: true
  },
  {
    name: "Pec Deck",
    type: "Accessory",
    value: "PecDeck",
    category: ["Chest"],
    maxReps: 15,
    maxSets: 5,
    minReps: 5,
    minSets: 3,
    reps: 0,
    sets: 0,
    canSuperset: true
  }
];

var legExercises = [
  {
    name: "Squat",
    value: "Squat",
    type: "Compound",
    category: ["Legs"],
    maxReps: 12,
    maxSets: 9,
    minReps: 1,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: false
  },
  {
    name: "Lunges",
    value: "Lunges",
    type: "Accessory",
    category: ["Legs"],
    maxReps: 15,
    maxSets: 5,
    minReps: 8,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: true
  },
  {
    name: "Leg Extensions",
    value: "LegExtensions",
    type: "Accessory",
    category: ["Legs"],
    maxReps: 15,
    maxSets: 5,
    minReps: 8,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: true
  },
  {
    name: "Hamstring Curls",
    value: "HamstringCurls",
    type: "Accessory",
    category: ["Legs"],
    maxReps: 15,
    maxSets: 5,
    minReps: 8,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: true
  },
  {
    name: "Bulgarian Split Squats",
    value: "BulgarianSplitSquats",
    type: "Accessory",
    category: ["Legs"],
    maxReps: 15,
    maxSets: 5,
    minReps: 5,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: false
  },
  {
    name: "Standing Calf Raises",
    value: "StandingCalfRaises",
    type: "Accessory",
    category: ["Legs"],
    maxReps: 25,
    maxSets: 5,
    minReps: 10,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: true
  },
  {
    name: "Seated Calf Raises",
    value: "SeatedCalfRaises",
    type: "Accessory",
    category: ["Legs"],
    maxReps: 25,
    maxSets: 5,
    minReps: 10,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: true
  }
];

var backExercises = [
  {
    name: "Deadlift",
    value: "Deadlift",
    type: "Compound",
    category: ["Back"],
    maxReps: 15,
    maxSets: 9,
    minReps: 1,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: false
  },
  {
    name: "Pullups",
    value: "Pullups",
    type: "Accessory",
    category: ["Back"],
    maxReps: 12,
    maxSets: 5,
    minReps: 5,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: false
  }
];

var shoulderExercises = [
  {
    name: "Overhead Press",
    value: "OHP",
    category: ["Shoulders"],
    maxReps: 15,
    maxSets: 9,
    minReps: 1,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: false
  }
];

var allExercises = [].concat.apply([],[chestExercises, legExercises, backExercises, shoulderExercises]);
