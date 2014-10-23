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
