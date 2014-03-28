define(['../common/lib', '../common/Eventemmit'], function(lib, Eventemmit) {
	'use strict';
	function Dialog() {
		Dialog.superclass.constructor.apply(this, arguments);
		this.left = 90;
	};

	lib.extend(Dialog, Eventemmit);

	Dialog.fn = Dialog.prototype;

	Dialog.fn.init = function(data) {
		this.elem = data.dialogElem;
		this.close = data.close;
		this.addbtn = data.addbtn;
		this.inputelem = this.elem.getElementsByTagName("input")[0];
		this.hint = this.elem.getElementsByTagName("b")[0];
		this.bindEvent();
	};
	Dialog.fn.bindEvent = function() {
		this.closeDialogHandler();
		this.addResourceHandler();
	};
	Dialog.fn.show = function(pagey, y, curentElem) {
		this.move(pagey, y);
		this.curentElem = curentElem;
		this.elem.style.display = "block";
		this.focus();
	};
	Dialog.fn.focus = function() {
		this.inputelem.focus();
		this.hint.style.display = "none";
	};
	Dialog.fn.move = function(pagey, y) {
		if (pagey === 0) {
			var top = y + 20;
		} else {
			var top = pagey + 50;
		}
		this.elem.style.top = top + 'px';
		this.elem.style.left = this.left + 'px';
	};

	Dialog.fn.hide = function() {
		this.elem.style.display = "none";
		this.inputelem.value = "";
	};
	Dialog.fn.addResourceHandler = function() {
		var _this = this;
		lib.addEventListener(this.addbtn, "click", function(event) {
			event.preventDefault();
			var data = _this.inputelem.value.split(",");
			if(_this.inputelem.value !== ""){
				_this.generateHtml(data);
				_this.hide();
			}
			_this.hint.style.display = "inline";
		});
	};
	Dialog.fn.generateHtml = function(data) {
		for (var i = 0, max = data.length; i < max; i++) {
			var li =
				'<li>' +
				'    <p class="left">' + data[i] + '</p>' +
				'    <div class="close inlineblock"></div>' +
				'</li>';
			this.curentElem.innerHTML += li;
		}
	};
	Dialog.fn.closeDialogHandler = function() {
		var _this = this;
		lib.addEventListener(this.close, "click", function(event) {
			event.preventDefault();
			_this.hide();
		});
	};
	return new Dialog()
});