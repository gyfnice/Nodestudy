/**
 * @class $jex
 * $jex core utilities and functions.
 * @singleton
 */
   window.$jex = {
	ie: 0,
	gecko: 0,
	opera: 0,
	safari: 0,

	isdebug : false,
	testurl : ( window.location.search.indexOf('&testurl') > 0 ) ,

	browser:null,
	mobile:null,
	air: null,

	VOIDFUNC:function(){},
	globalID:(function(){var _GNUM=0;return function(){return _GNUM++;};})(),

	_innerClass : {},
	register: function( name , Class ){ $jex._innerClass[name] = Class },
	getClass : function(name){ return $jex._innerClass[name]; },

	$: function(id){ return ( typeof id == "string" ) ? document.getElementById(id) : id ; },
	_: function(a,b){var c=function(){};c.prototype=b.prototype;a.prototype=new c();},

	/***
	 * @param props {Array} 需要比较的字段名
	 */
	compare : function ( props , obj1 , obj2 ){
		var o1 = obj1 || {};
		var o2 = obj2 || {};
		for( var i = 0 ; i < props.length ; i++ ) {
			var _prop = props[i];
			if ( o1[_prop] != o2[_prop] ) {
				return false;
			}
		}
		return true;
	},

	$defined : function(obj){ return typeof obj != 'undefined' && obj != null ; },

	$empty : function(obj) { for(var k in obj){ if ( typeof obj[k] == 'function' ) continue;  return false; } return true; },

	parseQueryParam : function(){
		var p = {};
		var s = window.location.search.replace('?','').split('&');
		for ( var i = 0 ; i < s.length ; i++ ){
			var sp = s[i].split('=');
			p[ sp[0] ] = decodeURIComponent( sp[1] );
		}
		return p;
	},

	/***
	 *  @use

	   		function XPanel( setting ){
				XPanel.superclass.constructor.call( this , setting );
			}
			$jex.extendClass( XPanel , XControl );

	 *	@btw 使用时千万注意调用父类构造方法的顺序
	 */
	extendClass : function(){

		//Object constructor
		var oc = Object.prototype.constructor;

		return function( subclass , superclass ){

			var spp = superclass.prototype;
			var sbp = subclass.prototype;

			var F = function(){};
			F.prototype = spp;

			//实现复制父类原型
			sbp = subclass.prototype = new F();

			//增加superclass,修正constructor
			subclass.superclass = spp;

			sbp.constructor = subclass;
			if( spp.constructor == oc){ spp.constructor = superclass; }

			//以防继承toString被覆盖
			subclass.prototype.toString = superclass.prototype.toString;

			return subclass;
		};

	}() ,

	body: function(doc){if(!doc) doc=document;return doc.body? doc.body : doc.getElementsByTagName("body")[0];},
	doc: function(el){return el?el.nodeType==9?el:el.ownerDocument||document:document;},

	merge: function(o, c){for(var p in c){ if(c[p] !== undefined){ o[p] = c[p]; } };return o;},

	exec: function(func){return func();},

	toInt:function(s,d){var t;return isNaN(t = parseInt(s))? d : t;},
	toFloat:function(s,d){var t;return isNaN(t = parseFloat(s))? d : t;},
	toBoolean:function(s){if(!s) return false;return (s==true || (s=s.toUpperCase())=='TRUE' || s=='1');},

	toQueryString : function( data ) {
		var url = [];
		$jex.foreach( data , function(v,i,k){
			if ( i > 0 ){
				url.push('&');
			}
			url.push( encodeURIComponent(k) , '=' , encodeURIComponent(v) );
		});
		return url.join('');
	},

	text: function(el){return el.innerText || el.textContent;},
	trim: function(str,type){switch(type){case 'l':return str.replace(/(^\s*)/g, "");case 'r':return str.replace(/(\s*$)/g, "");default :return str.replace(/(^\s*)|(\s*$)/g, "");}},
	stripTag: function(str) {return str.replace(/<\/?[^>]+>/gi, '');},
	starsWith: function(source,prefix,offset){if(!offset)offset=0;if(!source || source.length <offset+prefix.length)return false;return source.substring(offset,prefix.length) == prefix;},

    exists: function(obj,name){var p = name.split('.'),i;for(i = 0; i < p.length; i++){if(!obj[p[i]]) return false; obj = obj[p[i]];}return true;},
	isNull: function(target){return (typeof target == 'object') && !target;},
	isNumber: function(target){return typeof target == 'number' && isFinite(target)?true:false;},
	isArray: function(target){return !!target && target.constructor == Array;},

	removeElement: function(obj){if(obj && obj.parentNode)obj.parentNode.removeChild(obj);},
	isChildrenOf : function(node,ancestor,guaranteeDescendant){if(guaranteeDescendant && node) { node = node.parentNode; }while(node) {if(node == ancestor)return true;node = node.parentNode;}return false;},

	hasClassName: function(el, name) {if (!el) return; return this.array.indexOf(el.className.split(/\s+/), name) != -1;},
	addClassName: function(el,name){if (!el) return; if(this.hasClassName(el,name))return;el.className = el.className + ' ' + name;},
	removeClassName: function(el,names){if (!el) return; if(typeof names=='string')names=[names];el.className=this.array.select(el.className.split(/\s+/),function(a){return($jex.array.indexOf(names,a)== -1);}).join(' ');},

	//add by linhao
	toggleClassName: function( el, name , addFunc , removeFunc ){
		if ( $jex.hasClassName( el , name ) ){
			$jex.removeClassName( el , name );
			if ( removeFunc ) removeFunc();
		}else{
			$jex.addClassName( el , name );
			if ( addFunc ) addFunc();
		}
	},

	createCssText: function(text,doc){if(!text) return;if(!doc) doc = document;var style = doc.createElement("style");style.setAttribute("type", "text/css");var head = doc.getElementsByTagName("head")[0];if(!head) return; else head.appendChild(style);if(style.styleSheet)style.styleSheet.cssText = text;else{var cssText = doc.createTextNode(text);style.appendChild(cssText);}return style;},
	createCssLink: function(href,doc){if(!href) return;if(!doc) doc = document;if(document.createStyleSheet)document.createStyleSheet(href);else{var css = doc.createElement("link");css.setAttribute('rel', 'stylesheet');css.setAttribute('type', 'text/css');css.setAttribute('href', href);var head = doc.getElementsByTagName("head")[0];if(!head) return; else head.appendChild(css);}},

	stopEvent: function(evt){if(window.event){event.returnValue = false;event.cancelBubble = true;}else{evt.preventDefault();evt.stopPropagation();}},
	callback: function(elem,handler){return function(){return handler.apply(elem,arguments);};},
	getDocumentWindow:function(doc){
		return doc.parentWindow || window;
	},

	array: {
		toArray: function(iterable){if (!iterable) return []; var results=[],i;for (i = 0; i < iterable.length; i++) results.push(iterable[i]); return results;},
		indexOf: function(arr,object){for (var i=0,n=arr.length; i<n; i++)if(arr[i] == object) return i;return -1;},
		each: function(arr,func){if(!arr) return;for(var i=0,n=arr.length;i<n;i++){func(arr[i],i);}},
		select: function(arr,func){if(!arr) return[]; var arr1=[],i,n;for(i=0,n=arr.length;i<n;i++){if(func(arr[i])) arr1.push(arr[i]);} return arr1;},
		copy: function(arr1,arr2,start,end){var i=start||0,len=end||arr1.length;for(;i<len;++i){arr2.push(arr1[i]);}},
		remove: function(arr,obj,loose){var num=0,i,n;for(i=0,n=arr.length;i<n;i++){if(arr[i]===obj || loose&&arr[i]==obj){arr.splice(i--,1);num++;}}return num;}
	},
	hash: {
		each: function(hash, func) {
		for(var key in hash) {
				func(key, hash[key]);
			}
		}
	},
	each: function(obj, func) {
		if (obj instanceof Array) {
			this.array.each(obj, func);
		} else {
			this.hash.each(obj, func);
		}
	},

	$continue : new Object(),
	$break : new Object(),

	/***
	 * 与each的区别在于,并且支持
	 * $jex.$continue
	 * $jex.$break
	 *
	 * object的func( value , index , key )
	 * array 的func( value , index )
	 */
	foreach : function( listArr , iterFunc ) {

		var result = null;

		if ( listArr instanceof Array ) {

			for ( var i = 0 ; i < listArr.length ; i++ ) {
				var item = listArr[i];
				result = iterFunc( item , i );
				if ( result == $jex.$continue ) { continue; }
				if ( result == $jex.$break ) { break; }
			}

		}else{

			var i = 0;
			for ( var key in listArr ) {
				var item = listArr[key];
				result = iterFunc( item , i , key );
				if ( result == $jex.$continue ) { continue; }
				if ( result == $jex.$break ) { break; }
				i++;
			}

		}

		return result;

	},

	event:{
		doclick: function(linkId){
			var fireOnThis = document.getElementById(linkId)
			  if (document.createEvent)
			  {
				var evObj = document.createEvent('MouseEvents')
				evObj.initEvent( 'click', true, false )
				fireOnThis.dispatchEvent(evObj)
			  }
			  else if (document.createEventObject)
			  {
				   fireOnThis.fireEvent('onclick')
			  }
		},
		add: function(obj, name, handler){},
		remove: function(handler){},
		bind: function(elem, name, handler){
			var notmark = (elem == window && name=='unload');
			if(elem.addEventListener){
				var useCapture=false;
				if(name=="focusin"){
					name="focus";
					useCapture=true;
				}else if(name=="focusout"){
					name="blur";
					useCapture=true;
				}
				elem.addEventListener(name,handler,useCapture);
				handler=this.add(elem, name, handler,useCapture?4:1,notmark);
			}else if(elem.attachEvent){
				handler = $jex.callback(elem, handler);
				elem.attachEvent("on"+name,handler);
				handler=this.add(elem, name, handler,2,notmark);
			}else{
				elem["on"+name]=handler;
				handler=this.add(elem, name, handler,3,notmark);
			}
			return handler;
		},
		bindDom: function(elem, name, target, handler){
			return this.bind(elem, name, function(e){
				if ( !e.target ){
					e.target = e.srcElement;
				}
				handler.call(target,e,this);
			});
		},
		stop: function(elem, name){this.bind(elem,name,function(e){$jex.stopEvent(e);return false;});},
		trigger: function(elem, name, arg){}
	},
	element: {
		hide: function(ele) {
			if (!ele) return;
			ele.style.display = 'none';
			return ele;
		},
		show: function(ele) {
			if (!ele) return;
			ele.style.display = 'block';
			return ele;
		},
		visible: function(ele) {
			if (!ele) return false;
			return ele.style.display != 'none';
		},
		toggle: function( el ){
			for(var el = arguments[0], i = 0 , len = arguments.length ; i < len ; i++ , el = arguments[i])
			{
				el = $jex.$(el);

				if(!el)continue;

				if($jex.element.visible(el))
					$jex.element.hide(el);
				else
					$jex.element.show(el);
			}
		}
	}

};

