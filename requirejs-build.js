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
    exercises: "js/exercises",

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
  }
});
