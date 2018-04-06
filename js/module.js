define(["jquery", "underscore", "backbone", "knockout", "vent", "templater", "js/ko-custom-bindings"], function($, _, Backbone, ko, vent, templater) {
    var Module = function () { };

    _.extend(Module.prototype, Backbone.Events, {
        name: null,

        templateName: null,

        el: function() {
            return $("#content").get(0);
        },

        setupViewModel: function() {
            this.viewModel = {};
        },

        onParametersChanged: function() {
            //update module with new parameters here
        },

        renderTemplate: function(parameters){
            var self = this;

            if (this.started) {
                this.onParametersChanged(parameters);
                return;
            }

            vent.trigger("module-start module-start:" + this.name, this, parameters, this.name);

            this.setupViewModel();

            $.when(templater.loadTemplate(this.templateName)).done(function() {
                $(self.el()).attr("data-bind", "template: { name: '" + self.templateName + "' }");

                ko.applyBindings(self.viewModel, self.el());

                self.started = true;
                vent.trigger("module-started module-started:" + self.name, parameters, self.name);
            });
        },

        start: function(parameters) {
            var self = this;

            this.renderTemplate(parameters);
        },

        stop: function() {
            if (!this.started) {
                return;
            }

            vent.trigger("module-stop module-stop:" + this.name, this);

            ko.cleanNode(this.el());

            $(this.el()).removeAttr("data-bind");

            this.started = false;

            vent.trigger("module-stopped module-stopped:" + this.name, this);
        }
    });

    Module.extend = Backbone.Model.extend;

    return Module;

})