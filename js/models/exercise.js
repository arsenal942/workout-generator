define(["backbone"], function (Backbone) {

    return Backbone.Model.extend({

        defaults: function () {
            return {
                "name": "",
                "value": "",
                "type": "",
                "category": [],
                "maxReps": 0,
                "maxSets": 0,
                "minReps": 0,
                "minSets": 0,
                "reps": 0,
                "sets": 0,
                "canSuperset": false
            }
        }
    });
});