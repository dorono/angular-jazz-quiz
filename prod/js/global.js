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
        })
        .when('/score', {
            templateUrl: '/partials/score.html',
            controller: 'ScoreCtrl',
            resolve: {
                success: function (quizFactory) {
                    return quizFactory.getSuccessMessages();
                }
                // TODO: create handler for if resolve fails
            }
        });

        $routeProvider.otherwise({redirectTo: '/'});

    }]);

})();

var ctrl = angular.module('JazzQuiz.controllers', []);

/*************************************
 * CONTROLLER FOR QUIZ PAGE          *
 *************************************/
ctrl.controller('QuizCtrl', function($scope, $timeout, $location, quizFactory, questions, responses) {

    // all controllers do is to populate data into scope
    $scope.quizContent = questions;
    $scope.responses = responses;
    $scope.questNum = 0;
    $scope.data = {};
    $scope.valid = null;
    $scope.displayNextBtn = false;
    var numQuestions = quizFactory.countQuestions(),
        score = 0;

    $scope.submitAnswer = function() {
        $scope.valid = quizFactory.checkAnswer($scope.data.submittedAnswer, $scope.questNum, $scope.quizContent);

        $scope.submitted = true;

        if ($scope.valid) {
            score++;
            $scope.feedback = $scope.responses[0].correct;
        } else {
            $scope.feedback = $scope.responses[0].incorrect;
        }

        console.log("score from quiz controller: " + score);


        if (($scope.questNum + 1) < numQuestions) {
            $scope.displayNextBtn = true;
        } else {
            // if the last question has been answered, wait and then redirect to score page
            $timeout(function () {
                quizFactory.submitScore(score);
                $location.path("score");
            }, 2000);
        }
    };

    $scope.nextQuestion = function () {
        // queue up the next question
        $scope.questNum++;
        $scope.submitted = false;
        $scope.displayNextBtn = false;
        $scope.data = {};
    }

});

/*************************************
 * CONTROLLER FOR SCORE PAGE         *
 *************************************/
ctrl.controller('ScoreCtrl', function ($scope, quizFactory, success) {
    $scope.score = quizFactory.getScore();
    console.log("this is the score: " + $scope.score);
});

var services = angular.module('JazzQuiz.services' ,[]);

services.factory('quizFactory', ['$http', function($http){

    var questions = [],
        numberOfQuestions,
        totalScore;

    return {
        getQuestions: function(){
            return $http.get('../json/questions.json').then(function(result){
                numberOfQuestions = result.data.length;
                return result.data;
            });
        },
        getResponses: function(){
            return $http.get('../json/submissionResponses.json').then(function(result){
                return result.data;
            });
        },
        checkAnswer: function(submittedAnswer,questionNum,questionList){
            // check to see if answer is correct and supply appropriate response
            return submittedAnswer === questionList[questionNum].correctAnswer;
        },
        countQuestions: function(){
            return numberOfQuestions;
        },
        getSuccessMessages: function(){
            return $http.get('../json/successMessages.json').then(function(result) {
                return result.data;
            });
        },
        submitScore: function(quizScore){
            totalScore = quizScore;
            return quizScore;
        },
        getScore: function(){
            return totalScore;
        }
    };
}]);
