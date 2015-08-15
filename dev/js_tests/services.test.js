describe('JazzQuiz.quizFactory', function () {
    var quizFactory,
        $httpBackend;


    // what is the difference between spies, mocks, and stubs?

    // why do you need to "tear down" the tests? (afterAll/afterEach)


    describe('with http backend', function () {
        beforeEach(module('JazzQuiz'));
        beforeEach(inject(function ($injector) {
            quizFactory = $injector.get('quizFactory');
            $httpBackend = $injector.get('$httpBackend');
        }));


        // should I be using the underscore notation for the injected services? Or would the underscore notation only be used for references to modules that *I* created? See this example here: http://odetocode.com/blogs/scott/archive/2013/06/11/angularjs-tests-with-an-http-mock.aspx
        beforeEach(inject(function ($rootScope, $httpBackend) {
            $scope = $rootScope.$new();


            $httpBackend.when('GET', '../json/questions.json')
            .respond('test'); // why do I need to have this hard-coded stuff here?
            quizFactory.getQuestions();
            quizFactory.randomizeQuestions();
            $httpBackend.flush();


        }));

        it('should should have the same number of items in the randomized array as the original array', function() {

            var randomizedArray = quizFactory.randomizeQuestions(),
                originalQuestions = quizFactory.countQuestions();

            expect(randomizedArray.length).toEqual(originalQuestions);
        });

    });


});
