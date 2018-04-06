define(["jquery", "underscore", "moment"], function ($, _, moment) {

    var ModelStore = function () {

        var self = this;

        this.intervals = [];

        //Create collection variables here
        var refrigerator = [];

        var searchFridge = function (name) {
            return _.find(refrigerator, function (item) {
                return item.name === name;
            });
        };

        var isStale = function (name) {
            var item = searchFridge(name);

            if (item) {
                if (item.lastFetched === null) {
                    return true;
                }
                var cloneLastFetched = moment(item.lastFetched);
                return cloneLastFetched.add(item.staleAfter).isBefore(moment());
            }

            throw "Cannot find item in fridge with name: " + name;
        };

        var updateLastFetched = function (name) {
            var item = searchFridge(name);
            item.lastFetched = moment();
        }

        var restock = function (name, options) {
            var self = this;

            var item = searchFridge(name);

            if (!item.promise || item.promise.state() !== "pending") {
                console.log("Fetching Data for: " + name);

                var requirePromises = [];

                if (item.requires) {
                    _.each(item.requires, function (require) {
                        requirePromises.push(self.getPromise(require));
                    });
                }

                var deferred = $.Deferred();
                item.promise = deferred.promise();

                $.when.apply(this, requirePromises).done(function () {
                    item.restock(options).done(function () {
                        updateLastFetched(name);
                        console.log("Fetching Data Successful for: " + name);
                        deferred.resolve();
                    }).fail(function () {
                        deferred.reject();
                    });
                }).fail(function () {
                    deferred.reject();
                });
            }

            return item.promise;
        }

        this.resetLastFetched = function () {
            _.each(refrigerator, function (item) {
                item.lastFetched = null;
            });
        }

        this.resetItem = function (itemName) {
            var itemToReset = _.find(refrigerator, function (item) {
                return item.name === itemName;
            });

            itemToReset.lastFetched = null;
        }

        this.get = function (name, options) {

            options = options || {};

            var item = searchFridge(name);

            if (options.forceRefresh || isStale(name)) {
                restock.call(this, name, options);
            }

            return item.data();
        }

        this.getPromise = function (name, options) {

            options = options || {};

            var item = searchFridge(name);

            var deferred = $.Deferred();

            var promise = deferred.promise();

            if (options.forceRefresh || isStale(name)) {
                restock.call(this, name, options).done(function () {
                    deferred.resolve(item.data());
                });
            } else {
                deferred.resolve(item.data());
            }

            return promise;
        }

        this.startRefreshInterval = function (name, milliseconds, options) {
            var self = this;
            if (!_.any(this.intervals, function (interval) { return interval.name === name; })) {
                this.intervals.push({
                    name: name,

                    interval: window.setInterval(function () {
                        self.get.call(self, name, options);
                    }, milliseconds)
                });
            }
        }

        this.stopRefreshInterval = function (name) {
            var refreshInterval = _.find(this.intervals, function (interval) { return interval.name === name; });
            if (refreshInterval) {
                window.clearInterval(refreshInterval.interval);
                this.intervals = _.without(this.intervals, refreshInterval);
            }
        }
    }

    var modelStore = new ModelStore();

    return modelStore;
});