$jex.createXMLHttpRequest= $jex.exec(function(){var adapterID=0,adapters=[function() {return new XMLHttpRequest();},function() {return new ActiveXObject('Msxml2.XMLHTTP');},function() {return new ActiveXObject('Microsoft.XMLHTTP');}];return function(){for(var i=adapterID;i<adapters.length;i++){try{adapterID=i;return adapters[i]();}catch(e){}}return $jex.VOIDFUNC;};});

$jex.exec(function(){
    var ua=navigator.userAgent, m;

    if ((/WebKit|KHTML/).test(ua)){
    	$jex.browser='safari';
        $jex.safari=1;
    }
    m=ua.match(/AppleWebKit\/([^\s]*)/);
    if (m&&m[1]) {
    	$jex.safari=$jex.toFloat(m[1]);

        if (/ Mobile\//.test(ua)) {
        	$jex.mobile = "Apple";
        } else {
            m=ua.match(/NokiaN[^\/]*/);
            if (m)
            	$jex.mobile = m[0];
        }

        m=ua.match(/AdobeAIR\/([^\s]*)/);
        if (m)
        	$jex.air = m[0];
    }else{
        m=ua.match(/Opera[\s\/]([^\s]*)/);
        if (m&&m[1]){
        	$jex.opera = $jex.toFloat(m[1]);
        	$jex.browser='opera';
            m=ua.match(/Opera Mini[^;]*/);
            if (m)
                $jex.mobile = m[0];
        }else {
            m=ua.match(/MSIE\s([^;]*)/);
            if (m&&m[1]) {
            	$jex.browser='ie';
            	$jex.ie=$jex.toFloat(m[1]);
            } else {
                m=ua.match(/Gecko\/([^\s]*)/);
                if (m) {
                	$jex.browser='gecko';
                    $jex.gecko=1;
                    m=ua.match(/rv:([^\s\)]*)/);
                    if (m&&m[1]) {
                    	$jex.gecko=$jex.toFloat(m[1]);
                    }
                }
            }
        }
    }
    return false;
});

