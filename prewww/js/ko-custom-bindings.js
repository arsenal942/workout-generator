define(["jquery", "underscore", "knockout", "moment"],
    function($, _, ko, moment) {
        ko.bindingHandlers.disablingOptionsCaption = {
            init: function(element) {
                ko.applyBindingsToNode(element,
                {
                    optionsAfterRender: function(option, item) {
                        ko.applyBindingsToNode(option,
                            {
                                disable: !item
                            },
                            item);
                    }
                });
            }
        };

        ko.bindingHandlers.tryText = {
            init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){

            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
                var available = true;

                try {
                    valueAccessor();
                } catch (exception) {
                    available = false;
                }
                if (available) {
                    ko.bindingHandlers.text.update(element, valueAccessor);
                }
            }
        };

        ko.bindingHandlers.tryAttr = {
            init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){

            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
                var available = true;

                try {
                    valueAccessor();
                } catch (exception) {
                    available = false;
                }
                if (available) {
                    ko.bindingHandlers.attr.update(element, valueAccessor);
                }
            }
        };

});