/*global console, angular*/
(function () {
    "use strict";
    var app = angular.module("EvalApp", ["ngRoute", "ngMaterial"]);
    
    app.controller("AppCtrl", ['$scope', function ($scope) {
        $scope.name = "Evaluation Application";
    }]);
    
    app.controller("HeuristicsListCtrl", ["$scope", "$http", "Heuristics", function ($scope, $http, Heuristics) {
        $scope.heuristics = Heuristics.getHeuristics();
    }]);
    
    app.controller("AddHeuristicCtrl", ["$scope", "Heuristics", "$location", function ($scope, Heuristics, $location) {
        $scope.heuristic = {};
        $scope.save = function () {
            Heuristics.addHeuristic($scope.heuristic);
            $location.path("#/heuristics");
        };
        
        $scope.cancel = function () {
            $location.path("#/heuristics");
        };
    }]);
    
    app.controller("DevicesListCtrl", ["$scope", "Devices", function ($scope, Devices) {
        $scope.devices = Devices.getDevices();
    }]);
    
    app.controller("AddDeviceCtrl", ["$scope", "Devices", "$location", function ($scope, Devices, $location) {
        $scope.device = {};
        
        $scope.save = function () {
            Devices.addDevice($scope.device);
            $location.path("#/devices");
        };
        
        $scope.cancel = function () {
            $location.path("#/devices");
        };
    }]);
    
    app.controller("StartEvalCtrl", ["$scope", "Devices", "Heuristics", "EvaluationData", function ($scope, Devices, Heuristics, EvaluationData) {
        
        function updateScope () {
            EvaluationData.save();
            $scope.currentEval = evalData[currentHeuristicIndex][currentDeviceIndex];
            $scope.device = devices[currentDeviceIndex];
            $scope.heuristic = heuristics[currentHeuristicIndex];
        }
        
        var devices = Devices.getDevices();
        var heuristics = Heuristics.getHeuristics();
        
        var currentDeviceIndex = EvaluationData.currentDeviceIndex || 0;
        var currentHeuristicIndex = EvaluationData.currentHeuristicIndex || 0;
        
        var evalData = EvaluationData.getData();
        evalData[currentHeuristicIndex] = evalData[currentHeuristicIndex] || [];
        evalData[currentHeuristicIndex][currentDeviceIndex] = 
            evalData[currentHeuristicIndex][currentDeviceIndex] || {};
       
        
        updateScope();
        
        $scope.next = function () {
            if (currentHeuristicIndex < heuristics.length - 1) {
                currentHeuristicIndex++;
            } else {
                if (currentDeviceIndex < devices.length - 1) {
                    currentDeviceIndex++;
                    currentHeuristicIndex = 0;
                } else {
                    //we are done iterating
                    currentDeviceIndex = currentHeuristicIndex = 0;
                }
            }
            updateScope();
        };
        
        $scope.previous = function () {
            if (currentHeuristicIndex > 0) {
                currentHeuristicIndex--;
            } else {
                if (currentDeviceIndex > 0) {
                    currentDeviceIndex--;
                    currentHeuristicIndex = heuristics.length - 1;
                } else {
                    currentDeviceIndex = devices.length - 1;
                    currentHeuristicIndex = heuristics.length - 1;
                }
            }
            updateScope();
        };
    }]);
    
    app.config(["$routeProvider", function ($routeProvider) {
        $routeProvider.when("/heuristics", {
            templateUrl: "templates/heuristics.html",
            controller: "HeuristicsListCtrl"
        })
        .when("/addheuristic", {
            templateUrl: "templates/add-heuristic.html",
            controller: "AddHeuristicCtrl"
        })
        .when("/devices", {
            templateUrl: "templates/devices.html",
            controller: "DevicesListCtrl"
        })
        .when("/adddevice", {
            templateUrl: "templates/add-device.html",
            controller: "AddDeviceCtrl"
        })
        .when("/start", {
            templateUrl: "templates/start-eval.html",
            controller: "StartEvalCtrl"
        })
        .otherwise({redirectTo: "/heuristics"});
    }]);
}());