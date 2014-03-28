function ResultList() {
    ResultList.superclass.constructor.apply(this, arguments);
}
$jex.extendClass(ResultList, XControl);
ResultList.prototype.update = function(data) {
    if(typeof data.data !== "string"){
        this.insertContent(data.data);
    }else{
        this.text('<div class="no-result">没有找到相关的活动信息</div>');
        if(data.recommend.length !== 0){
            this.text('<div class="action-rec">你可能对以下活动感兴趣</div>');
            this.insertContent(data.recommend);
        }
    }
};
ResultList.prototype.insertContent = function(data) {
    for (var i = 0, max = data.length; i < max; i++) {
        this.text('<li class="bd">');
        this.text('     <a href="action-info.html?actionid=',data[i].id,'" class="action-img">');
        this.text('         <img src="', eDomain.getURL("img/posterimg")+data[i].poster, '" alt="', data[i].title, '">');
        this.text('     </a>');
        this.text('     <div class="action-info bd">');
        this.text('         <h3 class="action-name">');
        this.text('         <a href="action-info.html?actionid=',data[i].id,'">', data[i].title, '</a>');
        this.text('             <p class="action-people">(<span>', data[i].peopleNum, '</span>人已经参加)</p>');
        this.text('         </h3>');
        this.text('         <p class="action-desc">',data[i].summary,'</p>');
        this.text('         <p class="action-time">时间:<span class="date">', data[i].startDay, '</span>');
        this.text('             <span class="actiom-time">', data[i].time, '</span>');
        this.text('         </p>');
        this.text('         <address class="action-place">');
        this.text('             <div class="pl">地点:</div>');
        this.text('             <div class="aplace bd">', data[i].place, '</div>');
        this.text('         </address>');
        this.text('         <p class="action-fee">费用:<span>', data[i].avgFee, '</span>元</p>');
        this.text('         <p class="action-author">发起人:', data[i].sponsor, '</p>');
        this.text('     </div>');
        this.text('</li>');
    }
    if(data.length === 0){
        this.text('<div class="no-result">该类下还没有活动信息</div>');
    }
}
ResultList.prototype.loadActionListbyid = function(settings,key,page,time){
    var me = this;
    var defaults = {
        id: false,
        sid: false,
        page: false
    };
    var data = $.extend(defaults, settings);
    var typeElum = {
        id: {
            id: data.id,
            page:page,
            dayStr:time
        },
        sid: {
            sid: data.sid,
            page:page,
            dayStr:time
        }
    };
    if(time === "all"){
        delete typeElum['id'].dayStr;
        delete typeElum['sid'].dayStr;
    }
    $.ajax({
        type: "GET",
        url: eDomain.getURL("type/search"),
        dataType: "json",
        data:typeElum[key],
        cache:false,
        success: function(data) {
            if(!data.ret){
                $("#actionlist").html('<div class="no-result">请求有错误</div>')
                return false;
            }
            var totalpage = data.totalPage;
            $(me).trigger("loadresultlist", [data,totalpage,page]);
        },
        error: function(data) {
            
        }
    });
}
ResultList.prototype.loadActionListbyword = function(searchword,page) { 
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("actiontype/search"),
        dataType: "json",
        data: {
            keywords:encodeURI(searchword),
            page:page
        },
        cache:false,
        success: function(data) {
            if(!data.ret){
                $("#actionlist").html('<div class="no-result">请求有错误</div>')
                return false;
            }
            var totalpage = data.totalPage||1;
            $(me).trigger("loadresultlist", [data,totalpage,page]);
        },
        error: function(data) {
            
        }
    });
}
module.exports = ResultList;