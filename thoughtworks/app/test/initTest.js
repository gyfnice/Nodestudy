require.config({
	baseUrl: '.',
	paths: {
		frontend: '../scripts'
	}
});

require(['spec/test'], function() {
	mocha.run();
});