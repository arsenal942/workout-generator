define(["jquery", "underscore"],
    function($, _) {
        function TemplateLoader() {
            var loadedTemplates = [];

            function appendTemplate(templateName) {
                return $.get("templates/" + templateName + ".html",
                    function(data) {
                        var toInsert = $("<script type='text/html' id='" + templateName + "'>" + data + "</script>");
                        toInsert.appendTo("body");
                        loadedTemplates.push(templateName);
                    });
            }

            this.loadTemplate = function(templateName) {
                var deferred = $.Deferred();

                if (_.contains(loadedTemplates, templateName)) {
                    deferred.resolve();
                } else {
                    $.when(appendTemplate(templateName)).done(function() {
                        deferred.resolve();
                    });
                }

                return deferred.promise();
            }
        }

        var templateLoader = new TemplateLoader();

        return templateLoader;
    });