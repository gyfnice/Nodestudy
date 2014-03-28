define([], function() {
	'use strict';
	var array = {
		forEach: function(array, action) {
			for (var i = 0; i < array.length; i++) {
				action(array[i]);
			}
		},
		map: function(array, action) {
			var result = [];
			this.forEach(array, function(element) {
				result.push(action(element));
			});
			return result;
		},
		filter: function(array, test) {
			var result = [];
			this.forEach(array, function(element) {
				if (test(element))
					result.push(element)
			});
			return result;
		}
	}
	return array;
})