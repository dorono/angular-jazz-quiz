var ctrl = angular.module('myApp.controllers', []);

ctrl.controller('ResponsesCtrl', ['$scope', 'responses', function($scope, responses) {
    $scope.responses = responses.data;
}]);
