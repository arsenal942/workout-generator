define(["backbone", "vent"], function(Backbone, vent) {
    var Router = Backbone.Router.extend({
        routes: {
            "": "start",
            ":module": "start",
            ":module/*params": "start",
            "module/*params/*params": "start"
        },

        start: function(module, params) {
            var options = {};

            if (params) {
                var regex = /([^\/]+\/[^\/]+)/ig;
                var parameters = params.match(regex);
                _.chain(parameters).each(function(parameter) {
                    var kvp = parameter.split("/");

                    if (kvp.length === 2) {
                        options[kvp[0]] = kvp[1];
                    }
                }).value();
            }

            if (module) {
                vent.trigger("route", module, options);
            }
        }
    });

    var router = new Router();

    return router;
})