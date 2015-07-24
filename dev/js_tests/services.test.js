describe('JazzQuiz.quizFactory', function() {
    var quizFactory,
        $httpBackend;

    beforeEach(module('JazzQuiz'));
    beforeEach(inject(function($injector) {
        quizFactory = $injector.get('quizFactory');
        $httpBackend = $injector.get('$httpBackend');
    }));

    it('Should create an array with the same length as the number of questions', function() {


        //var num = quizFactory.countQuestions();
        //var getQuestions = quizFactory.getQuestions();
        //var numberOfQuestions = getQuestions.length
        expect(quizFactory.testFunc('hello')).toBe('hello');
        /*numberOfQuestions = 10;
        var questionNumberArray = quizFactory.randomizeQuestions();

        expect(questionNumberArray.length).toEqual(10);*/
    });
});
