describe('JazzQuiz.quizFactory', function () {
    var quizFactory,
        $httpBackend;



    describe('with http backend', function () {
        beforeEach(module('JazzQuiz'));
        beforeEach(inject(function ($injector) {
            quizFactory = $injector.get('quizFactory');
            $httpBackend = $injector.get('$httpBackend');
        }));


        // should I be using the underscore notation for the injected services?
        beforeEach(inject(function ($rootScope, $httpBackend) {
            $scope = $rootScope.$new();


            $httpBackend.when('GET', '../json/questions.json')
            .respond({stuff: 'here it is'}); // why do I need to have this hard-coded object here?

            quizFactory.getQuestions();

            $httpBackend.flush();

        }));

        it('should get some data from the JSON', function() {
           expect(quizFactory.getQuestions()).toBeDefined();
        });

        it('Should create an array with the same length as the number of questions', function () {


            /*var num = quizFactory.countQuestions();
            var getQuestions = quizFactory.getQuestions();
            var numberOfQuestions = getQuestions.length*/;
            //expect(quizFactory.testFunc('hello')).toBe('hello');
            /*numberOfQuestions = 10;
             var questionNumberArray = quizFactory.randomizeQuestions();
             */
             expect(quizFactory.countQuestions()).toEqual(4);
        });
    });


});
