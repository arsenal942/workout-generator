requirejs.config({
  baseUrl: "",

  paths: {
    collections: "js/collections",
    models: "js/models",
    modules: "js/modules",

    "app-modules": "js/app-modules",
    application: "js/application",
    router: "js/router",
    templater: "js/templater",
    vent: "js/vent",
    "model-store": "js/model-store",
    exercises: "js/data/exercises",

    backbone: "./node_modules/backbone/backbone-min",
    jquery: "./node_modules/jquery/dist/jquery.min",
    popper: "./node_modules/popper.js/dist/umd/popper.min",
    bootstrap: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min",
    knockback: "./node_modules/knockback/knockback.min",
    knockout: "./node_modules/knockout/build/output/knockout-latest",
    underscore: "./node_modules/underscore/underscore",
    moment: "./node_modules/moment/min/moment.min"
    
  },

  shim: {
    jquery: {
      exports: "$"
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    knockout: {
      exports: "ko"
    },
    knockback: {
      deps: ["knockout"],
      exports: "kb"
    },
    underscore: {
      exports: "_"
    },
    moment: {
      exports: "moment"
    },
    popper: {
      exports: "popper"
    },
    bootstrap: {
      deps: ["jquery", "popper"]
    }
  },

  urlArgs: "bust=" + new Date().getTime()
});

if (!window.location.origin) {
  console.log("!window.location.origin");
  window.location.origin =
    window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port ? ":" + window.location.port : "");
}

var moment = null;
require(["moment"], function(m) {
  moment = m;
});

var popper = null;
require(["popper"], function(p) {
  popper = p;
});

var bootstrap = null;
require(["bootstrap"], function(b) {
  bootstrap = b;
});

require(["application"], function(application) {
  application.initialize();
});
