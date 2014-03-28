/***
 * 伟大的X系UI控件基类
 * 具有X前缀的，必须继承自该控件
 * 
 * setting格式
 * {
 * 		所有事件触发
 *		on : {} 	
 *
 *		所有控件生命周期内重构调用,或增加额外方法
 *		handler : {}	
 * }
 * 
 * @param setting
 * 
 * @use
 * 		如下方法继承

	function XPanel( setting ){	
		XPanel.superclass.constructor.call( this , setting );
	}
	
	$jex.extendClass( XPanel , XControl );
   
   @initialize方法被触发时，dom元素可以使用
 * @return
 */

function XControl( setting ) {	
	this._type = "XControl";

	/***
	 * 配置
	 */
	this._setting = setting || {};
	
	this._onInit_funcArr = [];

	XControl.superclass.constructor.call( this , this._setting ); 
	
	var _dataSource = null;
	this.dataSource = function( val ){
		if ( val == null ){
			return _dataSource;
		}else{
			_dataSource = val; 
		}
	};	
	
	var s = this._setting;
	
	if( s.handler ){
		for ( var hkey in s.handler ) {
			this[hkey] = s.handler[hkey];
		}
	}
	
	if( s.on ){		
		for ( var eventkey in s.on ) {
			$jex.event.binding( this , eventkey , s.on[eventkey] );
		}
	}
	
};

try {

$jex.extendClass( XControl , UIObject );

XControl.prototype.update = $jex.VOIDFUNC;re

} catch(e) {}


XControl.prototype.updateSource = function( dSource ){
	
	if ( dSource ){
		this.dataSource( dSource );
	}
	
	this.update( this.dataSource() );
}

XControl.prototype.initialize = function(){	
	for( var i = 0 ; i < this._onInit_funcArr.length ; i++ ){		
		this._onInit_funcArr[i].call( this );
	}
	this._onInit_funcArr = [];	
}

/***
 * 得到elemId中定义的element
 */
XControl.prototype.elem = function(){	
	return this._setting.elemId ? $jex.$( this._setting.elemId ) : null ;	
}

/***
 * 添加一个方法，可以在initialize时被调用
 */
XControl.prototype.onInit = function( func ){	
	//$jex.event.binding( this , 'initializing' , func );
	if ( typeof func == 'function' ){
		this._onInit_funcArr.push( func );
	}
}

/***
 * 调用后将会渲染HTML
 */
XControl.prototype.render = function( el ) {
	
	var e = el || this.elem(); 
	
	if (!e){
		$jex.console.info('[XControl]没有可供生成HTML的容器',this); 
		return; 
	}

	this.write(e);

}

XControl.prototype.show = function(){

};

XControl.prototype.hide = function(){

};

XControl.prototype.find = XControl.prototype.getDomNode; 

window.XControl = XControl;