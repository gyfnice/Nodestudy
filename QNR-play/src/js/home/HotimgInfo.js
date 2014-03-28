function HotimgInfo() {
   
    HotimgInfo.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(HotimgInfo, XControl);

var $atitle = $(".action-title");

function minText(text, len) {
    if(text.length > len){
        return text.substr(0, len) + "...";
    }
    return text;
}

HotimgInfo.prototype.update = function(data) {
    this.insertbody(data.data);
};
HotimgInfo.prototype.insertbody = function(data) {
    if(data.length === 0){
        this.text('<li class="no-hotact">没有更多热门活动了哦</li>')
    }
    for (var i = 0, max = data.length; i < max; i++) {
        this.text('<li>');
        this.text('    <div class="action-pic">');
        this.text('         <a href="action-info.html?actionid=', data[i].id, '">');
        this.text('             <img alt="', data[i].poster, '" src="', eDomain.getURL("img/posterimg")+data[i].poster, '" height="260" width="190">');
        this.text('         </a>');
        this.text('    </div>');
        this.text('    <div class="action-title">');
        this.text('         <a href="action-info.html?actionid=', data[i].id, '" title="', data[i].title, '">', minText(data[i].title,20), '</a>');
        this.text('    </div>');
        this.text('</li>');
    }
};

HotimgInfo.prototype.changestate = function(elem) {
    $(elem).addClass("active");
    $(elem).siblings().removeClass("active");
};
HotimgInfo.prototype.loadPicData = function(page) {
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("hotimg/list"),
        dataType: "json",
        cache:false,
        data:{
            pageNum:page
        },
        success: function(data) {
            if(!data.ret){
                alert(data.errmsg);
                return false;
            }
            $(me).trigger("renderpic", [data]);
        },
        error: function(data) {

        }
    });
};
module.exports = HotimgInfo;