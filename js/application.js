define(["vent", "router", "app-modules", "js/backbone-nested", "bootstrap"], function (vent, router, modules) {
  function Application() {

    this.addHashIfNoneExists = function () {
      if (!window.location.hash) {
        window.location.hash = "#home";
      }
    }

    this.initialize = function () {
      vent.trigger("application-initialize");

      vent.on("module-start", function (module) {
        console.log("Module " + module.name + " loaded");
      });

      vent.on("module-stop", function (module) {
        console.log("Module Stopped: " + module.name);
      });

      vent.on("route", function (name, parameters) {
        modules.stopAll([name], "navigation-bar", "sidebar", "footer");
        modules.start("navigation-bar", parameters);
        modules.start("sidebar", parameters);
        modules.start("footer", parameters);

        modules.start(name, parameters);
      });

      Backbone.history.start();

      vent.on("title:change",
        function (title) {
          document.title = title;
        });

      this.addHashIfNoneExists();

      vent.trigger("application-initialized");
    }

  }

  var application = new Application();

  return application;
});