define([
  "backbone",
  "underscore",
  "knockout",
  "knockback",
  "vent",
  "moment",
  "js/module",
  "exercises"
], function(Backbone, _, ko, kb, vent, moment, Module) {
  var Home = Module.extend({
    name: "home",

    templateName: "tmpl-home",

    constructor: function() {
      var self = this;

      vent.on("module-start:home", function() {
        vent.trigger("title:change", "Workout Generator - Home");
      });

      vent.on("module-started:home", function() {});
    },

    setupViewModel: function() {
      this.viewModel = {
        workoutCategories: ko.observableArray(["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Triceps", "Biceps", "Core", "HIT", "WOD"]),
        workoutIntensities: ko.observableArray(["All", "Strength", "Volume"]),
        workoutExercises: ko.observableArray(),
        compoundsInWorkout: ko.observable(0),
        currentWorkout: ko.observableArray([]),
        randomRepSchemes: ko.observableArray([
          { value: "12", chance: 0.2 },
          { value: "15", chance: 0.2 },
          { value: "AMRAP", chance: 0.2 },
          { value: "", chance: 0.4 }
        ]),
        generateWorkout: $.proxy(this.generateWorkout, this),
        saveWorkout: $.proxy(this.saveWorkout, this),
        workoutCategory: ko.observable(""),
        amountOfExercises: ko.observable("4"),
        workoutIntensity: ko.observable(""),
        filtersVisible: ko.observable(true),
        includeCompoundExercises: ko.observable(true),
        includeSupersets: ko.observable(false),
        successMessage: ko.observable("")
      };
    },

    generateWorkout: function() {
      this.resetCurrentWorkout();
      this.setWorkoutExercises();
      var workoutExercisesWithCategory = this.getExercisesBasedOnWorkoutCategory();
      var maximumAmountOfExercisesForWorkout = this.getLengthOfExercises(workoutExercisesWithCategory);
      this.pickExercisesForCurrentWorkout(maximumAmountOfExercisesForWorkout, workoutExercisesWithCategory);
      this.sortCompoundExercisesToTopOfWorkout();
      this.createSupersets();
      return this.viewModel.currentWorkout();
    },

    resetCurrentWorkout: function() {
      this.viewModel.currentWorkout([]);
      this.viewModel.compoundsInWorkout(0);
      this.viewModel.successMessage("");
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

    sortCompoundExercisesToTopOfWorkout: function(){
      this.viewModel.currentWorkout.sort(function(left, right) {
        return left.type == right.type ? 0 : left.type > right.type ? -1 : 1;
      });
    },

    getExercisesBasedOnWorkoutCategory: function() {
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
      var workoutExercisesToReturn = this.filterExercisesBasedOnCategory();
      
      workoutExercisesToReturn = this.allowCompoundExercises(workoutExercisesToReturn);
      return this.viewModel.workoutExercises(workoutExercisesToReturn);
    },

    filterExercisesBasedOnCategory: function(){
      var category = this.viewModel.workoutCategory();
      if (this.viewModel.workoutCategory() !== "All"){
        return _.filter(allExercises, function(exercise){
          return exercise.category.includes(category);
        });
      } else {
        return allExercises;
      }
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
        case "All":
          break;
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

    allowCompoundExercises: function(workoutExercises) {
      if (this.viewModel.includeCompoundExercises()) {
        return workoutExercises;
      } else {
        var workoutExercisesWithoutCompounds = _.filter(workoutExercises, function(workoutExercise){
          return workoutExercise.type !== "Compound";
        });
        return workoutExercisesWithoutCompounds;
      }
    },

    createSupersets: function(){
      var probabilityOfSuperset = 0.5;
      var randomNumber = Math.random();
      var superset;

      if (probabilityOfSuperset > randomNumber){
        var exercisesWithSupersets = _.filter(this.viewModel.currentWorkout(), function(exercise){
          return exercise.canSuperset === true;
        });
        if (exercisesWithSupersets.length > 1){
          //Based on chance, create superset
          //Filter based on category to avoid random supersets
           
        }
      }
    },

    saveWorkout: function() {
      var newWorkout = {};
      let name = prompt("Enter the workout name");
      var savedWorkouts = JSON.parse(localStorage.getItem("savedWorkouts")) || [];

      if(name !== null && name.length){
        newWorkout = {
          workoutName: name,
          exercises: this.viewModel.currentWorkout()
        };
        savedWorkouts.push(newWorkout);
        localStorage.setItem("savedWorkouts", JSON.stringify(savedWorkouts));
        this.viewModel.successMessage("Workout Saved Successfully");
      }      
    }

  });

  return Home;
});
