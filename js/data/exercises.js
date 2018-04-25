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
  },
  {
    name: "Barbell Rows",
    value: "BarbellRows",
    type: "Accessory",
    category: ["Back"],
    maxReps: 15,
    maxSets: 5,
    minReps: 3,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: false
  },
  {
    name: "Pendlay Rows",
    value: "PendlayRows",
    type: "Accessory",
    category: ["Back"],
    maxReps: 15,
    maxSets: 5,
    minReps: 5,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: false
  },
  {
    name: "Back Extensions",
    value: "BackExtensions",
    type: "Accessory",
    category: ["Back"],
    maxReps: 15,
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
  },
  {
    name: "Face Pulls",
    value: "FacePulls",
    category: ["Shoulders", "Back"],
    maxReps: 20,
    maxSets: 5,
    minReps: 10,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: false
  },
  {
    name: "Arnold Press",
    value: "ArnoldPress",
    category: ["Shoulders"],
    maxReps: 12,
    maxSets: 5,
    minReps: 6,
    minSets: 2,
    reps: 0,
    sets: 0,
    canSuperset: false
  }
];
var allExercises;
var chestExercises = [];

$.getJSON("../js/data/exercises.json", function(data) {
  pushDataIntoVariable(chestExercises, data.chestExercises);
  console.log(chestExercises);
  allExercises = [].concat.apply(
    [],
    [chestExercises, legExercises, backExercises, shoulderExercises]
  );
});

pushDataIntoVariable = function(variable, data) {
  _.each(data, function(exercise) {
    variable.push(exercise);
  });
};
