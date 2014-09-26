(function() {

    var JazzQuiz = angular.module('JazzQuiz', ['ngRoute']);

    JazzQuiz.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/', {
                templateUrl: '/partials/quiz.html',
                controller: 'quiz',
            }).
            when('/score', {
                templateUrl: '/partials/score.html',
                controller: 'scoreScreen'
            });
        }
    ]);

    /*************************************
     * CONTROLLER FOR QUIZ PAGE
     *************************************/
    JazzQuiz.controller('quiz', function($scope, $http, $location, $route,  $rootScope, $timeout) {

        $http({
            method: 'GET',
            url: '../json/questions.json'
        }).
        success(function(data) {
            $scope.quizContent = data;
            $scope.numberOfQuestions = $scope.quizContent.length;
            $rootScope.numberOfQuestions = $scope.numberOfQuestions;
        }).
        error(function(data) {
            console.log("connection failed!");
        });

        $http({
            method: 'GET',
            url: '../json/submissionResponses.json'
        }).
        success(function(data) {
            $scope.quizResponses= data;
        }).
        error(function(data) {
            console.log("connection failed!");
        });

        $scope.questNum = 0;
        $scope.quizData = {};
        $scope.score = 0;
        $scope.feedbackDisplay = false;
        $scope.feedbackDisplay = true;
        $scope.nextBtnDisplay = false;

        // check to see if answer is correct
        $scope.submitAnswer = function() {
            var submittedAnswer = $scope.quizData.submittedAnswer,
            correctAnswer = $scope.quizContent[$scope.questNum].correctAnswer;

            if (submittedAnswer == correctAnswer) {
                $scope.score++;
                $scope.feedback = $scope.quizResponses[0].correct;
                $scope.answerStatusClass = "bg-success";
            } else {
                $scope.feedback = $scope.quizResponses[0].incorrect;
                $scope.answerStatusClass = "bg-danger";
            }

            $scope.feedbackDisplay = true;
            $scope.quizData.submittedAnswer = false;
            $rootScope.score = $scope.score;

            if (($scope.questNum + 1)  < $scope.numberOfQuestions) {
                $scope.nextBtnDisplay = true;
            } else {
                $timeout(function(){
                    $location.path("score");
                }, 2000);
            };
        };

        $scope.nextQuestion = function() {
                $scope.questNum++;
                $scope.feedbackDisplay = false;
                $scope.nextBtnDisplay = false;

                console.log("questionNum = " + $scope.questNum, " score = " + $scope.score);
        }
    });

    /*************************************
     * CONTROLLER FOR SCORE PAGE
     *************************************/
    JazzQuiz.controller('scoreScreen', function($scope, $http, $rootScope){

        $scope.score = $rootScope.score;
        $scope.numberOfQuestions = $rootScope.numberOfQuestions;

        $scope.scorePercentage = Math.floor(Number($scope.score / $scope.numberOfQuestions * 100));

         $http({
            method: 'GET',
            url: '../json/successMessages.json'
        }).
        success(function(data) {
            $scope.messages = data;
            $scope.numberOfMessages = $scope.messages.length;
            $scope.assignMessages($scope.messages, $scope.numberOfMessages);
        }).
        error(function(data) {
            console.log("it failed!");
        });

        $scope.assignMessages = function(jsonMessages, numMessages){
            var scoreLevel = Math.floor(Number(100 / numMessages)),
            i;
            if ($scope.scorePercentage == 0) {
                $scope.quizSuccessMessage = jsonMessages[0].message;
            } else if ($scope.scorePercentage == 100){
                $scope.quizSuccessMessage = jsonMessages[numMessages-1].message;
            } else {
                 for(i = 0; i < numMessages; i++){
                    if ($scope.scorePercentage < (scoreLevel * (i + 1))){
                        $scope.quizSuccessMessage = jsonMessages[i-1].message;
                        break;
                    }
                }
            }
        }

    });
})();