$jex.exec(function(){
	var boxModel = -1;
	$jex.boxModel =function(){
		if(boxModel !== -1)
			return boxModel;
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";
		document.body.appendChild( div );
		boxModel = div.offsetWidth === 2;
		document.body.removeChild( div ).style.display = 'none';
		return boxModel;
	};

	if ( window.location.hostname.indexOf('local') >= 0 || window.location.search.indexOf('debug=true') > 0 ) {
		$jex.isdebug = true;
	}

});

$jex.exec(function(){

	var initialized = false,doesNotAddBorder,doesAddBorderForTableAndCells,subtractsBorderForOverflowNotVisible,doesNotIncludeMarginInBodyOffset;

	function initialize() {
		if ( initialized ) return;
		var body = document.body, container = document.createElement('div'), innerDiv, checkDiv, table, td, rules, prop, bodyMarginTop = body.style.marginTop,
			html = '<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;" cellpadding="0" cellspacing="0"><tr><td></td></tr></table>';

		rules = { position: 'absolute', top: 0, left: 0, margin: 0, border: 0, width: '1px', height: '1px', visibility: 'hidden' };
		for ( prop in rules ) container.style[prop] = rules[prop];

		container.innerHTML = html;
		body.insertBefore(container, body.firstChild);
		innerDiv = container.firstChild, checkDiv = innerDiv.firstChild, td = innerDiv.nextSibling.firstChild.firstChild;

		doesNotAddBorder = (checkDiv.offsetTop !== 5);
		doesAddBorderForTableAndCells = (td.offsetTop === 5);

		innerDiv.style.overflow = 'hidden', innerDiv.style.position = 'relative';
		subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		body.style.marginTop = '1px';
		doesNotIncludeMarginInBodyOffset = (body.offsetTop === 0);
		body.style.marginTop = bodyMarginTop;
		body.removeChild(container);
		initialized = true;
	}

	if ( document.documentElement["getBoundingClientRect"] )
		$jex.offset = function(elem) {
			if ( elem === elem.ownerDocument.body ) return $jex.bodyOffset( elem );
			var box  = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement,
				clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
				top  = box.top  + (self.pageYOffset || $jex.boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
				left = box.left + (self.pageXOffset || $jex.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;
			return { top: top, left: left };
		};
	else
		$jex.offset = function(elem) {
			if ( elem === elem.ownerDocument.body ) return $jex.bodyOffset( elem );
			initialized || initialize();

			var elem = elem, offsetParent = elem.offsetParent, prevOffsetParent = elem,
				doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
				body = doc.body, defaultView = doc.defaultView,
				prevComputedStyle = defaultView.getComputedStyle(elem, null),
				top = elem.offsetTop, left = elem.offsetLeft;

			while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
				computedStyle = defaultView.getComputedStyle(elem, null);
				top -= elem.scrollTop, left -= elem.scrollLeft;
				if ( elem === offsetParent ) {
					top += elem.offsetTop, left += elem.offsetLeft;
					if ( doesNotAddBorder && !(doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.tagName)) )
						top  += parseInt( computedStyle.borderTopWidth,  10) || 0,
						left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
					prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
				}
				if ( subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" )
					top  += parseInt( computedStyle.borderTopWidth,  10) || 0,
					left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
				prevComputedStyle = computedStyle;
			}

			if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" )
				top  += body.offsetTop,
				left += body.offsetLeft;

			if ( prevComputedStyle.position === "fixed" )
				top  += Math.max(docElem.scrollTop, body.scrollTop),
				left += Math.max(docElem.scrollLeft, body.scrollLeft);

			return { top: top, left: left };
		};

	$jex.bodyOffset=function(){
		initialized || initialize();
		var top = body.offsetTop, left = body.offsetLeft;
		return { top: top, left: left };
	};

	//add by linhao
	$jex.pointerX = function(event){
        return event.pageX ||
        (event.clientX +
        (document.documentElement.scrollLeft || document.body.scrollLeft));
    },

    $jex.pointerY = function(event){
        return event.pageY ||
        (event.clientY +
        (document.documentElement.scrollTop || document.body.scrollTop));
    },

//  兼容方法得到scrollTop与scrollLeft
//	var scrollTop = window.pageYOffset
//    || document.documentElement.scrollTop
//    || document.body.scrollTop
//    || 0;
//
//	var scrollLeft = window.pageXOffset
//    || document.documentElement.scrollLeft
//    || document.body.scrollLeft
//    || 0;

	//TODO getPageSize有性能问题
	$jex.getPageSize = function(){

	    var xScroll, yScroll;

	    if (window.innerHeight && window.scrollMaxY) {
	        xScroll = document.body.scrollWidth;
	        yScroll = window.innerHeight + window.scrollMaxY;
	    } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
	        xScroll = document.body.scrollWidth;
	        yScroll = document.body.scrollHeight;
	    } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
	        xScroll = document.body.offsetWidth;
	        yScroll = document.body.offsetHeight;
	    }

	    var windowWidth, windowHeight;
	    if (self.innerHeight) {    // all except Explorer
	        windowWidth = self.innerWidth;
	        windowHeight = self.innerHeight;
	    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
	        windowWidth = document.documentElement.clientWidth;
	        windowHeight = document.documentElement.clientHeight;
	    } else if (document.body) { // other Explorers
	        windowWidth = document.body.clientWidth;
	        windowHeight = document.body.clientHeight;
	    }

	    // for small pages with total height less then height of the viewport
	    if(yScroll < windowHeight){
	        pageHeight = windowHeight;
	    } else {
	        pageHeight = yScroll;
	    }

	    // for small pages with total width less then width of the viewport
	    if(xScroll < windowWidth){
	        pageWidth = windowWidth;
	    } else {
	        pageWidth = xScroll;
	    }

	    return { pageWidth : pageWidth , pageHeight : pageHeight , windowWidth : windowWidth , windowHeight : windowHeight  };
	}

});

