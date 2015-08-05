var services = angular.module('JazzQuiz.services' ,[]);

services.factory('quizFactory', ['$http', function($http){

    var questions = [],
        numberOfQuestions,
        questionNumberArray = [],
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

                // clear the question number array to avoid repetition
                if (questionNumberArray.length) {
                    questionNumberArray = [];
                }

                for(var i = 0; i < numberOfQuestions; i++) {
                    questionNumberArray.push(i);
                }

                return result.data;
            });
        },
        shuffle: function(o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            console.log(o);
            return o;
        },
        randomizeQuestions: function(){
            return this.shuffle(questionNumberArray);
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
