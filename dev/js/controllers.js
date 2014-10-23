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