$jex.exec(function(){

	function setObjectValue(target,id,obj){
		if(!target[id])
			target[id]=obj;
		else if(target[id] instanceof Array){
			var arr = target[id];
			if(obj instanceof Array){
				for(var i=0;i<obj.length;i++)
					arr.push(obj[i]);
			}else
				target[id].push(obj);
		}else
			target[id]=[target[id],obj];
	}

	var readObject = $jex.readObject = function(el,target,id){
		var obj,text;
		var childs = el.getAttribute('jxChilds') || !target;

		if(text=el.getAttribute('jxObject')){
			obj = eval('({'+text+'});');
		}else if(text=el.getAttribute('jxValue')){
			if(_Rp$(text,'%.'))
				obj=el.getAttribute(text.substring(2));
			else
				obj = text;
		}else if(!childs)
			obj = el.innerHTML;
		else
			obj ={};

		if(childs == '1'){
			var els = el.childNodes;
			for(var i=0;i<els.length;i++){
				if(els[i].nodeType == 1){
					var _id=els[i].getAttribute('jxc');
					if(_id)
						readObject(els[i],obj,_id);
				}
			}
		}
		if(id == '.')
			asd=(obj)

		if(target && id){
			if(id == '.')
				for(var i in obj)
					setObjectValue(target,i,obj[i]);
			else
				setObjectValue(target,id,obj);
		}
		return obj;
	};

	function getEventStack(obj, name, create){
		var arr,prop=obj.__x_;
		if(prop){
			arr=prop[name];
			if(!arr){
				arr=[];
				if(create) prop[name]=arr;
			}
		}else{
			arr=[];
			if(create){
				obj.__x_={};
				obj.__x_[name]=arr;
			}
		}
		return arr;
	}

	function getEventStackCopy(obj, name){
		var arr=[],prop=obj.__x_;
		if(prop){
			if(name){
				if(prop[name])
					$jex.array.copy(prop[name],arr);
			}else{
				$jex.array.each(prop,function(name,obj){$jex.arraycopy(obj,arr);});
			}
		}
		return arr;
	}

	var events=[];

	/***
	 * for 加强版bind
	 */
	var bindingArr = "blur,focus,load,resize,scroll,unload,click," +
					 "mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave," +
					 "change,select,submit,keydown,keypress,keyup,error";
	var bindingEvent = {
		"keypress" : function( object , target , eventname , handler ){
			return $jex.event.bindDom( object ,$jex.ie || $jex.safari ? 'keydown':'keypress' , target , handler );
		}
	};
	/***
	 * 加强版bind
	 * 自己分辨是否bindDom还是add
	 * @object 要绑定的对象，一般绑定到element
	 * @target 事件处理的this指向的对象
	 * @eventname 要绑定的名称
	 * @handler 事件处理
	 */
	$jex.event.binding = function( object , target , eventname , handler ){

		if ( !object ){	return;	}

		//如果只有3个参数，则认为object==target
		if ( arguments.length == 3 ) {
			handler = eventname;
			eventname = target;
			target = object;
		}

		if ( bindingArr.indexOf( eventname.toLowerCase() ) < 0 ) {
			//自定义事件
			return $jex.event.add( target , eventname , handler );
		}else{
			//DOM事件
			if ( !bindingEvent[ eventname ]  ){
				return $jex.event.bindDom( object , eventname , target , handler );
			}else{
				return bindingEvent[ eventname ](  object , target , eventname , handler );
			}
		}

	}

    $jex.event.addEx = function(objarr, name, handler, type, notmark){
        for ( var i = 0, n = objarr.length ; i < n ; i++ ){
            var obj = objarr[i];
            $jex.event.add( obj , name , handler , type , notmark );
        }
    }

	$jex.event.add = function(obj, name, handler, type, notmark){
		obj = new EventListener(obj,name,handler,type);
		if(!notmark){
			events.push(obj);
			obj.refer = events.length-1;
		}
		return obj;
	};

	$jex.event.remove = function(listener){
		listener.remove();
		var i=listener.refer;
		if(!(i<0)){
			var obj=events.pop();
			if(i<events.length){
				events[i]=obj;
				obj.refer=i;
			}
			listener.refer=-1;
		};
	};

	$jex.event.clear = function(elem, name){
		$jex.array.each(getEventStackCopy(elem,name), $jex.event.remove);
	};

	$jex.event.trigger=function(elem, name, arg){

		$jex.console.info( "[事件触发] name:" , name , ", elem:" , elem , "  , arg:" , arg );
		//$jex.console.start( "[事件触发执行时间] " + name + ":" );

		var args=[];
		$jex.array.copy(arguments,args,2);
		this.triggerParam(elem, name, args);

		//$jex.console.end( "[事件触发执行时间] " + name + ":" );
	};

	$jex.event.triggerParam=function(elem, name, args){
		$jex.array.each(getEventStackCopy(elem,name),function(func){
			func.apply(elem,args);
		});
	};

	$jex.event.click = function( elemId , func ){
		$jex.event.binding( $jex.$(elemId) , 'click' , function(evt){
			func(evt);
			$jex.stopEvent(evt);
		});
	}

	/***
	 * 判断事件是否在指定的窗口对象中
	 * @return {bool}
	 */
	$jex.event.within = function( contentEl , evt ){
		var element = typeof event != "undefined" ? event.srcElement : evt.target;
		var isIn = false;
	    while (element) {
	    	isIn = ( element == contentEl );
	        if ( isIn ) break;
	        element = element.parentNode;
	    };

	    return isIn;
	};

    $jex.errorStack = []
    window.onerror = function(e){
    	e.toString = $jex.errToString;
        $jex.console.error( e );
    }

	function EventListener(elem,name,handler,type){
		this.elem=elem;
		this.name=name;
		this.handler=handler;
		this.type=type;
		this.refer=-1;
		getEventStack(elem,name,true).push(this);
	}

	EventListener.prototype.remove = function(){
		if(this.elem){
			switch(this.type){
				case 1:
					this.elem.removeEventListener(this.name,this.handler,false);break;
				case 4:
					this.elem.removeEventListener(this.name,this.handler,true);break;
				case 2:
					this.elem.detachEvent("on"+this.name,this.handler);break;
				case 3:
					this.elem["on"+this.name]=null;break;
			}
			$jex.array.remove(getEventStack(this.elem,this.name), this);
			this.elem=this.handler=null;
		}
	};

	EventListener.prototype.apply = function(obj,args){
		return this.handler.apply(obj,args);
	};

});

