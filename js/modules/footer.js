define(["backbone", "vent", "underscore", "knockout", "knockback", "js/module", "js/model-store"], function(Backbone, vent, _, ko, kb, Module, modelStore) {
    var Footer = Module.extend({
        name: "footer",

        templateName: "tmpl-footer",

        constructor: function() {
            var self = this;

            vent.on("module-start:footer", function () {      
            });

            vent.on("module-started:footer", function () {
            });
        },

        el: function() {
            return $("#footer").get(0);
        },

        setupViewModel: function() {
            var self = this;
            this.viewModel = {

            };
        }
    });

    return Footer;
});