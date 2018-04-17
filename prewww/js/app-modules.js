define(["underscore", "modules/navigation", "modules/home", "modules/footer", "modules/saved-workouts", "modules/about"], 
function(_, Navigation, Home, Footer, SavedWorkoutsModule, About) {

    var Modules = function() {

        var self = this;

        var collection = [];

        this.add = function(module) {

            if (_.contains(collection, module.name)) {
                throw "Module with name '" + module.name + "' already exists in collection";
            }

            collection.push(module);
        }

        this.remove = function(name) {
            collection = _.reject(collection,
                function(module) {
                    return module.name === name;
                });
        }

        this.get = function(name) {
            return _.find(collection,
                function(module) {
                    return module.name === name;
                });
        }

        this.start = function(name, page) {
            var module = self.get(name);

            if (module) {
                module.start(page);
            }
        };

        this.stopAll = function(exceptNames) {

            var names;

            if (!_.isArray(exceptNames)) {
                names = [exceptNames];
            } else {
                names = exceptNames;
            }

            _.each(collection,
                function(module) {
                    if (!_.contains(names, module.name)) {
                        module.stop();
                    }
                });
        };
    };

    var modules = new Modules();

    //Add new modules here
    modules.add(new Navigation());
    modules.add(new Home());
    modules.add(new Footer());
    modules.add(new SavedWorkoutsModule());
    modules.add(new About());

    return modules;
});