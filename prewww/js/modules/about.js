define([
  "backbone",
  "underscore",
  "knockout",
  "knockback",
  "vent",
  "moment",
  "js/module"
], function(Backbone, _, ko, kb, vent, moment, Module) {
  var About = Module.extend({
    name: "about",

    templateName: "tmpl-about",

    constructor: function() {
      var self = this;

      vent.on("module-start:about", function() {
        vent.trigger("title:change", "Workout Generator - About");
      });
    },

    setupViewModel: function() {
      this.viewModel = {};
    }
  });

  return About;
});
