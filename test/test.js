var supertest = require("supertest");
var should = require("should");
var server = supertest.agent('http://localhost:4000');
describe('upload', function() {
    it('should call index.js function', function(done) {
    	server
	    .post("/f")
	    .send({"hello":"world"})
	    .expect(200)
	    .end(function(err,res){
	    	should.not.exist(err);
	      	done();
	    });
    });
  });