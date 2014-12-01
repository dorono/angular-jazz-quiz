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
        questArrayIndex = 0;


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
