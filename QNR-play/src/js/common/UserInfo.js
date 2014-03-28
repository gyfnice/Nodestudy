function UserInfo() {
    UserInfo.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(UserInfo, XControl);
var superflag = 0;

var searchHandler = function(){
    var $search = $(".hsearch");
    $search.find(".tsearch-submit").off("click").on("click",function(e){
        var $searchinput = $search.find("input");
        if($.trim($searchinput.val()) === ""){
            alert("请输入搜索的关键字");
            $searchinput.focus();
            e.preventDefault();
        }
        $searchinput.val($.trim($searchinput.val()));
    });
}

UserInfo.prototype.update = function(data) {
    superflag = 0;
    if(data.data.isLogin){
    this.text('<a href="userinfo.html?userid=',data.data.user.id,'">',data.data.user.userName,'</a>');
    this.text('<a href="#" class="backinfo">登出</a>');
    this.text('<a href="#" id = "qsso-login" style="display:none">登录</a>');
    this.text('<a href="userinfo.html?userid=',data.data.user.id,'" class= "line">个人中心</a>');
    if(data.data.user.role === "SUPERMANAGER"||data.data.user.role === "MANAGER"){
        superflag = 1;
        this.text('<a style="color: rgb(253, 99, 13);font-weight: bold;" href="../admin/index.do">后台管理(有<span style="color: rgb(255, 247, 64);" class="check_num">',data.examnum,'</span>条活动待审核)</a>');
    }
    $(this).trigger("userlogin",[data.data]);
    }else{
        this.text('<a href="#" id = "qsso-login">登录</a>');
    }
    this.onInit(function(){
        var currpage = location.href;
        QSSO.attach('qsso-login','user/QSSOCallBack.do?currpage='+currpage);
        var me = this;
        $(".backinfo").click(function(e){
            me.exituser();
            e.preventDefault();
        });

        if(superflag === 1 && $(".check_num").text() === ""){
            this.getActionnum();
        }
        searchHandler();
    });
}
UserInfo.prototype.loadData = function(examnum){
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("user/list"),
        dataType: "json",
        cache : false,
        success: function(data) {
            if(!data.ret){
                alert("系统出错了~~");
                return false;
            }
            data.examnum = examnum;
            $(me).trigger("loaduser",[data]);
        },
        error: function(data) {
            
        }
    });
}
UserInfo.prototype.getActionnum = function(){
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("user/exam"),
        dataType: "json",
        cache:false,
        success: function(data) {
            if(!data.ret){
                alert("系统出错了~~");
                return false;
            }
            me.loadData(data.data);
        },
        error: function(data) {
            
        }
    });
}
UserInfo.prototype.exituser = function(){
    var me = this;
    $.ajax({
        type: "GET",
        url: eDomain.getURL("user/exit"),
        dataType: "json",
        success: function(data) {
            me.loadData();
        },
        error: function(data) {
            
        }
    });
}

module.exports = UserInfo;