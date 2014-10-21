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

            $scope.valid = quizFactory.checkAnswer($scope.data.answer,$scope.questNum);
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