//ADD by linhao
$jex.exec(function(){


	/***
	 * ScriptRequest
	 */
	function ScriptRequest(option){
		if(option.funcName)
			this.funcName = option.funcName;
		this.callbackName=option.callbackName || 'callback';
		this.doc = option.doc || document;
		this.win = $jex.getDocumentWindow(this.doc);

		if(option.onerror)
			$jex.event.add(this,'error',option.onerror);
		if(option.ontimeout)
			$jex.event.add(this,'timeout',option.ontimeout);
		if(option.oncancel)
			$jex.event.add(this,'cancel',option.oncancel);
		if(option.oncomplete)
			$jex.event.add(this,'complete',option.oncomplete);
	}

	ScriptRequest.loadScript = function(url,doc) {
		doc = doc || document;
		var port = doc.createElement("script");
		port.type = "text/javascript";
		port.src = url;
		doc.getElementsByTagName("head")[0].appendChild(port);
		return port;
	};

	ScriptRequest.prototype.send = function(url, timeout){

		var cid = this.callID = this.funcName ? this.funcName : 'XQScript_'+$jex.globalID();

		if(url.indexOf('?') == -1)
			url=url+'?';

		url+='&'+this.callbackName+'='+cid;

		var _self = this;
		var _win = this.win;

		var timerid;

		_win[cid] = function(){
			if(timerid){
				window.clearTimeout(timerid);
				timerid=null;
			}
			_self.release();
			_win[cid] = null;
			$jex.event.triggerParam(_self,'complete',$jex.array.toArray(arguments));
		};
		if(timeout && timeout >0){
			timerid = window.setTimeout(function(){
					_self.release();
					$jex.event.trigger(_self,'timeout');
				},timeout
			);
		}
		this.searchPort=ScriptRequest.loadScript(url,this.doc);
	};

	ScriptRequest.prototype.release=function(){
		if(this.searchPort){
			$jex.removeElement(this.searchPort);
			this.searchPort = null;
			this.win[this.callID] = $jex.VOIDFUNC;
			return true;
		}
		return false;
	};

	ScriptRequest.prototype.cancel=function(){
		if(this.release())
			$jex.event.trigger(this,'cancel');
	};

	$jex.scriptRequest = ScriptRequest;

	$jex.jsonp = function( url , data , successhandler , options ){

		//接受 $jex.jsonp( url , callback )  形式调用
		if ( arguments.length == 2 && typeof data == "function" ) {
			successhandler = data;
			data = {};
		}

		options = options || {};
		options.oncomplete = successhandler;

		var timeout = options.timeout || {} ;

		if( url.indexOf('?') == -1 ) url=url+'?';
		for ( var k in data ){
			url += '&' + k + '=' + encodeURIComponent( data[k] );
		}

		var req = new ScriptRequest( options );
		req.send( url );

		if ( timeout.time && timeout.time > 0 ){
			window.setTimeout ( function () {
				req.cancel();
				timeout.func();
			} , timeout.time );
		}

		return req;
	}

	$jex.ajax = function( url , data , successhandler , options ) {

		if ( $jex.isdebug && $jex.gecko ) {
			//本地FF跨域调试
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			} catch (e) {
				alert("Permission UniversalBrowserRead denied.");
			}
		}

		var request = $jex.createXMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				if (request.status >= 200 && request.status < 300) {
					var _result = {result:{}};
					try {
						var str = request.responseText;
						if ( str ) {
							if ( str.charAt(0,1) == "{" ){ str = "(" + str + ")"; }
							_result = eval( str );
							successhandler( _result );
						} else {
							if ( options.onerror ){	options.onerror( request );	}
							$jex.console.error( url , "返回值为空");
						}
					} catch(e) {
						if ( options.onerror ){	options.onerror(e);	}
						e.toString = $jex.errToString;
						$jex.console.error(url, e);
					}
				}
			}
		};

		var token = Math.floor( Math.random() * 100000 );
		data._token = token;

		if( url.indexOf('?') == -1 ) url=url+'?';
		request.open("GET", url + "&" + $jex.toQueryString(data) ,true);
		request.send(null);

		$jex.console.info( "[接口调用 token=" , token , "]" , " url:" , url , data , successhandler , options , request );

		return request;
	};


	//控制台
	var timeMap = {};
	var _consoleStack = [];
	var _filter = { "INFO":1, "WARN":1 };
	$jex.errToString = function(){
		var s = ["[ERROR]"];
		for ( var key in this ){
			if ( typeof this[key] == 'function' ) continue;
			s.push( key , ":" , this[key] , '<br/>' );
		}
		return s.join(' ');
	}

	var _pushToStack = function( level ){
		if ( !_filter[level] ){
			return function(){
				_consoleStack.push( arguments );
			};
		}else{
			return $jex.VOIDFUNC;
		}
	};

	$jex.console = {
		info : new _pushToStack("INFO"),
		error : new _pushToStack("ERROR"),
		warn : new _pushToStack("WARN") ,
		time : new _pushToStack("TIME") ,
		trace : new _pushToStack("TRACE")
	};

	//TODO 修改为缓存
	if ( $jex.isdebug ){
//		$jex.console = console;
//		$jex.console.time = console.info;
//		$jex.console.error = console.error;
	}

	$jex.console.start = function( key ){ timeMap[key] = new Date(); }
	$jex.console.end = function( key ){
		if ( timeMap[key] ){
			$jex.console.time("[TIME]", key , ":" , new Date() - timeMap[key]);
			delete timeMap[key];
		}
	};

	$jex.console.output = function(){
		var str = [];
		for ( var i = 0 ; i < _consoleStack.length ; i++ ){
			var line = [];
			var args = _consoleStack[i];
			for ( var j = 0 ; j < args.length ; j++ ){
				line.push( args[j] );
			}
			str.push( line.join('') );
		}

		var div = $jex.$('divDebugConsole');
		if ( div ) {
			div.innerHTML = str.join('<br/>');
			$jex.element.show( div );
		}else{
			alert( str.join('\r\n') );
		}
	}

	$jex.event.binding( document , "keydown" , function(ev){
		if( ( ev.keyCode==121 && ev.ctrlKey && ev.altKey ) || ( ev.keyCode==77 && ev.ctrlKey && ev.altKey ) ){
			$jex.console.output();
		}
	});

});



