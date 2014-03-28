require("com/config");
require('com/jquery');
require('com/lib');
require('plugin/jquery.json-2.4.min');
var MessagePage = require('com/Page.js');
var Userpage = require('com/Page.js');
var UserInfo = require('com/UserInfo');
var Hintlength = require('com/Hintlength');
var ActionInfo = require('action/ActionInfo');
var VoteScore = require('action/VoteScore');
var MessageList = require('action/MessageList');
var Actionuser = require('action/Actionuser');

var $pagelist = $(".page-list");
var $btnmessage = $(".btn-message");
var $textarea = $("textarea");
var $controlnum = $(".controlnum");
var $joinaction;
var $uservote = $("#uservote");

var hintlen;
var actionid;
var initpage;
var CatchData;
var CatchList;
var Catchuser;
var Catchuserinfo;
var Catchactionuser;
var EventControl = {};




EventControl.bind = function() {
    $(userinfo).bind("loaduser", function(e, data) {
        Catchuser = data.data.user;
        userinfo.clear();
        userinfo.updateSource(data);
        userinfo.render();
        judgelogin();
    });
    $(actionuser).bind("loadActionuser", function(e,data,page,currentpage) {
        Catchactionuser = data.data;
        actionuser.clear();
        actionuser.updateSource(data);
        actionuser.render();
        $(userlist).trigger("loadlistpage", [page, currentpage]);
    });
    $(actioninfo).bind("loadactioninfo", function(e, data) {
        CatchData = data;
        actioninfo.clear();
        actioninfo.updateSource(data);
        actioninfo.render();
        data.data.evaluateStatus = data.evaluateStatus;
        data.data.actionid = actionid;
        votebar.clear();
        votebar.updateSource(data.data);
        votebar.render();
    });
    $(votebar).bind("reloadvote", function(e, state) {
        var stateType = {
            3: "better",
            2: "good",
            1: "bad"
        };
        CatchData.data[stateType[state]]++;
        CatchData.data.evaluateStatus = state;
        votebar.clear();
        votebar.updateSource(CatchData.data);
        votebar.render();
    });
    $(actioninfo).bind("loadjoinaction", function(e, elem,dateflag,data) {
        $joinaction = $(elem);
        judgeisjoin(data,dateflag);
    });
    $(actioninfo).bind("reloadmember", function(e, elem) {
        actionuser.loadData(actionid,1);
        $(".action-people span").text($(".action-people").data("pnum")+1);
    });
    $(messagelist).bind("loadmessagelist", function(e, data, page, currentpage) {
        messagelist.clear();
        messagelist.updateSource(data);
        messagelist.render();
        $(".controlnum").hide();
        $(messagepage).trigger("loadlistpage", [page, currentpage]);

    });
    $(messagepage).bind("loadlistpage", function(e, page, currentpage) {
        var data = {
            totalpage: page,
            currentpage: currentpage
        };
        messagepage.clear();
        messagepage.updateSource(data);
        messagepage.render();
    });
    $(userlist).bind("loadlistpage",function(e,page,currentpage) {
        var data = {
            totalpage: page,
            currentpage: currentpage
        };
        userlist.clear();
        userlist.updateSource(data);
        userlist.render();
    });
}

var actionuser = new Actionuser({
    elemId: "actionuser"
});

var userinfo = new UserInfo({
    elemId: "userinfo"
});

var messagelist = new MessageList({
    elemId: "messagelist"
});
var actioninfo = new ActionInfo({
    elemId: "actioninfo"
});
var messagepage = new MessagePage({
    elemId: "pagelist"
});
var userlist = new Userpage({
    elemId: "userlistpage"
});

var votebar = new VoteScore({
    elemId: "uservote"
});


var init = function() {
    var UrlKeyArray = QNR.Tools.getUrlValue();
    actionid = UrlKeyArray[0] === undefined ? -999 :UrlKeyArray[0].value;
    initpage = location.hash === "" ? 1 : location.hash.slice(1);
    EventControl.bind();
    loadEvent();
    EventHandler();
}

var loadEvent = function() {
    actionuser.loadData(actionid,1);
    userinfo.loadData();
    actioninfo.loadData(actionid);
    messagelist.loadData(actionid, parseInt(initpage, 10));
};

var EventHandler = function() {
    MessagepageclickHandler();
    messagekeyup();
    clickcreatebtn();
    userpageclickHandler();
    messageclickHandler();
}

var clickcreatebtn = function() {
    $(".btn-text").click(function(e) {
        if ($(".backinfo").length === 0) {
            alert("请先登录");
            $("#qsso-login").trigger("click");
            e.preventDefault();
        }
    });
}
var MessagepageclickHandler = function() {
    $pagelist.delegate("a", "click", function(e) {
        messagelist.loadData(actionid, parseInt($(e.target).text(), 10));
    });
}
var userpageclickHandler = function(){
    $("#userlistpage").delegate("a","click",function(e){
        actionuser.loadData(actionid,parseInt($(e.target).text(), 10));
    });
}
var getEnternum = function(content) {
    var count = 0;
    content.replace(/\n/g, function(pos) {
        count++;
    });
    return count;
}
var convertContent = function(str) {
    return $textarea.val().replace(/\n/g, function(pos) {
        return pos = "<br>"
    });
}
var messagekeyup = function() {
    $textarea.keyup(function(e) {
        var content = this.value;
        var curlength = content.length;
        var Enternum = getEnternum(content);
        var maxsize = 200;
        var maxEnter = 4;
        hintlen = new Hintlength(e, $controlnum, curlength, maxsize, Enternum, maxEnter);
        hintlen.Execute();
    });
}
var judgelogin = function(){
    if ($(".backinfo").length === 0) {
        $textarea.prop("disabled", true);
        $btnmessage.hide();
        $(".write-comment").append('<div class="loginwarn">登录后，可留言</div>');
    }
}
var messageclickHandler = function() {
    $btnmessage.click(function(e) {
        var content = convertContent($textarea.val()).replace(/(^\s*)|(\s*$)/g, "");
         ;
        if (content === "") {
            alert("请输入具体内容");
            return false;
        }
        messagelist.postData(actionid, Catchuser.id, content);
        $textarea.val("");
        e.preventDefault();
    });

}
var changebtnstate = function() {
    $joinaction.removeClass("btn-action");
    $joinaction.addClass("suc-action");
    $joinaction.find("a").text("报名成功");
}
var isoverAction = function() {
    var curdate = new Date();
    return curdate.getTime() > new Date($(".date").data("endtime").replace(/-/g,"/")).getTime();
}


var judgeisjoin = function(data,dateflag) {
    if (data.evaluateStatus !== undefined) {
        if (dateflag !== 1) { //报名了且活动没有过期
            changebtnstate();
        }
        $joinaction.click(function(e) {
            e.preventDefault();
        });
        if (isoverAction()) {
            $joinaction.find("a").text("活动结束");
            $joinaction.css("background","rgb(151, 146, 140)");
            $(".user-vote").show();
        }
    } else if (dateflag === 0) { //没报名，活动没有过期
        $joinaction.click(function(e) {
            if ($(".backinfo").length === 0) {
                alert("请先登录");6
                +
                e.preventDefault();
                return false;
            }
            if($joinaction.hasClass("suc-action")){
                return false;
            }
            actioninfo.postData(actionid, Catchuser.id);
            changebtnstate();
            e.preventDefault();
        });
    }
    if (isoverAction()) {
        $joinaction.find("a").text("活动结束");
    }
    $joinaction.show();
}

init();