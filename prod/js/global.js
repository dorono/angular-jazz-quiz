var app = angular.module('myApp', ['myApp.services', 'myApp.controllers', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/main', {
    templateUrl: '/partials/app-test.html',
    controller: 'ResponsesCtrl',
    resolve: {
      responses: function(responseLibrary) {
        return responseLibrary.getResponses();
      }
    }
  });

  $routeProvider.otherwise({redirectTo: '/'});

}]);


// app.run(['$rootScope', function($root) {

//   $root.$on('$routeChangeStart', function(e, curr, prev) {
//     if (curr.$$route && curr.$$route.resolve) {
//       // Show a loading message until promises are not resolved
//       $root.loadingView = true;
//     }
//   });

//   $root.$on('$routeChangeSuccess', function(e, curr, prev) {
//     // Hide loading message
//     $root.loadingView = false;
//   });


var ctrl = angular.module('myApp.controllers', []);

ctrl.controller('ResponsesCtrl', ['$scope', 'responses', function($scope, responses) {
    $scope.responses = responses.data;
}]);

var services = angular.module('myApp.services', []);


services.factory('responseLibrary', ['$http', function($http) {

    var resp = {

        getResponses: function() {

            var promise = $http({ method: 'GET', url: '../json/submissionResponses.json' }).success(function(data, status, headers, config) {
                return data;
            });

            return promise;

        }

    }

    return resp;

}]);
