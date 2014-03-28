var Rankuser = require('com/Rankuser');
function Actionuser() {
    Actionuser.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(Actionuser, Rankuser);
Actionuser.prototype.loadData = function(actionid,page){
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("user/actionuser/list"),
        dataType: "json",
        cache:false,
        data:{
            id:actionid,
            page:page
        },
        success: function(data) {
            if(!data.ret){
                alert(data.errmsg);
                return false;
            }
            var totalpage = data.pageNum;
            $(me).trigger("loadActionuser",[data,totalpage,page]);
        },
        error: function(data) {

        }
    });
}
module.exports = Actionuser;