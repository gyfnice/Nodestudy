function ProceedAction() {
    ProceedAction.superclass.constructor.apply(this, arguments);
}
$jex.extendClass(ProceedAction, XControl);
ProceedAction.prototype.update = function(data) {
    for (var i = 0, max = data.length; i < max; i++) {
        this.text('<li class="bd">');
        this.text('    <a href="action-info.html?actionid=', data[i].id, '" class="user-img">');
        this.text('        <img src="', eDomain.getURL("img/posterimg")+data[i].poster, '" alt="', data[i].title, '"></a>');
        this.text('    <div class="single-info bd">');
        this.text('        <h3 class="action-name"><a href="action-info.html?actionid=', data[i].id, '">', data[i].title, '</a></h3>');
        this.text('        <p class="action-time">');
        this.text('            <span class="date">', data[i].startDay, '</span>');
        this.text('            <span class="actiom-time">', data[i].startHHMM, '-',data[i].endHHMM,'</span>');
        this.text('        </p>');
        this.text('        <address class="action-place" title = "', data[i].place, '">', data[i].place, '</address>');
        this.text('        <p class="action-people">', data[i].peopleNum, '人参加</p>');
        this.text('    </div>');
        this.text('</li>');
    }
    if(data.length === 0){
        this.text('<div class="noaction">还没有信息</div>');
    }
}
ProceedAction.prototype.loadData = function(userid){
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("usercenter/proceedaction"),
        dataType: "json",
        cache:false,
        data:{
            id:userid
        },
        success: function(data) {
            if(!data.ret){
                alert(data.errmsg);
                return false;
            }
            $(me).trigger("loadproceedaction",[data]);
        },
        error: function(data) {
            
        }
    });
}

module.exports = ProceedAction;