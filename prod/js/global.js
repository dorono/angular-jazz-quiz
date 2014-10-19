(function() {

    var JazzQuiz = angular.module('JazzQuiz', ['JazzQuiz.services', 'JazzQuiz.controllers', 'ngRoute']);

    JazzQuiz.config(['$routeProvider', function($routeProvider) {

        $routeProvider
        .when('/', {
            templateUrl: '/partials/quiz.html',
            controller: 'QuizCtrl',
            resolve: {
                questions: function (quizFactory) {
                    return quizFactory.getQuestions();
                },
                responses: function (quizFactory) {
                    return quizFactory.getResponses();
                }

                // TODO: create handler for if resolve fails
            }
        });

        $routeProvider.otherwise({redirectTo: '/'});

    }]);

})();

    var ctrl = angular.module('JazzQuiz.controllers', []);

    ctrl.controller('QuizCtrl', function($scope, quizFactory, questions, responses) {
        // all controllers do is to populate data into scope
        $scope.quizContent = questions;
        $scope.responses = responses;

        $scope.questNum = 0;

        $scope.submitAnswer = quizFactory.submitAnswer;
    });



//    // controller that handles the display of questions and handling of answers
//    ctrl.controller('QuizCtrl', function ($scope, $http, $location, $rootScope, $timeout, questions, responses){
//
//        $scope.quizContent = questions;
//        $scope.quizResponses = responses;
//
//        //this spits out the entire object in the console
//        console.log(questions);
//
//        //this gives me an error
//        //console.log(questions[0].correctAnswer);
//
//        // more to come...
//    });

var services = angular.module('JazzQuiz.services' ,[]);

services.factory('quizFactory', ['$http', function($http){
    return {
        getQuestions: function(){
            return $http.get('../json/questions.json').then(function(result){
                return result.data;
            });
        },
        getResponses: function(){
            return $http.get('../json/submissionResponses.json').then(function(result){
                return result.data;
            });
        }
    }
}]);
