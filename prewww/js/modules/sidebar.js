define(["backbone", "vent", "underscore", "knockout", "knockback", "js/module"], function(Backbone, vent, _, ko, kb, Module) {
    var Sidebar = Module.extend({
        name: "sidebar",

        templateName: "tmpl-sidebar",

        constructor: function() {
            var self = this;

            vent.on("module-start:sidebar", function () {                  
            });

            vent.on("module-started:sidebar", function () {
            });
        },

        el: function() {
            return $("#sidebar").get(0);
        },

        setupViewModel: function() {
            var self = this;
            this.viewModel = {
            };
        }
    });

    return Sidebar;
});