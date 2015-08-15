describe('QuizCtrl', function () {
    var scope, createController;

    beforeEach(module('JazzQuiz'));
    beforeEach(inject(function ($injector) {
        QuizCtrl = $injector.get('QuizCtrl');
        quizFactory = $injector.get('quizFactory');
        $httpBackend = $injector.get('$httpBackend');
    }));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();




    }));

    it('should do something awesome!', function () {
        createController = function() {
            return $controller('QuizCtrl', {
                '$scope': scope
            });
        };

        createController();
        expect(scope.displayNextBtn).toEqual(false);
    });
});
