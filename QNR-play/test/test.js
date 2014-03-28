var assert = require("assert");
var nice;
describe('Array', function(){
	before(function(){
    	nice = 5;
  	});
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
       [1,2,3].indexOf(nice).should.equal(-1);
    })
  });
})
