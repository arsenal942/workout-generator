define(["backbone", "vent", "underscore", "knockout", "knockback", "js/module"], 
function(Backbone, vent, _, ko, kb, Module) {
    var Navigation = Module.extend({
        name: "navigation-bar",

        templateName: "tmpl-navigation",

        constructor: function() {
            var self = this;

            vent.on("module-start:navigation-bar", function () {  
                vent.on("module-started", function(parameters, name){
                    var urlHash = window.location.hash;
                    $(".navbar li a.active").removeClass("active");
                    $(".navbar li a")
                      .filter(function() {
                        return this.hash == urlHash;
                      })
                      .addClass("active");
                });  
            });

            vent.on("module-started:navigation-bar", function () {
            });

            vent.on("module-stop:navigation-bar", function(){
            });
        },

        el: function() {
            return $("#navigation").get(0);
        },

        setupViewModel: function() {
            var self = this;
            this.viewModel = {

            };
        }
    });

    return Navigation;
});