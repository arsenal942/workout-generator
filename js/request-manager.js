define(["jquery", "underscore"], function ($, _) {

    var RequestManager = function() {

        var failedRequests = [];

        var pendingRequests = [];

        function addOrUpdateFailedRequest(options, deferred) {

            var existingIndex = null;

            var url = _.isFunction(options.url) ? options.url() : options.url;

            _.find(failedRequests, function (failedRequest, index) {

                var failedRequestUrl = _.isFunction(failedRequest.url) ? failedRequest.url() : failedRequest.url;

                if (failedRequestUrl === url && failedRequest.type === options.type) {
                    existingIndex = index;
                    return true;
                }
                return false;
            });

            if (existingIndex) {
                console.log("ajaxError replacing existing in retry queue: " + url);
                failedRequests[existingIndex] = {
                    xhrOptions: options,
                    deferred: deferred
                };
            } else {
                console.log("ajaxError adding to retry queue: " + url);
                failedRequests.push({
                    xhrOptions: options,
                    deferred: deferred
                });
            }
        }

        $.ajaxPrefilter(function (options, originalOptions, xhr) {
            options = options || {};

            if (!options.noCancel) {
                pendingRequests.push(xhr);
            }

            var deferred = $.Deferred();

            var success = options.success;
            var error = options.error;
            var complete = options.complete;

            delete options.success;
            delete options.error;
            delete options.complete;

            xhr.done(function () {
                if (success) {
                    success.apply(this, arguments);
                }
                deferred.resolve.apply(this, arguments);
            });

            xhr.fail(function() {
                if (error) {
                    error.apply(this, arguments);
                }
                deferred.reject.apply(this, arguments);
            });

            xhr.always(function () {
                if (complete) {
                    complete.apply(this, arguments);
                }
                pendingRequests = _.without(pendingRequests, xhr);
            });

            if (!options.noRetry) {
                xhr.fail(function () {
                    if (xhr.status === 401) {
                        if (options.url !== window.apiUrl) {
                            console.log("authentication-failed");
                            require(["js/vent"], function(vent) {
                                vent.trigger("authentication-failed");
                            });
                        }
                    } else if (!(xhr.status === 0 && xhr.statusText === "abort")) {
                        addOrUpdateFailedRequest(originalOptions, deferred);
                        console.log("request-failed");
                        require(["js/vent"], function (vent) {
                            vent.trigger("request-failed");
                        });
                    }
                });
            }

            return deferred.promise(xhr);
        });

        this.retryFailedRequests = function () {
            var failedRequest;
            while ((failedRequest = failedRequests.pop()) != null) {
                if (failedRequest.xhrOptions.showPreloader === true) {
                    console.log("Showing preloader");
                    require(["js/app7"], function(app7) {
                        app7.showPreloader("Retrying Request");
                    });
                }
                console.log("Retrying request to: " + failedRequest.url);
                $.ajax(failedRequest.xhrOptions).done(failedRequest.deferred.resolve, function() {
                    require(["js/app7"], function(app7) {
                        app7.hidePreloader();
                        app7.alert("", "Success");
                    });
                }).fail(function() {
                    require(["js/app7"], function(app7) {
                        app7.hidePreloader();
                    });
                });
            }
        }

        this.purgeAllRequests = function() {
            this.purgeFailedRequests();
            this.purgePendingRequests();
        }

        this.purgeFailedRequests = function() {
            var failedRequest;
            while ((failedRequest = failedRequests.pop()) != null) {
                failedRequest.deferred.reject();
            }
        }

        this.purgePendingRequests = function() {
            var pendingRequest;
            while ((pendingRequest = pendingRequests.pop()) != null) {
                pendingRequest.abort();
            }
        }
    };
    
    return new RequestManager();
});