/***
 * UIObject
 */
function UIObject(){
	this._XGUI_=true;
	this._content_ = [];
	this._childrens_ = [];
	this._GID_ = "XI"+$jex.globalID();;
	this._tplsreg = /\{\#([^\}]*?)\}/;
}
window.UIObject = UIObject;
UIObject.prototype.isempty = function(){
	return this._content_.length == 0;
}

UIObject.prototype.clear = function(){
	this._content_ = [];
	this._childrens_ = [];
};

//TODO 增加一个可以获得同样ID的方法

UIObject.prototype.newid = function( id ){
	return id + this._GID_;
}

//ADD by linhao
/***
 * tpls : templates
 * 效率比append低，需要同名id标记时使用
 * 替换{#xxx}为xxxXI0
 */
UIObject.prototype.tpls = function(args){
	var html = this._content_;
	var com = this._childrens_;
	var gid = this._GID_;

	for(var i=0;i<arguments.length;i++){
		var o = arguments[i];
		if( o != null ){
			if( o.indexOf("{#") < 0 )
				html.push(o);
			else{
				if(o._XGUI_ == true){
					com.push(o);
					html.push(o);
				} else {
					//html.push(' id="' , o , gid , '"');
					html.push( o.replace( this._tplsreg , '$1' + gid ) );
				}
			}
		}
	}

	return this;

}

UIObject.prototype.append=function(args){
	var html = this._content_;
	var com = this._childrens_;
	var gid = this._GID_;

	for(var i=0;i<arguments.length;i++){
		var o = arguments[i];
		if(o!=null){
			if(i%2 == 0)
				html.push(o);
			else{
				if(o._XGUI_ == true){
					com.push(o);
					html.push(o);
				}else
					html.push(' id="',o,gid,'"');
			}
		}
	}
	return this;
};

UIObject.prototype.text=function(texts){
	var html = this._content_;
	for(var i=0;i<arguments.length;i++)
		html.push(arguments[i]);
	return this;
};

UIObject.prototype.getDomNode = function(name){
	return $jex.$(name+this._GID_,this._document_);
};



UIObject.prototype.initDocument=function(_document){
	this._document_ = _document;
	var com = this._childrens_;
	for(var i=0;i<com.length;i++)
		com[i].initDocument(_document);
	this.initialize();
};

UIObject.prototype.write=function(node){
	var html = this.toString();
	if ( html ){
		node.innerHTML = html;
		this.initDocument($jex.doc(node));
	} else {
		node.innerHTML = "";
	}
};

UIObject.prototype.toString=function(){
	return this._content_.join("");
};

UIObject.prototype.initialize=$jex.VOIDFUNC;


//ADD by linhao

//TODO 需要重构成为hashlist
$jex.List = function(temp){
	this._map = {};
	this._size = 0;
	this.addRange( temp );
};

$jex.exec(function(){
	var NONE= new Object();

 	$jex.List.prototype.addRange = function(temp){
 		var size = this._size;
		if(temp){
			var m=this._map;
			for(var i in temp){
				var v = temp[i];
				m[i]= v == null ? NONE : v;
				size++;
			}
		}
		this._size=size;
 	}

	$jex.List.prototype.firstkey=function(){
		var s = this.keys();
		if ( s.length == 0 ) return null;
		return s[0];
	}

	$jex.List.prototype.first=function(){
		var s = this.keys();
		if ( s.length == 0 ) return null;
		return this.get( s[0] );
	}

	$jex.List.prototype.get=function(key){
		var v = this._map[key];
		return v === NONE ? null: v;
	};
	$jex.List.prototype.put=function(key,value){
		var v = this._map[key];
		if(typeof v ==='undefined')
			this._size++;
		if(value == null)
			value = NONE;
		this._map[key]=value;
		return v;
	};
	$jex.List.prototype.keys=function(){
		var arr = [];
		var m = this._map;
		for(var i in m)
			arr.push(i);
		return arr;
	};
	$jex.List.prototype.contains=function(key){
		return this._map[key] != null;
	};
	$jex.List.prototype.remove=function(key){
		var v = this._map[key];
		if(v != null)
			this._size --;
		if(v === NONE)
			v = null;
		delete this._map[key];
		return v;
	};
	$jex.List.prototype.size=function(){
		return this._size;
	};
	$jex.List.prototype.clear=function(){
		this._map={};
		this._size=0;
	};
	$jex.List.prototype.toArray=function(){
		var m = this._map;
		var arr=[];
		for(var i in m){
			v=m[i];
			if(v === NONE)
				v=null;
			arr.push([i,v]);
		}
		return arr;
	};
	$jex.List.prototype.toString=function(){
		var sb =[];
		var map = this._map;
		for(var i in map){
			sb.push(i+': '+map[i]);
		}
		return sb.join('\n');
	};

});


/***
 * ActionDelay
 * @param delay
 * @return
 */
function ActionDelay(delay){
	this.delay = delay;
	this.timer = null;
}

ActionDelay.prototype.reset= function(func){
	this.cancel();
	this.timer = setTimeout(func,this.delay);
};

ActionDelay.prototype.cancel = function(){
	if(this.timer)
		clearTimeout(this.timer);
};

function ActionFlow(interval){	// 数组无限制长度,在核心流程控制中使用.慎!
	this.actions={};
	this.logs=[];

	this.interval = interval;
	this.tid=null;
}

ActionFlow.prototype.add = function(priority,key,func){
	var node = this.actions[key];

	if(node && node.order < priority)
		return;

	this.actions[key] = {
		order: priority,
		key: key,
		func: func
	};
	return this;
};

ActionFlow.prototype.remove = function(key){
	delete this.actions[key];
};

ActionFlow.prototype.start=function(){

	if(this.tid !== null)
		return;

	var hasMore = false;
	for(var i in this.actions){
		hasMore=true;
		break;
	}
	if(!hasMore)
		return;
	this.tid = setTimeout($jex.callback(this,this.run),this.interval);
};

ActionFlow.prototype.run=function(){
	clearTimeout(this.tid);
	this.tid=null;

	var as=this.actions,n = null;
	for(var i in as){
		var node = as[i];
		if(!n || node.order < n.order){
			n=node;
			delete as[i];
		}
	}

	if(n == null) return;
	var time = new Date().getTime();
	var state;
	try{
		n.func();
		state='done';
	}catch(e){
		state='error:'+e;
	}
	this.logs.push([time,state,new Date().getTime()-time,n.key]);
	this.start();
};

if($jex.ie >5 && $jex.ie < 7){
    try{
    	(function(){
    	    document.execCommand("BackgroundImageCache", false, true);
    	    $jex.addClassName(document.getElementsByTagName("html")[0], "jx-ie"+($jex.ie*10));
    	})();
    }catch(e){}
};