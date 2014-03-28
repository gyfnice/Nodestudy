define([], function() {
	'use strict';
	var Lib = {
		addEventListener: addHandler,
		$: function(id) {
			return document.getElementById(id);
		},
		extend: function extend(subClass, superClass) {
			var F = function() {};
			F.prototype = superClass.prototype;
			subClass.prototype = new F();
			subClass.prototype.constructor = subClass;
			subClass.superclass = superClass.prototype;
			if (superClass.prototype.constructor == Object.prototype.constructor) {
				superClass.prototype.constructor = superClass;
			}
		},
		removenode: function(node) {
			var d;
			if (node && node.tagName != 'BODY') {
				d = d || document.createElement('DIV');
				d.appendChild(node);
				d.innerHTML = '';
			}
		}
	};

	function normaliseEvent(event) {
		if (!event.stopPropagation) {
			event.stopPropagation = function() {
				this.cancelBubble = true;
			};
			event.preventDefault = function() {
				this.returnValue = false;
			};
		}
		if (!event.stop) {
			event.stop = function() {
				this.stopPropagation();
				this.preventDefault();
			};
		}

		if (event.srcElement && !event.target)
			event.target = event.srcElement;
		if ((event.toElement || event.fromElement) && !event.relatedTarget)
			event.relatedTarget = event.toElement || event.fromElement;
		if (event.clientX != undefined && event.pageX == undefined) {
			event.pageX = event.clientX + document.body.scrollLeft;
			event.pageY = event.clientY + document.body.scrollTop;
		}
		if (event.type == "keypress") {
			if (event.charCode === 0 || event.charCode == undefined)
				event.character = String.fromCharCode(event.keyCode);
			else
				event.character = String.fromCharCode(event.charCode);
		}

		return event;
	};

	function registerEventHandler(node, event, handler) {
		if (typeof node.addEventListener == "function")
			node.addEventListener(event, handler, false);
		else
			node.attachEvent("on" + event, handler);
	}

	function addHandler(node, type, handler) {
		function wrapHandler(event) {
			handler(normaliseEvent(event || window.event));
		}
		registerEventHandler(node, type, wrapHandler);
	};

	return Lib;
})