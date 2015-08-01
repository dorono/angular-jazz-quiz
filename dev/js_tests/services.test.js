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
            $httpBackend.flush();

            $httpBackend.when('GET', '../json/submissionResponses.json')
            .respond('test'); // why do I need to have this hard-coded stuff here?
            quizFactory.getResponses();
            $httpBackend.flush();

        }));

        it('should get some data from the JSON', function() {

            var getQuestionsVar = quizFactory.getQuestions();

            console.log('this is get questions: ' + getQuestionsVar);


            expect(quizFactory.getQuestions()).toBeDefined();
        });

    });


});
