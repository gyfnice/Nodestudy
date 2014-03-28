define(['./fun'], function(array) {
	'use strict';
	var SimpleEE = function() {
		this.events = {};
	};
	SimpleEE.fn = SimpleEE.prototype;
	SimpleEE.fn.on = function(eventname, callback) {
		this.events[eventname] || (this.events[eventname] = []);
		this.events[eventname].push(callback);
	};
	SimpleEE.fn.emit = function(eventname) {
		var args = Array.prototype.slice.call(arguments, 1);
		if (this.events[eventname]) {
			array.forEach(this.events[eventname],function(callback) {
				callback.apply(this, args);
			});
		}
	};
	return SimpleEE;
});