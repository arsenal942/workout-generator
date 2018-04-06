define([],
    function() {
        JSON.toJSV = function(json) {
            var jsv = "";
            if (json instanceof Array) {
                return JSON.stringify(json).replace(/\"/g, "");
            }
            for (var attr in json) {
                jsv += "&" + attr + "=" + JSON.stringify(json[attr]).replace(/\"/g, "");
            };
            jsv = jsv.substr(1);
            return jsv;
        }
    });