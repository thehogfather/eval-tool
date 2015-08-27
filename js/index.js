/*global console, angular*/
(function () {
    "use strict";
    var app = angular.module("EvalApp", ["ngRoute", "ngMaterial"]);

    app.controller("AppCtrl", ['$scope', function ($scope) {
        $scope.name = "Evaluation Application";
    }]);

    app.controller("MainCtrl", ["$scope", "$http", "Heuristics", "Devices", "EvaluationData", "SelectedTab", function ($scope, $http, Heuristics, Devices, EvaluationData, SelectedTab) {
        $scope.heuristics = Heuristics.getHeuristics();
        $scope.devices = Devices.getDevices();
        $scope.evalData = EvaluationData.getData();
        $scope.selectedTabIndex = SelectedTab.getSelectedTab();

        $scope.$watch("selectedTabIndex", function (current, old) {
            SelectedTab.setSelectedTab(current);
        });

        $scope.selectCell = function (hindex, dindex) {
            $scope.evalData.currentDeviceIndex = +dindex;
            $scope.evalData.currentHeuristicIndex = +hindex;
            $scope.currentEval = $scope.evalData[hindex][dindex];
        };

        $scope.save = function () {
            Heuristics.save();
        };

        $scope.addNewHeuristic = function (h) {
            Heuristics.addHeuristic(h);
        };

        $scope.removeHeuristic = function () {
            var selected = Heuristics.getHeuristics().filter(function (h) {
                return h.selected;
            });
            
            selected.forEach(function (h) {
                Heuristics.remove(h);
            });
        };

        $scope.addNewDevice = function (d) {
            Devices.addDevice(d);
        };

        $scope.removeDevice = function () {
            var selected = Devices.getDevices().filter(function (d) {
                return d.selected;
            });
            selected.forEach(function (d) {
                Devices.remove(d);
            });
        };
        
        $scope.returnFalse = function () {
            return false;
        };
    }]);

    app.controller("StartEvalCtrl", ["$scope", "Devices", "Heuristics", "EvaluationData", "SelectedTab", "$location", function ($scope, Devices, Heuristics, EvaluationData, SelectedTab, $location) {

        var devices = Devices.getDevices();
        var heuristics = Heuristics.getHeuristics();
        var evalData = EvaluationData.getData();
        var currentDeviceIndex = evalData.currentDeviceIndex || 0;
        var currentHeuristicIndex = evalData.currentHeuristicIndex || 0;

        function updateScope () {
            evalData[currentHeuristicIndex] = evalData[currentHeuristicIndex] || [];
            evalData[currentHeuristicIndex][currentDeviceIndex] =
            evalData[currentHeuristicIndex][currentDeviceIndex] || {};

            EvaluationData.save();
            $scope.currentEval = evalData[currentHeuristicIndex][currentDeviceIndex];
            $scope.device = devices[currentDeviceIndex];
            $scope.heuristic = heuristics[currentHeuristicIndex];
        }

        updateScope();

        $scope.gotoHeuristics = function () {
            SelectedTab.setSelectedTab(0);
            $location.path("#/main");
        };

        $scope.gotoDevices = function () {
            SelectedTab.setSelectedTab(1);
            $location.path("#/main");
        };

        $scope.gotoMatrix = function () {
            SelectedTab.setSelectedTab(2);
            $location.path("#/main");
        };
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
        $routeProvider.when("/main", {
            templateUrl: "templates/main.html",
            controller: "MainCtrl"
        })
        .when("/start", {
            templateUrl: "templates/start-eval.html",
            controller: "StartEvalCtrl"
        })
        .otherwise({redirectTo: "/main"});
    }]);
}());
