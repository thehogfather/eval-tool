/*global angular, console, localStorage*/
var app = angular.module("EvalApp");

function set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function get(key) {
    var str = localStorage.getItem(key);
    try{
        return JSON.parse(str);
    } catch (err) {
        return null;   
    }
}

app.service("Heuristics", ["$http", function ($http) {
    "use strict";
    var heuristics = get("heuristics") || [];
    if (heuristics.length === 0) {
        $http.get("data/heuristics.json").then(function (res) {
            console.log(res);
            res.data.heuristics.forEach(function (d) {
                heuristics.push(d);
            });
        }, function (err) {
            console.log(err);
        });
    }
   
    
    return {
        getHeuristics: function () {
            return heuristics;
        },
        addHeuristic: function (h) {
            heuristics.push(h);
            set("heuristics", heuristics);
        }
    };
}]);

app.service("EvaluationData", function () {
    "use strict";
    var data = get("evaluationdata") || {};
    
    return {
        getData: function () {
            return data;
        }, 
        save: function () {
            set("evaluationdata", data);
        }
    };
});

app.service("Devices", function () {
    "use strict";
    var devices = get("devices") || [];
    
    return {
        addDevice: function (d) {
            devices.push(d);
            set("devices", devices);
        },
        getDevices: function () {
            return devices;   
        }
    };
});