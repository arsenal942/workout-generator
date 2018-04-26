define([
  "backbone",
  "underscore",
  "knockout",
  "knockback",
  "vent",
  "moment",
  "js/module",
  "models/exercise"
], function(Backbone, _, ko, kb, vent, moment, Module, Exercise) {
  var Configuration = Module.extend({
    name: "configuration",

    templateName: "tmpl-configuration",

    constructor: function() {
      var self = this;

      vent.on("module-start:configuration", function() {
        self.exercise = new Exercise();

        vent.trigger("title:change", "Workout Generator - Configuration");
      });
    },

    setupViewModel: function() {
      this.viewModel = {
        saveExercise: $.proxy(this.saveExercise, this),
        exercise: kb.viewModel(this.exercise)
      };
    },

    saveExercise: function() {}
  });

  return Configuration;
});
