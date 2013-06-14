describe("neuro-ajax", function(){
    var xhr, requests = [], Ajax, succ_cb;

    beforeEach(function(done){
        NR.use(["neuro-ajax@0.1.0"],function(mod) {
            Ajax = mod;
            xhr = sinon.useFakeXMLHttpRequest();
            xhr.onCreate = function(req){
                requests.push(req);
            }
            succ_cb = sinon.spy();
            done();
        });
    });

    afterEach(function(){
        // 测完之后把真正的jQuery.ajax物归原主
        requests = [];
        xhr.restore();
    });

    describe("basic requirements:", function(){
        it("ajax module ready.", function(){
            expect(!!Ajax).to.be.true;
        });
    });
        
    describe("responses (could successfully receive responses)", function(){
        it("'get' method", function(){
            new Ajax({
                url: 'wrong-json-format.json',
                dataType: 'text'
            })
            .on("success",succ_cb)
            .send();

            var response_text = "{\"a\":1,'b':2}";
            requests[0].respond(200, { "Content-Type": "text/plain" },response_text);

            // calls[0], args[0]
            expect(!!succ_cb.args[0][0]).to.be.true;
        });

        it("'post' method", function(){
            new Ajax({
                url: 'wrong-json-format.json',
                dataType: 'text',
                method: 'post'
            }).on("success",succ_cb).send();

            var response_text = "{\"a\":1,'b':2}";
            requests[0].respond(200, { "Content-Type": "text/plain" },response_text);
            expect(!!succ_cb.args[0][0]).to.be.true;
        });

        it("option `method` is not case-sensitive", function(){
            new Ajax({
                url: 'wrong-json-format.json',
                dataType: 'text',
                method: 'POST'
            }).on("success",succ_cb).send();

            var response_text = "{\"a\":1,'b':2}";
            requests[0].respond(200, { "Content-Type": "text/plain" },response_text);
            expect(!!succ_cb.args[0][0]).to.be.true;
        });
    });
});

describe("option: dataType:", function(){
    var Ajax;
    beforeEach(function(done){
        NR.use(["neuro-ajax@0.1.0"],function(mod) {
            Ajax = mod;
            done();
        });
    });

    it("contains 'application/json' in header, if dataType is json", function(){
        var ajax = new Ajax({
            url: 'wrong-json-format.json',
            dataType: 'json',
            method: 'post'
        });

        expect(ajax.get('headers')).to.have.property("Accept").that.to.include('application/json');
    });

    it("contains 'text/plain' in header", function(){
        var ajax = new Ajax({
            url: 'wrong-json-format.json',
            dataType: 'text',
            method: 'post'
        });

        expect(ajax.get('headers')).to.have.property("Accept").that.to.equal('text/plain');
    });

    it("contains 'x-www-form-urlencoded' in header", function(){
        var ajax = new Ajax({
            url: 'wrong-json-format.json',
            dataType: 'text',
            method: 'post'
        });
        expect(ajax.get('headers')).to.have.property("Content-Type").that.to.include('x-www-form-urlencoded');
    });
});

describe("option: santitizer", function(){
    var xhr, requests = [], Ajax, succ_cb, err_cb;

    beforeEach(function(done){
        NR.use(["neuro-ajax@0.1.0"],function(mod) {
            Ajax = mod;
            xhr = sinon.useFakeXMLHttpRequest();
            xhr.onCreate = function(req){
                requests.push(req);
            }
            succ_cb = sinon.spy();
            err_cb = sinon.spy();
            done();
        });
    });

    afterEach(function(){
        requests = [];
        xhr.restore();
    });

    it("could change the response text before everything taking effect", function(){
        new Ajax({
            url: 'simple-json.json',
            dataType: 'json',
            method: 'post',
            santitizer: function(res) {
                return '{"a":11,"b":22}';
            }
        }).on("success",succ_cb).send();
        requests[0].respond(200, { "Content-Type": "application/json"},'{"a":1,"b":2}');
        expect(succ_cb.args[0][0].a).to.equal(11);
    });

    it("could santitize wrong response format into the right one", function(){
        new Ajax({
            url: 'wrong-json-format.json',
            dataType: 'json',
            method: 'post',
            santitizer: function(res) {
                return res.replace(/\'/g, '"');
            }
        }).on({
            success: succ_cb,
            error: err_cb
        }).send();
        requests[0].respond(200, { "Content-Type": "application/json"},'{"a":1,\'b\':2}');
        expect(succ_cb.calledOnce).to.be.true;
        expect(err_cb.calledOnce).to.be.false;
    });
});


describe("option: isSuccess", function(){
    var xhr, requests = [], Ajax, succ_cb, err_cb;

    beforeEach(function(done){
        NR.use(["neuro-ajax@0.1.0"],function(mod) {
            Ajax = mod;
            xhr = sinon.useFakeXMLHttpRequest();
            xhr.onCreate = function(req){
                requests.push(req);
            }
            succ_cb = sinon.spy();
            err_cb = sinon.spy();
            done();
        });
    });

    afterEach(function(){
        requests = [];
        xhr.restore();
    });

    it("could indicate whether the ajax request is successfull", function(){
        new Ajax({
            url: 'simple-json.json',
            dataType: 'json',
            method: 'post',
            isSuccess: function(rt) {
                return rt.a === 100;
            }
        }).on({
            success: succ_cb,
            error: err_cb
        }).send();
        requests[0].respond(200, { "Content-Type": "application/json"},'{"a":1,"b":2}');
        expect(succ_cb.calledOnce).to.be.false;
        expect(err_cb.calledOnce).to.be.true;
    });
});

describe("event: success", function(){
    it("no test cases here", function(){
        expect(true).to.be.true;
    });
});


describe("event: error", function(){
    var xhr, requests = [], Ajax, succ_cb, err_cb;

    beforeEach(function(done){
        NR.use(["neuro-ajax@0.1.0"],function(mod) {
            Ajax = mod;
            xhr = sinon.useFakeXMLHttpRequest();
            xhr.onCreate = function(req){
                requests.push(req);
            }
            succ_cb = sinon.spy();
            err_cb = sinon.spy();
            done();
        });
    });

    afterEach(function(){
        requests = [];
        xhr.restore();
    });

    it("will fail, if dataType didn't match", function(){
        new Ajax({
            url: 'wrong-json-format.json',
            dataType: 'json',
            method: 'post'
        }).on({
            success: succ_cb,
            error: err_cb
        }).send();
        requests[0].respond(200, { "Content-Type": "application/json"},'{"a":1,\'b\':2}');
        expect(succ_cb.calledOnce).to.be.false;
        expect(err_cb.calledOnce).to.be.true;
    });

    it("will fail, if xhr failure", function(){
        new Ajax({
            url: 'unexisted-url.json',
            dataType: 'json',
            method: 'post'
        }).on({
            success: succ_cb,
            error: err_cb
        }).send();
        requests[0].respond(404, {},"");
        expect(succ_cb.calledOnce).to.be.false;
        expect(err_cb.calledOnce).to.be.true;
    });

    it("will fail, if http status indicate a failure", function(){
        new Ajax({
            url: 'wrong-json-format.json',
            dataType: 'json',
            method: 'post',
            isXHRSuccess: function(s) {
                return s < 100;
            }
        }).on({
            success: succ_cb,
            error: err_cb
        }).send();
        requests[0].respond(200, { "Content-Type": "application/json"},'{"a":1,\'b\':2}');
        expect(succ_cb.calledOnce).to.be.false;
        expect(err_cb.calledOnce).to.be.true;
    });
});

    
// });