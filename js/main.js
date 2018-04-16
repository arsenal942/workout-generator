requirejs.config({
  baseUrl: "",

  paths: {
    modules: "js/modules",

    "app-modules": "js/app-modules",
    application: "js/application",
    router: "js/router",
    templater: "js/templater",
    vent: "js/vent",
    exercises: "js/data/exercises",

    backbone: "scripts/backbone.min",
    jquery: "scripts/jquery.min",
    knockback: "scripts/knockback.min",
    knockout: "scripts/knockout.min",
    underscore: "scripts/underscore.min",
    moment: "scripts/moment.min",
    sweet: "scripts/jquery.sweet-modal.min",
    popper: "scripts/popper.min",
    bootstrap: "scripts/bootstrap.bundle.min",
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
