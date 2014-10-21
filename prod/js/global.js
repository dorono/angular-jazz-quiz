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
        $scope.data = {};
        //$scope.data.answer = false;
        $scope.valid = null;


        $scope.submitAnswer = function(){

            $scope.valid = quizFactory.checkAnswer($scope.data.submittedAnswer,$scope.questNum,$scope.quizContent);
            $scope.submitted = true;
            console.log("submitted");


        };

        $scope.nextQuestion = function () {
            // queue up the next question
            $scope.questNum++;
            // hide the feedback
            $scope.submitted = false;
            $scope.data = {};
            // hide the "next" button
            // $scope.nextBtnDisplay = false;
        }


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

    var questions = [];

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
        },
        checkAnswer: function(submittedAnswer,questNum,questionList){

            // check to see if answer is correct and supply appropriate response
            console.log("here is the question data: " + questionList);

            return submittedAnswer;
        }
    };
}]);
