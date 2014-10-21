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

            return submittedAnswer === correctAnswer;
        }
    };
}]);
