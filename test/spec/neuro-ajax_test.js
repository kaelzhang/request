function async(mod, loaded, options, events){
    var 
    EVENTS = ['success', 'error'],

    method, res,

    need_async = arguments.length === 4,
    
    succeed,

    fake_events = {},

    event_res = {},

    final_event_type;

    EVENTS.forEach(function(type) {
        fake_events[type] = function() {
            event_res[type] = arguments;
            final_event_type = type;
        };
    });

    runs(function() {
        NR.provide(mod, function(NR, Method) {
            method = Method;
        });
    });

    waitsFor(function() {
        return !!method;
    });

    runs(function() {
        if(loaded){
            loaded(method);
        }

        if(need_async){
            new method(options).on(fake_events).send();
        }
    });

    if(need_async){
        waitsFor(function() {
            return !!final_event_type;
        });

        runs(function() {
            EVENTS.forEach(function(type) {
                var
                callback = events[type];

                if(type === final_event_type){
                    callback && callback.apply(null, event_res[type]);
                }
            });
        });
    }
};

describe("neuro-ajax", function(){
    var xhr, request, Ajax;

    beforeEach(function(done){
        NR.use(["neuro-ajax@0.1.0"],function(mod) {
            Ajax = mod;
            xhr = sinon.useFakeXMLHttpRequest();
            xhr.onCreate = function(req){
                request = req;
            }
            done();
        });
    });



    afterEach(function(){
        // 测完之后把真正的jQuery.ajax物归原主
        xhr.restore();
        console.log("after each");
    });

    describe("neuro-ajax", function(){
        it("ajax module ready.", function(){
            expect(!!Ajax).to.be.true;
        });
    });
        
    describe("responses (could successfully receive responses)", function(){
        it("'get' method", function(done){
            new Ajax({
                url: 'wrong-json-format.json',
                dataType: 'text'
            }).on("success",function(res){
                expect(!!res).to.be.true;
                done();
            });
            request.respond(200, {}, "{\n\t\"a\": 1,\n\t'b': 2\n}");
        });

        it("'post' method", function(done){
            new Ajax({
                url: 'wrong-json-format.json',
                dataType: 'text',
                method: 'post'
            }).on("success",function(res){
                expect(!!res).to.be.true;
                done();
            });
            request.respond(200, {}, "{\n\t\"a\": 1,\n\t'b': 2\n}");
        });

        it("option `method` is not case-sensitive", function(done){
            new Ajax({
                url: 'wrong-json-format.json',
                dataType: 'text',
                method: 'POST'
            }).on("success",function(res) {
                expect(!!res).to.be.true;
                done();
            });
            request.respond(200, {}, "{\n\t\"a\": 1,\n\t'b': 2\n}");
        });
    });
});





// describe("basic requirements:", function(){
//     it("ajax module ready.", function(){
//             expect(!!ajax).toBe(true);
//     });
// });


// describe("option: dataType:", function(){
//     it("contains 'application/json' in header, if dataType is json", function(){
//         async('io/ajax', function(Ajax) {
//             var 

//             ajax = new Ajax({
//                 url: 'wrong-json-format.json',
//                 dataType: 'json',
//                 method: 'post'
//             });

//             expect( contains(ajax.get('headers'), 'application/json') ).toBe(true);
//         });
//     });

//     it("contains 'text/plain' in header", function(){
//         async('io/ajax', function(Ajax) {
//             var 

//             ajax = new Ajax({
//                 url: 'wrong-json-format.json',
//                 dataType: 'text',
//                 method: 'post'
//             });

//             expect( contains(ajax.get('headers'), 'text/plain') ).toBe(true);
//         });
//     });

//     it("contains 'x-www-form-urlencoded' in header", function(){
//         async('io/ajax', function(Ajax) {
//             var 

//             ajax = new Ajax({
//                 url: 'wrong-json-format.json',
//                 dataType: 'text',
//                 method: 'post'
//             });

//             expect( contains(ajax.get('headers'), 'x-www-form-urlencoded') ).toBe(true);
//         });
//     });
// });

// describe("option: santitizer", function(){
//     it("could change the response text before everything taking effect", function(){
//         async('io/ajax', false, {
//             url: 'simple-json.json',
//             dataType: 'json',
//             method: 'post',
//             santitizer: function(res) {
//                 return '{"a":11,"b":22}';
//             }

//         }, {
//             success: function(res) {

//                 // if 'success' event fired, test case will fail
//                 expect(res.a).toBe(11);
//             }
//         });
//     });

//     it("could santitize wrong response format into the right one", function(){
//         async('io/ajax', false, {
//             url: 'wrong-json-format.json',
//             dataType: 'json',
//             method: 'post',
//             santitizer: function(res) {
//                 return res.replace('\'', '"');
//             }

//         }, {
//             success: function(res) {

//                 // if 'success' event fired, test case will fail
//                 expect(false).toBe(true);
//             },

//             error: function() {
//                 expect(true).toBe(true);
//             }
//         });
//     });
// });


// describe("option: isSuccess", function(){
//     it("could indicate whether the ajax request is successfull", function(){
//         async('io/ajax', false, {
//             url: 'simple-json.json',
//             dataType: 'json',
//             method: 'post',
//             isSuccess: function(rt) {
//                 return rt.a === 100;
//             }

//         }, {
//             success: function(res) {

//                 // if 'success' event fired, test case will fail
//                 expect(false).toBe(true);
//             },

//             error: function() {
//                 expect(true).toBe(true);
//             }
//         });
//     });
// });

// describe("event: success", function(){
//     it("no test cases here", function(){
//         expect().toBe();
//     });
// });


// describe("event: error", function(){
//     it("will fail, if dataType didn't match", function(){
//         async('io/ajax', false, {
//             url: 'wrong-json-format.json',
//             dataType: 'json',
//             method: 'post'

//         }, {
//             success: function(res) {

//                 // if 'success' event fired, test case will fail
//                 expect(false).toBe(true);
//             },

//             error: function() {
//                 expect(true).toBe(true);
//             }
//         });
//     });

//     it("will fail, if xhr failure", function(){
//         async('io/ajax', false, {
//             url: 'unexisted-url.json',
//             dataType: 'json',
//             method: 'post'

//         }, {
//             success: function(res) {

//                 // if 'success' event fired, test case will fail
//                 expect(false).toBe(true);
//             },

//             error: function() {
//                 expect(true).toBe(true);
//             }
//         });
//     });

//     it("will fail, if http status indicate a failure", function(){
//         async('io/ajax', false, {
//             url: 'wrong-json-format.json',
//             dataType: 'json',
//             method: 'post',
//             isXHRSuccess: function(s) {
//                 return s < 100;
//             }

//         }, {
//             success: function(res) {

//                 // if 'success' event fired, test case will fail
//                 expect(false).toBe(true);
//             },

//             error: function() {
//                 expect(true).toBe(true);
//             }
//         });
//     });
// });

    
// });