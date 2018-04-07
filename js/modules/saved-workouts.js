define([
  "backbone",
  "underscore",
  "knockout",
  "knockback",
  "vent",
  "moment",
  "js/model-store",
  "js/module"
], function(Backbone, _, ko, kb, vent, moment, modelStore, Module) {
  var SavedWorkoutsModule = Module.extend({
    name: "saved-workouts",

    templateName: "tmpl-saved-workouts",

    constructor: function() {
      var self = this;

      vent.on("module-start:saved-workouts", function() {
        vent.trigger("title:change", "Workout - Saved");
      });

      vent.on("module-started:saved-workouts", function() {
        self.fetchSavedWorkouts();

        self.savedWorkouts = new Backbone.Model({});
      });
    },

    setupViewModel: function() {
      this.viewModel = {
        savedWorkouts: ko.observableArray([]),
        savedWorkout: kb.viewModel(this.savedWorkout),
        deleteWorkout: $.proxy(this.deleteWorkout, this)
      };
    },

    fetchSavedWorkouts: function() {
      var self = this;
      var savedWorkouts =
        JSON.parse(localStorage.getItem("savedWorkouts")) || [];
      if (savedWorkouts.length) {
        return _.each(savedWorkouts, function(savedWorkout) {
          self.viewModel.savedWorkouts.push(savedWorkout);
        });
      }
    },

    deleteWorkout: function(workoutName) {
      var savedWorkouts = JSON.parse(localStorage.getItem("savedWorkouts"));
      var workoutToDelete = _.find(savedWorkouts, function(savedWorkout){
        return savedWorkout.workoutName === workoutName;
      }); 
      savedWorkouts.splice(workoutToDelete, 1);
      localStorage.setItem("savedWorkouts", JSON.stringify(savedWorkouts));
    }
  });

  return SavedWorkoutsModule;
});
