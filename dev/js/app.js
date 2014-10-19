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
        });

        $routeProvider.otherwise({redirectTo: '/'});

    }]);

})();
