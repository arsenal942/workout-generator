define(["backbone"],
    function(Backbone) {
        Backbone.Model.prototype.toJSON = function(options) {
            options = options || {};
            var json = _.clone(this.attributes);
            for (var attr in json) {
                if ((json[attr] instanceof Backbone.Model) || (json[attr] instanceof Backbone.Collection)) {
                    if (options.noRecursion) {
                        json[attr] = null;
                    } else {
                        json[attr] = json[attr].toJSON();
                    }
                }
            }

            return json;
        };

        Backbone.Model.prototype.hasChanged = function(attr) {
            var self = this;

            if (attr) {
                return _.has(this.changed, attr);
            }

            var attributes = _.clone(this.attributes);
            return _.any(attributes,
                function(val, key) {
                    if (val instanceof (Backbone.Model)) {
                        return val.hasChanged();
                    } else if (val instanceof (Backbone.Collection)) {
                        return _.any(val.models,
                            function(model) {
                                return model.hasChanged();
                            });
                    } else {
                        return self.hasChanged(key);
                    }
                });
        };

        Backbone.Collection.prototype.initialize = function() {

            var self = this;

            this.on("sync",
                function() {
                    self.isDirty(false);
                    this.each(function(model) {
                        model.cleanDirty(model.toJSON());
                    });
                });

            this.on("remove",
                function() {
                    self.isDirty(true);
                });
        };

        Backbone.Collection.prototype.isDirty = function(set) {
            if (set === undefined) {
                if (this.dirty) {
                    return true;
                }
                return false;
            } else if (typeof (set) === "boolean") {
                this.dirty = set;
            }
        };

        Backbone.Collection.prototype.isAnythingDirty = function() {
            return this.isDirty() || this.any(function(model) { return model.IsAnythingDirty(); });
        };

        Backbone.Model.prototype.initialize = function() {
            var self = this;

            this.isDirty(true);

            this.on("sync",
                function(model, resp) {
                    self.cleanDirty(resp);
                });

            this.on("change",
                function() {
                    self.isDirty(true);
                });
        };

        Backbone.Model.prototype.cleanDirty = function(attrs) {
            var self = this;

            this.dirty = false;

            _.each(attrs,
                function(val, key) {
                    var attr = self.get(key);

                    if (attr instanceof (Backbone.Model)) {
                        attr.cleanDirty(val);
                    } else if (attr instanceof (Backbone.Collection)) {
                        attr.isDirty(false);
                        attr.each(function(model) {
                            var matchingAttrs = _.find(val,
                                function(modelAttrs) {
                                    return modelAttrs[model.idAttribute] === model.id;
                                });
                            if (matchingAttrs) {
                                model.cleanDirty(matchingAttrs);
                            }
                        });
                    }
                });
        };

        Backbone.Model.prototype.isAnythingDirty = function() {
            if (this.dirty) {
                return true;
            } else {
                var attributes = _.clone(this.attributes);
                return _.any(attributes,
                    function(attr) {
                        if (attr instanceof (Backbone.Model) || attr instanceof (Backbone.Collection)) {
                            return attr.isAnythingDirty();
                        } else {
                            return false;
                        }
                    });
            }
        };

        Backbone.Model.prototype.isDirty = function(set) {
            if (set === undefined) {
                if (this.dirty) {
                    return true;
                }
            } else if (typeof (set) === "boolean") {
                this.dirty = set;
            }
        };

        Backbone.Model.prototype.load = function(propertyName, options) {
            options || (options = {});

            var success = options.success;
            var error = options.error;
            var complete = options.complete;

            delete options["success"];
            delete options["error"];
            delete options["complete"];

            function load(propertyNames) {
                var self = this;

                if (!(propertyNames instanceof (Array))) {
                    propertyNames = [propertyNames];
                }

                var toLoad = [];

                var maxHierarchy = 0;

                _.each(propertyNames,
                    function(propertyName) {
                        var propetyNameElements = propertyName.split(".");

                        var path;
                        var index = 0;

                        maxHierarchy = maxHierarchy > propetyNameElements.length
                            ? maxHierarchy
                            : propetyNameElements.length;

                        _.each(propertyNameElements,
                            function(propertyNameElement) {
                                path = path ? path + "." + propertyNameElement : propertyNameElement;

                                toLoad.push({
                                    tier: index,
                                    path: path,
                                    name: propertyNameElement
                                });

                                index++;
                            });
                    });

                var promise = $.when({});

                for (var i = 0; i < maxHierarchy; i++) {
                    promise = promise.then(function() {
                        return loadNextTier.call(self, toLoad);
                    });
                }

                return $.when(promise).done(success).fail(error).always(complete);
            };

            var tierIndex = 0;

            function loadNextTier(toLoad) {
                var self = this;
                var tierLoads = _.chain(toLoad)
                    .filter(function(load) { return load.tier === tierIndex; })
                    .unique(function(load) { return load.path; }).value();

                var executionSteps = _.map(tierLoads,
                    function(load) {
                        return loadProperty.call(self, load.path, options);
                    });
                tierIndex++;

                return $.when.apply($, _.flatten(executionSteps));
            };

            function loadProperty(path, options) {
                var self = this;

                var property = self;

                var pathElements = path.split(".");

                for (var i = 0; i < pathElements.length; i++) {
                    var pathElement = pathElements[i];

                    property = property.get(pathElement);

                    if (i !== pathElements.length - 1) {
                        self = property;

                        if (property instanceof (Backbone.Collection)) {
                            return property.map(function(model) {
                                return loadProperty.call(model,
                                    pathElements.slice(i + 1).join("."));
                            });
                        }
                    }
                }

                return getPropertyLoad.call(self, property, options);
            }

            function getPropertyLoad(property, options) {
                var xhr;

                if (property instanceof (Backbone.Model)) {
                    //1:1
                    var updatedId = {};
                    updatedId[property.idAttribute] = this.id;
                    property.set(updatedId);
                    xhr = property.fetch();
                } else if (property instanceof (Backbone.Collection)) {
                    //One to Many or One
                    var data = {};
                    data[this.name + "Id"] = this.id;
                    var filter = { data: data }
                    xhr = property.fetch(_.extend(filter, options));
                } else {
                    //Something that can't be loaded
                    throw "Could not load requested property";
                }
                return xhr;
            }

            return load.call(this, propertyName, options);
        };

        var originalBackboneSet = Backbone.Model.prototype.set;
        Backbone.Model.prototype.set = function(key, val, options) {
            var self = this;
            var attrs;
            var modelProperty;

            if (key == null) return this;

            if (typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }
            options || (options = {});

            attrs = _.clone(attrs);

            _.chain(attrs).pairs().each(function(attr) {
                var attrKey = attr[0];
                var attrValue = attr[1];

                if (self.get(attrKey)) {
                    if (attrValue instanceof (Backbone.Model)) {
                        attrValue = attrValue.attributes;
                    } else if (attrValue instanceof (Backbone.Collection)) {
                        attrValue = attrValue.toJSON();
                    }
                }

                if (self instanceof (Backbone.Model)) {
                    if (self.defaults &&
                    ((self.defaults()[attrKey] instanceof (Backbone.Model) &&
                            !(self.attributes[attrKey] instanceof (Backbone.Model)) &&
                            !(attrValue instanceof (Backbone.Model))) ||
                        (self.defaults()[attrKey] instanceof (Backbone.Collection) &&
                            !(self.attributes[attrKey] instanceof (Backbone.Collection)) &&
                            !(attrValue instanceof (Backbone.Collection))))) {
                        self.set(attrKey, self.defaults()[attrKey]);
                    }


                    modelProperty = self.get(attrKey);
                    if (modelProperty instanceof (Backbone.Model)) {
                        if (attrValue) {
                            modelProperty.set(attrValue);
                        }
                        if (!options.unset || !options.allowNestedModelErase) {
                            delete attrs[attrKey];
                        }
                    } else if (modelProperty instanceof (Backbone.Collection)) {
                        if (attrValue) {
                            if (modelProperty.length === attrValue.length) {
                                //TODO: there is a mention of handling model fetch when no id is set. Might be worth looking into here!!!
                                for (var i = 0; i < modelProperty.length; i++) {
                                    modelProperty.models[i].set(attrValue[i]);
                                }
                            } else {
                                //Custom reset method to handle nested collections
                                modelProperty.reset();
                                _.each(attrValue,
                                    function(modelAttrs) {
                                        var model = new modelProperty.model();
                                        model.set(modelAttrs);
                                        modelProperty.add(model);
                                    });
                            }
                        }
                        if (!options.unset || !options.allowNestedModelErase) {
                            delete attrs[attrKey];
                        }
                    }
                } else if (self instanceof (Backbone.Collection)) {
                    self.each(function(model) {
                        modelProperty = model.get(attrKey);
                        if (modelProperty instanceof (Backbone.Model)) {
                            delete attrs[attrKey];
                            modelProperty.set(attrValue);
                        } else if (modelProperty instanceof (Backbone.Collection)) {
                            delete attrs[attrKey];
                            modelProperty.reset(attrValue);
                        }
                    });
                }
            });

            return originalBackboneSet.call(self, attrs, options);
            
        };

        var wrapError = function(model, options) {
            var error = options.error;
            options.error = function(resp) {
                if (error) error(model, resp, options);
                model.trigger('error', model, resp, options);
            };
        };

        var saveSubModels = function(method, model, options) {

            var xhrs = [];

            if (method === "update" || method === "patch") {
                var newAttrs = options.attrs || _.clone(model.attributes);

                var subOptions = {};
                subOptions.onlyDirty = options.onlyDirty;

                _.each(newAttrs,
                    function(val, key) {
                        if (val instanceof (Backbone.Model)) {
                            delete newAttrs[key];
                            xhrs.push.apply(xhrs, save.call(val, {}, subOptions));
                        } else if (val instanceof (Backbone.Collection)) {
                            delete newAttrs[key];
                            val.isDirty(false);
                            val.each(function(collectionModel) {
                                xhrs.push.apply(xhrs, save.call(collectionModel, {}, subOptions));
                            });
                        }
                    });

                options.attrs = newAttrs;
            }

            return xhrs;
        };

        var save = function(key, val, options) {
            var attrs, method, xhr, xhrs = [], attributes = this.attributes;

            //Handle two different argument types: "key", value and '{key: value}' -style arguments
            if (key == null || typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }

            options = _.extend({ validate: true }, options);

            // TODO: Comment taken from original, need to revisit once i have more familiarity with javascript
            // If we're not waiting and attributes exist, save acts as
            // `set(attr).save(null, opts)` with validation. Otherwise, check if
            // the model will be valid when the attributes, if any, are set.
            if (attrs && !options.wait) {
                if (!this.set(attrs, options)) return false;
            } else {
                if (!this._validate(attrs, options)) return false;
            }

            //Set temporary attributes if wait is set to true
            if (attrs && options.wait) {
                this.attributes = _.extend({}, attributes, attrs);
            }

            //After sucessfully server side, the client can be updated with the server side state
            if (options.parse === void 0) options.parse = true;
            var model = this;
            var success = options.success;
            options.success = function(resp) {
                //Ensure attributes are restored during synchronous saves
                model.attributes = attributes;
                var serverAttrs = model.parse(resp, options);
                if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
                if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
                    return false;
                }
                if (success) success(model, resp, options);

                model.trigger('sync', model, resp, options);
            };
            wrapError(this, options);

            method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
            if (method === 'patch') options.attrs = attrs;

            //Custom save code taken from backbone-nested.js in the IPC website
            //Save submodels
            if (!options.noRecursion) {
                xhrs.push.apply(xhrs, saveSubModels(method, model, options));
            }

            //Don't save if onlyDirty is specified and model is not dirty
            if (!(options.onlyDirty && !this.isDirty())) {
                xhrs.push(this.sync(method, this, options));
            }

            //Restore attributes
            if (attrs && options.wait) this.attributes = attributes;

            return xhrs;
        }

        Backbone.Model.prototype.save = function(key, val, options) {
            if (key == null || typeof key === 'object') {
                options = val;
            }

            options || (options = {});

            var success = options.success;
            var error = options.error;
            var complete = options.complete;

            delete options["success"];
            delete options["error"];
            delete options["complete"];

            var deferreds = save.call(this, key, val, options);

            return $.when.apply($, deferreds).done(success).fail(error).always(complete);
        };
    });
