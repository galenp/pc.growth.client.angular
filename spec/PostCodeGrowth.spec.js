describe("PostCodeGrowth service UNIT TESTS", function() {
    var postCodeGrowth,
        growthOptions,
        $httpBackend;

    var sampleData = [{
        "postCode": "3189",
        "yearEnding": 2008,
        "state": "VIC",
        "hGrowth": 1.03,
        "uGrowth": 2.65,
        "pGrowth": -0.55,
        "pop": 5268
    }, {
        "postCode": "3190",
        "yearEnding": 2008,
        "state": "WA",
        "hGrowth": -2.3,
        "uGrowth": 1.44,
        "pGrowth": 2.06,
        "pop": 10054
    }];

    beforeEach(function() {
        module('pc.growth');

        // get your service, also get $httpBackend
        // $httpBackend will be a mock, thanks to angular-mocks.js
        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            growthOptions = $injector.get('growthOptions');
            postCodeGrowth = $injector.get('PostCodeGrowth');
        });
    });

    // make sure no expectations were missed in your tests.
    // (e.g. expectGET or expectPOST)
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('query()', function() {
        it('should return an array of postcode data', function() {
            //given
            var url = growthOptions.baseUrl;
            $httpBackend.expectGET(url).respond(sampleData);

            //when
            var returnedPromise = postCodeGrowth.query(url);
            var result;
            returnedPromise.then(function(response) {
                result = response;
            })

            //then
            $httpBackend.flush();
            expect(result).toEqual(sampleData);
            expect(result instanceof Array).toBeTruthy();
        });

        describe('when providing query params', function() {
            it('it should generate the correct url', function() {
                //given
                var url = growthOptions.baseUrl + "?$filter=State+eq+'WA'"
                var params = {
                    '$filter': "State eq 'WA'"
                }
                $httpBackend.expectGET(url).respond(true);
                postCodeGrowth.query(growthOptions.baseUrl, params);
                $httpBackend.flush();
                expect(true).toBeTruthy();
            });
        });
    });

    describe('bestPerforming()', function() {
        describe('for year(2014), orderBy(Pop) and orderByDirection(asc)', function() {
            it('should generate the correct queryString', function() {
                var url = growthOptions.baseUrl + "?$filter=YearEnding+eq+2014&$orderby=Pop+asc"
                $httpBackend.expectGET(url).respond(true);
                postCodeGrowth.bestPerforming(2014, 'Pop', 'asc');
                $httpBackend.flush();
                expect(true).toBeTruthy();
            });
        });

        describe('for year(2012), orderBy(PGrowth), orderByDirection(desc) and state(WA)', function () {
            it('should generate the correct queryString', function(){
                var url = growthOptions.baseUrl + "?$filter=YearEnding+eq+2012+and+State+eq+'WA'&$orderby=PGrowth+desc";
                $httpBackend.expectGET(url).respond(true);
                postCodeGrowth.bestPerforming(2012, 'PGrowth', 'desc', 'WA')
                $httpBackend.flush();
                expect(true).toBeTruthy();
            })
        });

        describe('for year(2014) and orderBy(INVALID)', function() {
            it('should generate an exception', function() {
                expect(function() {
                    postCodeGrowth.bestPerforming(2014, 'INVALID');
                }).toThrow(new Error('Invalid orderBy specified, only "Pop", "PGrowth", "HGrowth" and "UGrowth" allowed.'));
            })
        });
    });

    describe('bestOverTime()', function () {
        describe('for orderBy(avPGrowth)', function() {
            it('should generate the correct queryString', function() {
                var url = growthOptions.baseUrl + "/average" + "?$orderby=avPGrowth+desc";
                $httpBackend.expectGET(url).respond(true);
                postCodeGrowth.bestOverTime('avPGrowth');
                $httpBackend.flush();
                expect(true).toBeTruthy();
            })
        });
        describe('for orderBy(avHGrowth), orderByDirection(asc) and state(NSW)', function() {
            it('should generate the correct queryString', function() {
                var url = growthOptions.baseUrl + "/average" + "?$filter=State+eq+'NSW'&$orderby=avPGrowth+asc";
                $httpBackend.expectGET(url).respond(true);
                postCodeGrowth.bestOverTime('avPGrowth', 'asc', 'NSW');
                $httpBackend.flush();
                expect(true).toBeTruthy();
            })
        });
    });

    describe('details()', function() {
        describe('for details(6438)', function() {
            it('should generate the correct queryString', function() {
                var url = growthOptions.baseUrl + "?$filter=PostCode+eq+'6348'&$orderby=YearEnding+asc";
                $httpBackend.expectGET(url).respond(true);
                postCodeGrowth.details(6348);
                $httpBackend.flush();
                expect(true).toBeTruthy();
            })
        })
    });

    describe('detailsOverTime()', function() {
        describe('for detailsOverTime(6438)', function() {
            it('should generate the correct queryString', function() {
                var url = growthOptions.baseUrl + "/average" + "?$filter=PostCode+eq+'6348'";
                $httpBackend.expectGET(url).respond(true);
                postCodeGrowth.detailsOverTime(6348);
                $httpBackend.flush();
                expect(true).toBeTruthy();
            })
        })
    });

});
