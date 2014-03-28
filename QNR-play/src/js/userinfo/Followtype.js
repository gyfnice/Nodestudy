function Followtype() {
    Followtype.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(Followtype, XControl);
Followtype.prototype.update = function(data) {
    for(var i = 0,max = data.length;i < max;i++){
            this.getfollowlist(data[i]); 
    }
    if(data.length === 0){
        this.text('<div class="notype">没有分组信息</div>')
    }
}
Followtype.prototype.getfollowlist = function(data){
        this.text('<li>');
        this.text('<span>',data.subName,'</span>');
        this.text('<div class="closetype hidden" ><a href="#" id="',data.id,'">x</a></div>');
        this.text('</li>');
}
Followtype.prototype.loadData = function(uid) {
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("usercenter/followtype"),
        dataType: "json",
        cache:false,
        data:{
            userId:uid
        },
        success: function(data) {
            if(!data.ret){
                alert(data.errmsg);
                return false;
            }
            $(me).trigger("loadfollowlist", [data]);
        },
        error: function(data) {

        }
    });
}
Followtype.prototype.deletetype = function(userid,subid,event){
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("usercenter/deletetype"),
        dataType: "json",
        cache:false,
        data:{
            userId:userid,
            subClaId:subid
        },
        success: function(data) {
            $(me).trigger("deletefollowlist",[data,event]);
        },
        error: function(data) {
            
        }
    });
}


module.exports = Followtype;
