var ActionUI = require('./ActionUI');

function single_actionUI() {
    single_actionUI.superclass.constructor.apply(this, arguments);
}
$jex.extendClass(single_actionUI, ActionUI);
single_actionUI.prototype.update = function(data) {
    
    this.singleAction(data);
};
single_actionUI.prototype.changestate = function(elem) {
    $(elem).addClass("on");
    $(elem).siblings().removeClass("on");
}
single_actionUI.prototype.loadSingleAction = function(id, sid) {
    var me = this;
    var aurl,Pdata;
    if(sid === "hot"){
        Pdata = {
           claId:id 
        }
        aurl = eDomain.getURL("actiontype/list");
    }else{
        Pdata = {
            subClaId:sid
        }
        aurl = eDomain.getURL("actiontype/slist");
    }
    $.ajax({
        type: "GET",
        url: aurl,
        dataType: "json",
        cache:false,
        data:Pdata,
        success: function(data) {
            if(!data.ret){
                alert(data.errmsg);
                return false;
            }
            $(me).trigger("changeaction", [data, id]);
        },
        error: function(data) {
            
        }
    });
}
module.exports = single_actionUI;