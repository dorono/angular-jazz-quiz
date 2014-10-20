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

        /* TODO: make all of the ajax calls in this file into services */

        /* get the list of quiz questions */
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

        /* get the messaging for correct and incorrect submissions */
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

        /* initialize the quiz */
        $scope.questNum = 0;
        $scope.quizData = {};
        $scope.score = 0;
        $scope.feedbackDisplay = true;
        $scope.nextBtnDisplay = false;

        $scope.submitAnswer = function() {

            // check to see if answer is correct and supply appropriate response
            var submittedAnswer = $scope.quizData.submittedAnswer,
            correctAnswer = $scope.quizContent[$scope.questNum].correctAnswer;
            if (submittedAnswer === correctAnswer) {
                $scope.score++;
                $scope.feedback = $scope.quizResponses[0].correct;
                $scope.answerStatusClass = "bg-success";
            } else {
                $scope.feedback = $scope.quizResponses[0].incorrect;
                $scope.answerStatusClass = "bg-danger";
            }

            // show feedback
            $scope.feedbackDisplay = true;
            // disable submit button
            $scope.quizData.submittedAnswer = false;
            // make the score accessible to the rest of the app
            $rootScope.score = $scope.score;

            // if we haven't been through all of the questions yet, show the "next" button
            if (($scope.questNum + 1)  < $scope.numberOfQuestions) {
                $scope.nextBtnDisplay = true;
            } else {
            // if the last question has been answered, wait and then redirect to score page
                $timeout(function(){
                    $location.path("score");
                }, 2000);
            }
        };

        $scope.nextQuestion = function() {
                // queue up the next question
                $scope.questNum++;
                // hide the feedback
                $scope.feedbackDisplay = false;
                // hide the "next" button
                $scope.nextBtnDisplay = false;
        }
    });

    /*************************************
     * CONTROLLER FOR SCORE PAGE
     *************************************/
    JazzQuiz.controller('scoreScreen', function($scope, $http, $rootScope){

        // get the score from the quiz controller
        $scope.score = $rootScope.score;
        // get the number of questions from the quiz controller
        $scope.numberOfQuestions = $rootScope.numberOfQuestions;

        // calculate the percentage score
        $scope.scorePercentage = Math.floor(Number($scope.score / $scope.numberOfQuestions * 100));

        // Get the list of score-specific responses. The API would allow for as many as 100 possible responses -
        // one for every percentage point (which would be insane, of course)
        $http({
            method: 'GET',
            url: '../json/successMessages.json'
        }).
        success(function(data) {
            $scope.messages = data;
            // get the number of score responses
            $scope.numberOfMessages = $scope.messages.length;
            // apply the appropriate response for the user's score
            $scope.assignMessages($scope.messages, $scope.numberOfMessages);
        }).
        error(function(data) {
            console.log("it failed!");
        });

        $scope.assignMessages = function(jsonMessages, numMessages){

            // divvy the score messages up so that they're distributed evenly
            // across the entire spectrum of possible scores
            var scoreLevel = Math.floor(Number(100 / numMessages)),
            i;

            // if the user got none right, give him the very first message
            if ($scope.scorePercentage === 0) {
                $scope.quizSuccessMessage = jsonMessages[0].message;
            } else if ($scope.scorePercentage === 100){
                // if the user got a perfect score, give them the very last message
                $scope.quizSuccessMessage = jsonMessages[numMessages-1].message;
            } else {
                 // otherwise, locate the message that sits within the appropriate range of scores
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
