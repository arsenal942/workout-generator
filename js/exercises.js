var allExercises = [];
$.getJSON("../js/data/exercises.json", function(exercises) {
  _.each(exercises.allExercises, function(exercise) {
    allExercises.push(exercise);
  });
});
