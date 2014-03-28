function ActionUI() {
    ActionUI.superclass.constructor.apply(this, arguments);
}
$jex.extendClass(ActionUI, XControl);

ActionUI.prototype.update = function(data) {
    for (var i = 0, max = data.data.length; i < max; i++) {
        this.text('<div class="type-list" id="single_action">');
        this.insertHead(data.data[i]);
        this.inserttypelist(data, data.data[i]);
        this.text('<div class="list-body" id="actionlist',data.data[i].id,'">');
        this.singleAction(data.data[i].activities);
        this.text("</div>");
        this.text('</div>');
    }
    this.onInit(function() {
        $(this).trigger("overrender");
    });
}

ActionUI.prototype.insertHead = function(data) {
    this.text('<ul class="content-bars">');
    this.text('    <li class="content-bar__ones"></li>');
    this.text('    <li class="content-bar__titles">', data.name, '</li>');
    this.text('    <li class="content-bar__twos"></li>');
    this.text('    <li class="content-bar__nums"><a href="action-list.html?id=', data.id, '" class="type-many">更多>></a></li>');
    this.text('    <li class="content-bar__threes"></li>');
    this.text('</ul>');
}
ActionUI.prototype.inserttypelist = function(data, currentdata) {
    var singlelist = QNR.Tools.filter(data.typelist, function(elem) {
        return elem.id === currentdata.id
    })[0].child;

    this.text('<div class="list-head">');
    this.text('    <div class="list-tabs" id="',currentdata.id,'">');
    this.text('        <a class="on" href="#" id="hot">最热</a>');
    for (var i = 0, max = singlelist.length; i < max; i++) {
        this.text('    <a href="#" data-i="0" id="',singlelist[i].id,'">', singlelist[i].subName, '</a>');
    }
    this.text('    </div>');
    this.text('</div>');
}
ActionUI.prototype.singleAction = function(data) {
    this.text('     <ul class="action-type">');
    for (var i = 0, max = data.length; i < max; i++) {
        this.text('         <li class="action-list bd">');
        this.text('             <a href="action-info.html?actionid=', data[i].id, '" class="action-img">');
        this.text('                 <img src="', eDomain.getURL("img/posterimg")+data[i].poster, '" alt="', data[i].title, '"></a>');
        this.text('             <div class="action-info bd">');
        this.text('                 <h3 class="action-name"><a href="action-info.html?actionid=', data[i].id, '">', data[i].title, '</a></h3>');
        this.text('                 <p class="action-time">');
        this.text('                     <span class="date">', data[i].startDay, '</span>');
        this.text('                     <span class="actiom-time">', data[i].startHHMM, '</span>');
        this.text('                 </p>');
        this.text('                 <address class="action-place" title = "', data[i].place, '">', data[i].place, '</address>');
        this.text('                 <p class="action-people">', data[i].peopleNum, '人参加</p>');
        this.text('             </div>');
        this.text('           </li>');
    }
    if(data.length === 0){
        this.text('<div class="noaction">还没有活动信息</div>');
    }
    this.text('      </ul>');

}
ActionUI.prototype.loadData = function(typelist) {
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("actiontype/list"),
        dataType: "json",
        cache:false,
        success: function(data) {
            if(!data.ret){
                alert(data.errmsg);
                return false;
            }
            data.typelist = typelist;
            $(me).trigger("loadAllaction", data);
        },
        error: function(data) {

        }
    });
}

module.exports = ActionUI;