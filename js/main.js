requirejs.config({
    baseUrl: "",

    paths: {
        "collections": "js/collections",
        "models": "js/models",
        "modules": "js/modules",

        "app-modules": "js/app-modules",
        "application": "js/application",
        "router": "js/router",
        "templater": "js/templater",
        "vent": "js/vent",
        "model-store": "js/model-store",
        "exercises": "js/data/exercises",

        backbone: "./node_modules/backbone/backbone-min",        
        jquery: "./node_modules/jquery/dist/jquery.min",
        bootstrap: "./node_modules/bootstrap/dist/js/bootstrap.min",
        knockback: "./node_modules/knockback/knockback.min",
        knockout: "./node_modules/knockout/build/output/knockout-latest",
        underscore: "./node_modules/underscore/underscore",
        moment: "./node_modules/moment/min/moment.min"

    },

    shim: {
        "jquery": {
            exports: "$"
        },
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        "knockout": {
            exports: "ko"
        },
        "knockback": {
            deps: ["knockout"],
            exports: "kb"
        },
        "underscore": {
            exports: "_"
        },
        "moment": {
            exports: "moment"
        },
        "bootstrap": {
            deps: ["jquery"],
            exports: "bootstrap"
        }
    },

    urlArgs: "bust=" + (new Date()).getTime()
});

if (!window.location.origin) {
    console.log("!window.location.origin");
    window.location.origin = window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ":" + window.location.port : "");
}

var moment = null;
require(["moment"],
    function(m) {
        moment = m;
    });

require(["application"],
    function(application) {
        application.initialize();
    });

