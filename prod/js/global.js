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

    $scope.quizContent = questions;
    $scope.responses = responses;
    $scope.data = {};
    $scope.valid = null;
    $scope.displayNextBtn = false;

    var numQuestions = quizFactory.countQuestions(),
        score = 0,
        questArray = quizFactory.randomizeQuestions(),
        questArrayIndex = 0,
        questionId;


    $scope.questNum = questArray[questArrayIndex];
    console.log('quest num: ' + $scope.questNum);

    $scope.submitAnswer = function(correctAnswer) {
        console.log('this is the correct answer: '  + correctAnswer);
        $scope.valid = Number($scope.data.submittedAnswer) === correctAnswer;

        $scope.submitted = true;

        if ($scope.valid) {
            score++;
            $scope.feedback = $scope.responses[0].correct;
        } else {
            $scope.feedback = $scope.responses[0].incorrect;
        }

        if ((questArrayIndex + 1) < numQuestions) {
            $scope.displayNextBtn = true;
        } else {
            /* if the last question has been answered, wait
            and then redirect to score page */
            $timeout(function () {
                quizFactory.submitScore(score);
                $location.path("score");
            }, 2000);
        }
    };

    $scope.nextQuestion = function () {
        // queue up the next question
        questArrayIndex++;
        $scope.questNum = questArray[questArrayIndex];
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
    $scope.summaryData = quizFactory.quizSummary();

});

var services = angular.module('JazzQuiz.services' ,[]);

services.factory('quizFactory', ['$http', function($http){

    var questions = [],
        numberOfQuestions,
        questionNumberArray = [],
        newArray = [],
        totalScore,
        numSuccessMessages,
        scoreLevel,
        successMessages,
        scorePercentage,
        quizSuccessMessage;

    return {
        getQuestions: function(){
            return $http.get('../json/questions.json').then(function(result){
                numberOfQuestions = result.data.length;

                for(var i = 0; i < numberOfQuestions; i++) {
                    questionNumberArray.push(i);
                }

                // convert numbers to strings
                var stringNumber;
                for(i=0; i < 4; i++) {
                    stringNumber = questionNumberArray[i].toString();
                    newArray.push(stringNumber);
                }

                // shuffle the strings
                function shuffle(o) { //v1.0
                    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                    console.log(o);
                    return o;
                }

                shuffle(questionNumberArray);
                return result.data;
            });
        },
        randomizeQuestions: function(){
            return newArray;
        },
        getResponses: function(){
            return $http.get('../json/submissionResponses.json').then(function(result){
                return result.data;
            });
        },
        countQuestions: function(){
            return numberOfQuestions;
        },
        getSuccessMessages: function(){
            return $http.get('../json/successMessages.json').then(function(result) {
                successMessages = result.data;
                numSuccessMessages = result.data.length;
                return result.data;
            });
        },
        submitScore: function(quizScore){
            totalScore = quizScore;
            return quizScore;
        },
        getScore: function(){
            return totalScore;
        },
        quizSummary: function(){
            // calculate the percentage score
            scorePercentage = Math.floor(Number(totalScore / numberOfQuestions * 100));
            scoreLevel = Math.floor(Number(100 / numSuccessMessages));

            // if the user got none right, give them the very first message
            if (scorePercentage === 0) {
                quizSuccessMessage = successMessages[0].message;
            } else if (scorePercentage === 100) {
                // if the user got a perfect score, give them the very last message
                quizSuccessMessage = successMessages[numSuccessMessages - 1].message;
            } else {
                /* otherwise, locate the message that sits
                within the appropriate range of scores */
                var i;
                for (i = 0; i < numSuccessMessages; i++) {
                    if (scorePercentage < (scoreLevel * (i + 1))) {
                        quizSuccessMessage = successMessages[i - 1].message;
                        break;
                    }
                }
            }

            return {
                scorePercentage: scorePercentage,
                quizSuccessMessage: quizSuccessMessage
            }
        }
    }
}]);

