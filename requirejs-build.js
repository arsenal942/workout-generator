({
  appDir: "prewww",
  baseUrl: ".",
  dir: "www",
  optimizeCss: "none",
  removeCombined: true,
  modules: [
    {
      name: "js/main"
    }
  ],
  paths: {
    modules: "js/modules",

    "app-modules": "js/app-modules",
    application: "js/application",
    router: "js/router",
    templater: "js/templater",
    vent: "js/vent",
    exercises: "js/data/exercises",

    backbone: "./node_modules/backbone/backbone-min",
    jquery: "./node_modules/jquery/dist/jquery.min",
    popper: "./node_modules/popper.js/dist/umd/popper.min",
    bootstrap: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min",
    knockback: "./node_modules/knockback/knockback.min",
    knockout: "./node_modules/knockout/build/output/knockout-latest",
    underscore: "./node_modules/underscore/underscore",
    moment: "./node_modules/moment/min/moment.min",
    daemonite: "./node_modules/daemonite-material/js/material.min"
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
    },
    daemonite: {
      deps: ["bootstrap"]
    }
  }
});
