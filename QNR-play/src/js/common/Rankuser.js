function Rankuser() {
    Rankuser.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(Rankuser, XControl);
Rankuser.prototype.update = function(data) {
    this.insertBody(data.data);
}

Rankuser.prototype.insertBody = function(data) {
    if(data.length === 0){
        this.text('<li class="no-users">还没有成员</li>')
        return false;
    }
    for (var i = 0, max = data.length; i < max; i++) {
        this.text('<li class="user-items bd">');
        this.text('   <a href="userinfo.html?user=',data[i].id, '" class="user-img">');
        this.text('      <img src="', eDomain.getURL("img/headimg")+data[i].headImg, '" alt="', data[i].userName, '">');
        this.text('   </a>');
        this.text('   <div class="single-info bd">');
        this.text('     <h3 class="rankuser-name"><a href=userinfo.html?user=',data[i].id,'>', data[i].userName, '</a></h3>');
        this.text('     <p class="user-score"><span>积分:</span><span class="uscore">', data[i].totalScore, '</span></p>');
        this.text('   </div>');
        this.text('</li>');
    }
}

Rankuser.prototype.loadData = function(router,aid) {
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL(router),
        dataType: "json",
        cache:false,
        data:{
            id:aid
        },
        success: function(data) {
            if(!data.ret){
                alert(data.errmsg);
                return false;
            }
            $(me).trigger("loaduser",[data]);
        },
        error: function(data) {

        }
    });
};


module.exports = Rankuser;