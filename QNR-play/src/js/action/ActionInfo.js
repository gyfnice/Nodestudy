var joinaction;

function ActionInfo() {
    ActionInfo.superclass.constructor.apply(this, arguments);
}
var checkflag = 0;
$jex.extendClass(ActionInfo, XControl);
var judgeactiondate = function(data,self){
     var curdate = new Date();
     var dateflag = 0;
      ;
     if(curdate.getTime() > new Date(data.data.startTime.replace(/-/g,"/")).getTime()){
        $(joinaction).html("<a href='#'>截止报名</div>");
        $(joinaction).find("a").click(function(e){
            e.preventDefault();
        });
        dateflag = 1;
     }
     $(self).trigger("loadjoinaction",[joinaction,dateflag,data]);
}
ActionInfo.prototype.update = function(data) {
     ;
    this.text('<div class="action-bar">');
    this.actionbar(data.data);
    this.text('</div>');
    this.text('<div class="action-list bd">');
    this.actionlist(data.data);
    this.text('</div>');
    this.text('<div class="related-info">');
    this.relateinfo(data.data);
    this.text('</div>');
    this.onInit(function(){
        joinaction = document.getElementById("btnaction");
        judgeactiondate(data,this);
        if(checkflag === 1){
            $(".related-info").css("margin-bottom","50px");
        }
    });
}

ActionInfo.prototype.actionbar = function(data) {
    this.text('<a href="action-list.html?id=',data.classifyId,'" class="action-type">', data.classifyName, '</a>');
    this.text('     <span>></span>');
    this.text('<a href="action-list.html?id=',data.classifyId,'&sid=',data.subClaId,'" class="type-sec">', data.classifyName, '-', data.subClassifyName, '</a>');
}
ActionInfo.prototype.actionlist = function(data) {
    this.text('<a href="action-info.html?action=',data.id,'" class="action-img">');
    this.text('     <img src="',eDomain.getURL("img/posterimg")+data.poster,'" alt="',data.title,'">');
    this.text('</a>');
    this.text('<div class="action-info bd">');
    this.text('     <h3 class="action-name">');
    this.text('         <a href="action-info.html?action=',data.id,'">',data.title,'</a>');
    this.text('     </h3>');
    if(data.startDay === data.endDay){
        this.text('<p class="action-time">时间:<span data-endtime="',data.endTime,'" class="date">',data.startDay,'</span>');
        this.text('     <span class="actiom-time">',data.startHHMM,'-',data.endHHMM,'</span>');
    }else{
        this.text('<p class="action-time">时间:<span data-endtime="',data.endTime,'" class="date">',data.startDay,'</span><span class="actiom-time"> ',data.startHHMM,'</span>到<span>',data.endDay,'</-span><span class="actiom-time"> ',data.endHHMM,'</span>');    
    }
    
    this.text('</p>');
    this.text('<address class="action-place">');
    this.text('     <div class="pl">地点:</div>');
    this.text('     <span class="aplace bd">',data.place,'</span>');
    this.text('</address>');
    this.text('<p class="action-fee">费用:<span>',data.avgFee,'</span>元</p>');
    this.text('<p class="action-author">发起人:<a href="userinfo.html?userid=',data.userId,'">',data.sponor,'</a></p>');
    this.text('<p class="action-people" data-pnum ="',data.peopleNum,'"><span>',data.peopleNum,'</span>人已经参加</p>');
    if(data.state === "CHECK_SUCCESS"){
        this.text('<div class="btn-action" id="btnaction" style="display:none">');
        this.text('     <a href="#">我要参加</a>');
        this.text('</div>');
        checkflag = 0;
    }else{
        checkflag = 1;
        $(".user-message").hide();
        $(".site-aside").hide();
        this.text('<div class="checksuccess" style="display:block">审核未通过</div>');
    }
    this.text('</div>');
}
ActionInfo.prototype.relateinfo = function(data) {
    this.text('<h3>活动详情</h3>');
    this.text('<div class="wr">');
    this.text(data.description);
    this.text('</div>');
}

ActionInfo.prototype.loadData = function(aid) {
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("actiontype/info"),
        dataType: "json",
        cache:false,
        data: {
            id:aid
        },
        success: function(data) {
            if(!data.ret){
                $(".site-main").html("<div class='no-action'>没有活动信息</div>");
                return false;
            }
            $(".user-message").show();
            $(me).trigger("loadactioninfo", [data]);
        },
        error: function(data) {
            
        }
    });
}
ActionInfo.prototype.postData = function(aid,uid) {
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("actiontype/addactuser"),
        dataType: "json",
        data: {
            activityId:aid,
            userId:uid
        },
        success: function(data) {
            if(!data.ret){
                alert(data.errmsg);
                return false;
            }
            $(me).trigger("reloadmember", [data]);
        },
        error: function(data) {
            
        }
    });
}
module.exports = ActionInfo;