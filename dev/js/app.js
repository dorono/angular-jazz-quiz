(function() {

    var JazzQuiz = angular.module('JazzQuiz', ['ngRoute']);

    // TODO: Use resolves

    JazzQuiz.config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.
                when('/', {
                        resolve: {
                            questions: function($http) {
                                return $http.get('../json/questions.json')
                                    .then(function success(response) {
                                            return response.data;
                                        },
                                        function error() {
                                            console.log("it broke");
                                        }
                                    },
                                    responses: function($http) {
                                        return $http({
                                            method: 'GET',
                                            url: '../json/submissionResponses.json'
                                        });
                                    }
                            },
                            templateUrl: '/partials/quiz.html',
                            controller: 'QuizCtrl as quiz',
                        }).when('/score', {
                        templateUrl: '/partials/score.html',
                        controller: 'scoreScreen'
                    });
                }
            ]);

/*  QUESTIONS:
- how to namespace a variable to be shared between multiple controllers throughout the app, in other words, what's the best practices way to do what $rootScope does
- whether or not I need to use a promise to fetch the quiz reponses
- if I do need to use a promise, how do I set that up
*/

    /**************
    * FACTORIES *
    **************/

    /*JazzQuiz.factory('QuizFeedbackResponses', function($http){
        var responsesFromJson = "test";
        var QuizFeedbackResponses = function(responsesFromJson){
            var self = this;

            alert(responsesFromJson);

            // responsesFromJson.then(function(response){
            //     angular.extend(this, response.data);
            // });

            return this.responsesFromJson;
        }

        //return(QuizFeedbackResponses);
    });*/

    /*************************************
     * CONTROLLER FOR QUIZ PAGE
     *************************************/
    JazzQuiz.controller('QuizCtrl', function($scope, $http, $location, $rootScope, $timeout, questions, responses) {

        var self = this;

        self.quizContent = questions;
        self.quizResponses = responses;

        /* TODO: make all of the ajax calls in this file into services */

        /* get the list of QuizCtrl questions */
        // $http({
        //     method: 'GET',
        //     url: '../json/questions.json'
        // }).
        // success(function(data) {
        //     self.quizContent = data;
        //     // TODO: get rid of rootScope
        //     $rootScope.numberOfQuestions = self.quizContent.length;
        // }).
        // error(function(data) {
        //     console.log("connection failed!");
        // });




        /* get the messaging for correct and incorrect submissions */
        $http({
            method: 'GET',
            url: '../json/submissionResponses.json'
        }).
        success(function(data) {
            self.quizResponses= data;
        }).
        error(function(data) {
            console.log("connection failed!");
        });

        /* initialize the quiz */
        /* MAKE THIS INTO A FACTORY */
        self.questNum = 0;
        self.quizData = {};
        self.score = 0;
        self.feedbackDisplay = true;
        self.nextBtnDisplay = false;

        self.submitAnswer = function() {

            // check to see if answer is correct and supply appropriate response
            var submittedAnswer = self.submittedAnswer,
            correctAnswer = self.quizContent[self.questNum].correctAnswer;

            if (submittedAnswer === correctAnswer) {
                self.score++;
                self.feedback = self.quizResponses[0].correct;
                // TODO: specify the classes in the HTML using the ng-class directive
                self.answerStatusClass = "bg-success";
            } else {
                self.feedback = self.quizResponses[0].incorrect;
                self.answerStatusClass = "bg-danger";
            }

            // show feedback
            self.feedbackDisplay = true;
            // disable submit button
            self.quizData.submittedAnswer = false;
            // make the score accessible to the rest of the app
            $rootScope.score = self.score;

            // if we haven't been through all of the questions yet, show the "next" button
            if ((self.questNum + 1)  < $rootScope.numberOfQuestions) {
                self.nextBtnDisplay = true;
            } else {
            // if the last question has been answered, wait and then redirect to score page
                $timeout(function(){
                    $location.path("score");
                }, 2000);
            }
        };

        self.nextQuestion = function() {
                // queue up the next question
                self.questNum++;
                // hide the feedback
                self.feedbackDisplay = false;
                // hide the "next" button
                self.nextBtnDisplay = false;
        }
    });

    /*************************************
     * CONTROLLER FOR SCORE PAGE
     *************************************/
    JazzQuiz.controller('scoreScreen', function($http, $rootScope){

        var that = this;

        // get the score from the quiz controller
        that.score = $rootScope.score;
        // get the number of questions from the quiz controller
        that.numberOfQuestions = $rootScope.numberOfQuestions;

        // calculate the percentage score
        that.scorePercentage = Math.floor(Number(that.score / that.numberOfQuestions * 100));

        // Get the list of score-specific responses. The API would allow for as many as 100 possible responses -
        // one for every percentage point (which would be insane, of course)
        $http({
            method: 'GET',
            url: '../json/successMessages.json'
        }).
        success(function(data) {
            that.messages = data;
            // get the number of score responses
            that.numberOfMessages = that.messages.length;
            // apply the appropriate response for the user's score
            that.assignMessages(that.messages, that.numberOfMessages);
        }).
        error(function(data) {
            console.log("it failed!");
        });

        that.assignMessages = function(jsonMessages, numMessages){

            // divvy the score messages up so that they're distributed evenly
            // across the entire spectrum of possible scores
            var scoreLevel = Math.floor(Number(100 / numMessages)),
            i;

            // if the user got none right, give him the very first message
            if (that.scorePercentage === 0) {
                that.quizSuccessMessage = jsonMessages[0].message;
            } else if (that.scorePercentage === 100){
                // if the user got a perfect score, give them the very last message
                that.quizSuccessMessage = jsonMessages[numMessages-1].message;
            } else {
                 // otherwise, locate the message that sits within the appropriate range of scores
                 for(i = 0; i < numMessages; i++){
                    if (that.scorePercentage < (scoreLevel * (i + 1))){
                        that.quizSuccessMessage = jsonMessages[i-1].message;
                        break;
                    }
                }
            }
        }

    });
})();