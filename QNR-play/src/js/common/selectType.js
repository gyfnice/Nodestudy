var $mask = $("#mask");
var $type = $(".select-type");

var closeHandle = function(me) {
    me.hide();
};
var successHandle = function(me,userid,followtype) {
    var datalist = [];
    $(".select-type input:checked").each(function(index, value) {
        datalist.push(value.id);
    });
    me.addtype(datalist.join(','),userid,followtype);
    me.hide();
};
var cancelHandle = function(me) {
    me.hide();
};
var EventMap = {
    "select-close": closeHandle,
    "btn-ok": successHandle,
    "btn-cancel": cancelHandle
};

function selectType() {
    selectType.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(selectType, XControl);
selectType.prototype.update = function(data) {
    var followlist = data.selectflist || [];
    this.insertBody(data.data,followlist);
    this.onInit(function() {
        var head = document.getElementsByTagName('body')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://freshzz.corp.qunar.com/QNR-play/src/js/modernizr.custom.js';
        head.appendChild(script);
        var bscript = document.createElement('script');
        bscript.type = 'text/javascript';
        bscript.src = 'http://freshzz.corp.qunar.com/QNR-play/src/js/svgcheckbx.js';
        head.appendChild(bscript);
    });
}
selectType.prototype.insertBody = function(data,flist) {
     
    for (var i = 0, max = data.length; i < max; i++) {
        this.text('<li class="select-item1">');
        this.text('    <h4>', data[i].name, '类</h4>');
        this.text('    <div>');
        this.text('        <form class="ac-custom ac-checkbox ac-checkmark" autocomplete="off">');
        this.text('            <ul>');
        this.insertlist(data[i].child,flist);
        this.text('            </ul>');
        this.text('        </form>');
        this.text('    </div>');
        this.text('</li>');
    }
}
selectType.prototype.insertlist = function(data,flist) {
    for (var i = 0, max = data.length; i < max; i++) {
        var flag = 0;
        for(var j = 0,maxs = flist.length;j < maxs;j++){
            if(data[i].id === flist[j].id){
                flag = 1;
            }
        }
        if(flag === 0){
            this.text('<li>');
            this.text('    <input id="', data[i].id, '" name="', data[i].subName, '" type="checkbox">');
            this.text('    <label for="', data[i].id, '">', data[i].subName, '</label>');
            this.text('</li>');
        }
    }
}
selectType.prototype.addtype = function(datalist,uid,followtype) {
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("usercenter/addtype"),
        dataType: "json",
        data: {
            classifies: datalist,
            userId:uid
        },
        success: function(data) {
            if(followtype){
                followtype.loadData(uid);
            }
        },
        error: function(data) {

        }
    });
}
selectType.prototype.show = function() {
    $(this).trigger("getlist");
    $mask.height($("body").height());
    $mask.show();
    $type.show();
}
selectType.prototype.hide = function() {
    $mask.hide();
    $type.hide();
}
selectType.prototype.bindclick = function(userid,follow) {
    var me = this;
    $type.delegate(".select-close, .btn-cancel", "click", function(e) {
        EventMap[e.target.className](me,userid,follow);
    });
    $type.find(".btn-ok").unbind("click").bind("click",function(e){
        successHandle(me,userid,follow);
    });
}
selectType.prototype.loadData = function() {
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("type/list"),
        dataType: "json",
        cache:false,
        success: function(data) {
            $(me).trigger("loadselectlist", data);
        },
        error: function(data) {
            
        }
    });
}
module.exports = selectType;