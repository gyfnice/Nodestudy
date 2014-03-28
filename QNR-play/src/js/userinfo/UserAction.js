function UserAction() {
    UserAction.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(UserAction, XControl);
UserAction.prototype.update = function(data) {
    this.insertaction(data);
};
UserAction.prototype.loadData = function(url,uid,page) {
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL(url),
        dataType: "json",
        cache:false,
        data:{
            id:uid,
            page:page
        },
        success: function(data) {
            if(!data.ret){
                alert(data.errmsg);
                return false;
            }
            var totalpage = parseInt(data.pageNum,10);
            $(me).trigger("loaduseraction", [data,totalpage,page]);
        },
        error: function(data) {
            
        }
    });
};
UserAction.prototype.insertaction = function(data) {
    this.text('     <ul class="action-type">');
    for (var i = 0, max = data.length; i < max; i++) {
        this.text('         <li class="action-list bd">');
        this.text('             <a href="action-info.html?actionid=', data[i].id, '" class="action-img">');
        this.text('                 <img src="', eDomain.getURL("img/posterimg")+data[i].poster, '" alt="', data[i].title, '"></a>');
        this.text('             <div class="action-info bd">');
        this.text('                 <h3 class="action-name"><a href="action-info.html?actionid=', data[i].id, '">', data[i].title, '</a></h3>');
        this.text('                 <p class="action-time">');
        this.text('                     <span class="date">', data[i].startDay, '</span>');
        this.text('                 </p>');
        this.text('                 <p class="actiom-time">', data[i].startHHMM, ' - ',data[i].endHHMM,'</p>');
        this.text('                 <address class="action-place" title = "', data[i].place, '">', data[i].place, '</address>');
        this.text('                 <p class="action-people">', data[i].peopleNum, '人参加</p>');
        this.text('             </div>');
        this.text('           </li>');
    }
    if(data.length === 0){
        this.text('<div class="noaction">还没有信息</div>');
    }
    this.text('      </ul>');
};
module.exports = UserAction;