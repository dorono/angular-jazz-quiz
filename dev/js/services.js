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
