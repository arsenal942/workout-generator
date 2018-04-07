define([
  "backbone",
  "underscore",
  "knockout",
  "knockback",
  "vent",
  "moment",
  "js/model-store",
  "js/module",
  "js/data/exercises"
], function(Backbone, _, ko, kb, vent, moment, modelStore, Module) {
  var Home = Module.extend({
    name: "home",

    templateName: "tmpl-home",

    constructor: function() {
      var self = this;

      vent.on("module-start:home", function() {
        vent.trigger("title:change", "Workout - Dashboard");
      });

      vent.on("module-started:home", function() {});
    },

    setupViewModel: function() {
      this.viewModel = {
        workoutExercises: ko.observableArray(),
        compoundsInWorkout: ko.observable(0),
        currentWorkout: ko.observableArray([]),
        randomRepSchemes: ko.observableArray([
          { value: "12", chance: 0.2 },
          { value: "15", chance: 0.2 },
          { value: "AMRAP", chance: 0.2 },
          { value: "", chance: 0.4 }
        ]),
        emptyCurrentWorkout: $.proxy(this.emptyCurrentWorkout, this),
        generateWorkout: $.proxy(this.generateWorkout, this),
        saveWorkout: $.proxy(this.saveWorkout, this),
        workoutCategory: ko.observable(""),
        amountOfExercises: ko.observable("4"),
        workoutIntensity: ko.observable(""),
        filtersVisible: ko.observable(true),
        toggleFilterVisibility: $.proxy(this.toggleFilterVisibility, this),
        includeCompoundExercises: ko.observable(true),
        includeSupersets: ko.observable(false)
      };
    },

    toggleFilterVisibility: function() {
      return this.viewModel.filtersVisible(!this.viewModel.filtersVisible());
    },

    emptyCurrentWorkout: function() {
      this.viewModel.currentWorkout([]);
      this.viewModel.compoundsInWorkout(0);
    },

    generateWorkout: function() {
      this.emptyCurrentWorkout();
      this.setWorkoutExercises();
      var workoutExercisesWithCategory = this.getExercises();
      var exerciseAmountLength = this.getLengthOfExercises(workoutExercisesWithCategory);

      this.pickExercisesForCurrentWorkout(exerciseAmountLength, workoutExercisesWithCategory);

      this.sortCompoundExercises();

      return this.viewModel.currentWorkout();
    },

    pickExercisesForCurrentWorkout: function(exerciseAmountLength, workoutExercisesWithCategory){
      var workoutIntensity = this.viewModel.workoutIntensity();

      for (var i = 0; i < exerciseAmountLength; i++) {
        var exercise = workoutExercisesWithCategory[Math.floor(Math.random() * workoutExercisesWithCategory.length)];
        if (!this.checkWorkoutDoesNotIncludeExercise(exercise, this.viewModel.currentWorkout())) {
          this.setExerciseRepsAndSets(exercise);
          this.viewModel.currentWorkout.push(exercise);
        } else {
          i = i - 1;
        }
      };
    },

    setExerciseRepsAndSets: function(exercise){
      var workoutIntensity = this.viewModel.workoutIntensity();
      var reps = exercise.reps < 10
      ? this.getSetRepSchemeBasedOnWorkoutIntensity(exercise, workoutIntensity)
      : this.getRandomRepScheme(exercise);
      exercise.reps = reps;
      exercise.sets = this.getAmountOfSets(exercise, workoutIntensity);
    },

    sortCompoundExercises: function(){
      this.viewModel.currentWorkout.sort(function(left, right) {
        return left.type == right.type ? 0 : left.type > right.type ? -1 : 1;
      });
    },

    getExercises: function() {
      var workoutCategory = this.viewModel.workoutCategory();
      if (workoutCategory !== "All") {
        return _.filter(this.viewModel.workoutExercises(), function(exercise) {
          return exercise.category.includes(workoutCategory);
        });
      } else {
        return this.viewModel.workoutExercises();
      }
    },

    setWorkoutExercises: function() {
      var workoutCategory = this.viewModel.workoutCategory();
      var workoutExercisesToReturn = [];
      switch (workoutCategory) {
        case "All":
          workoutExercisesToReturn = allExercises;
          break;
        case "Chest":
          workoutExercisesToReturn = chestExercises;
          break;
        case "Legs":
          workoutExercisesToReturn = legExercises;
          break;
        case "Back":
          workoutExercisesToReturn = backExercises;
          break;
        case "Shoulders":
          workoutExercisesToReturn = shoulderExercises;
          break;
        case "Arms":
          workoutExercisesToReturn = allExercises;
          break;
        case "Triceps":
          workoutExercisesToReturn = allExercises;
          break;
        case "Biceps":
          workoutExercisesToReturn = allExercises;
          break;
        case "Core":
          workoutExercisesToReturn = allExercises;
          break;
        case "HIT":
          workoutExercisesToReturn = allExercises;
          break;
        case "WOD":
          workoutExercisesToReturn = allExercises;
          break;
        default:
          workoutExercisesToReturn = allExercises;
          break;
      }

      return this.viewModel.workoutExercises(workoutExercisesToReturn);
    },

    getLengthOfExercises: function(workoutExercisesWithCategory) {
      var amountOfExercises = this.viewModel.amountOfExercises();
      if (amountOfExercises > workoutExercisesWithCategory.length) {
        return workoutExercisesWithCategory.length;
      } else {
        return amountOfExercises;
      }
    },

    checkWorkoutDoesNotIncludeExercise: function(exercise, currentWorkout) {
      return currentWorkout.includes(exercise) ? true : false;
    },

    getSetRepSchemeBasedOnWorkoutIntensity: function(exercise, workoutIntensity) {
      switch (workoutIntensity) {
        case "Volume":
          exercise.minReps = 5;
          exercise.maxReps = 12;
          break;
        case "Strength":
          exercise.minReps = 2;
          exercise.maxReps = 8;
          break;
        default:
          break;
      }

      return _.random(exercise.minReps, exercise.maxReps);
    },

    getAmountOfSets: function(exercise, workoutIntensity) {
      return _.random(exercise.minSets, exercise.maxSets);
    },

    getRandomRepScheme: function(exercise) {
      //Random to be either the accepted Rep Scheme or its own value based on a %
      var repScheme = this.pickRandomRepScheme();
      if (repScheme) {
        console.log(
          "Randomised Rep Scheme: " + exercise.name + " : " + repScheme
        );
        return repScheme;
      } else {
        return exercise.reps;
      }
    },

    pickRandomRepScheme: function() {
      var randomNumber = Math.random();
      var threshold = 0;
      for (let i = 0; i < this.viewModel.randomRepSchemes().length; i++) {
        threshold += parseFloat(this.viewModel.randomRepSchemes()[i].chance);
        if (threshold > randomNumber) {
          return this.viewModel.randomRepSchemes()[i].value;
        }
      }
    },

    limitCompoundExercises: function(exercise) {
      if (exercise.type === "Compound") {
        compoundsInWorkout = compoundsInWorkout + 1;
      }

      return compoundsInWorkout < 2 ? true : false;
    },

    saveWorkout: function() {
      var name = prompt("Enter the workout name");
      var description = prompt("Enter a description");
      var savedWorkouts =
        JSON.parse(localStorage.getItem("savedWorkouts")) || [];
      var newWorkout = {
        workoutName: name,
        description: description,
        exercises: this.viewModel.currentWorkout()
      };
      savedWorkouts.push(newWorkout);
      return localStorage.setItem(
        "savedWorkouts",
        JSON.stringify(savedWorkouts)
      );
    }

  });

  return Home;
});
