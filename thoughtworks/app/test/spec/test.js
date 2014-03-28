define(['frontend/common/fun', 'frontend/common/Eventemmit',
		'frontend/common/lib', 'frontend/module/dialog'
	],
	function(array, Eventemmit, lib, dialog) {

		describe('FunTest', function() {
			it('Test tool fun', function() {
				var origindata = [1, 2, 3]
				var data = array.map(origindata, function(elem) {
					return elem * 2
				});
				for (var i = 0, max = origindata.length; i < max; i++) {
					data[i].should.equal(origindata[i] * 2);
				}
			});
		});


		describe('Eventemmit', function() {
			it('Test emit and on', function() {
				var emitter = new Eventemmit();
				emitter.on('greet', function(name) {
					("hello" + name).should.equal("hellonice");
				});
				emitter.emit('greet', "nice");
			});
		});

		describe('dialog', function() {
			it('Test dialog attr', function() {
				dialog.left.should.equal(90);
			});

			it('Test dialog inherit itself', function() {
				assert.equal(dialog instanceof dialog.constructor.superclass.constructor, true);
			});

			it('Test dialog inherit Eventemmit', function() {
				assert.equal(dialog instanceof Eventemmit, true);
			});

			it('Test dialog constructor should equal Eventemmit', function() {
				dialog.constructor.superclass.constructor.should.equal(Eventemmit);
			});
		});

		describe('DOM getElement', function() {
			it('Test dom method by id', function() {
				lib.$("mocha").id.should.equal("mocha");
			})
		});

		describe('Array', function() {
			describe('#indexOf()', function() {
				it('should return -1 when the value is not present', function() {
					[1, 2, 3].indexOf(5).should.equal(-1);
					[1, 2, 3].indexOf(0).should.equal(-1);
				})
			});
			describe('#push()', function() {
				it('should return -1 when the value is not present', function() {
					[1, 2, 3].push(5).should.equal(4);
				})
			});
		});

		describe('String', function() {
			describe('#split', function() {
				it('should return array by relate split operate', function() {
					"1,2,3,4,5".split(",").length.should.equal(5);
				});
			});
			describe('#slice', function() {
				it('should return substring from originString between x and y', function() {
					"gyfnicefeng".slice(0, 7).should.equal("gyfnice")
				});
			});
		});

	});