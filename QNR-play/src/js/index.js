require("com/config");
require('com/jquery');
require('com/lib');
var rankuser = require('com/Rankuser');
var selectType = require('com/selectType');
var boardtype = require('./home/boardtype');
var ActionUI = require('./home/ActionUI');
var HotimgInfo = require('./home/HotimgInfo');
var singleAction = require('./home/single_actionUI');

var UserInfo = require('com/UserInfo');

var Catchtype;
var Catchuser;
var EventControl = {};

EventControl.bind = function() {
    $(hotimg).bind("changehotpic", function(e, elem) {
        hotimg.changestate(elem);
        hotimg.loadPicData(parseInt($(elem).text(), 10));
    });
    $(hotimg).bind("renderpic", function(e, data) {
        var renderimg = new HotimgInfo({
            elemId: "hotpic"
        });
        renderimg.clear();
        renderimg.updateSource(data);
        renderimg.render();
    });

    $(boardtype).bind("loadboard", function(e, data) {
        boardtype.updateSource(data);
        boardtype.render();
    });
    
    $(rankuser).bind("loaduser", function(e, data) {
         
        rankuser.updateSource(data);
        rankuser.render();
    });
    
    $(action).bind("loadAllaction", function(e, data) {
        action.updateSource(data);
        action.render();
        userinfo.loadData();
    });
    $(action).bind("loadtypelist", function(e, data) {
        action.loadData(data.data);
    });
    $(action).bind("overrender", function(e) {
        clickActiontype();
    });

    $(userinfo).bind("loaduser", function(e, data) {
        Catchuser = data.data.user;
        userinfo.clear();
        userinfo.updateSource(data);
        userinfo.render();
    });
    $(userinfo).bind("userlogin", function(e, data) {
        if (data.first) {
            selecttype.show();
            selecttype.loadData();
            selecttype.bindclick(data.user.id);
        }
    });

    $(selecttype).bind("loadselectlist", function(e, data) {
        selecttype.updateSource(data);
        selecttype.render();
    });

    $(saction).bind("changeaction", function(e, data, id) {
        var reloadac = new singleAction({
            elemId:"actionlist"+id
        });
        reloadac.updateSource(data.data);
        reloadac.render();
    });
}

var uicontrol = $(".ui-control");
var listtabs;

var action = new ActionUI({
    elemId: "actiontype"
});

var hotimg = new HotimgInfo();
var selecttype = new selectType({
    elemId: "selectItem"
});

var rankuser = new rankuser({
    elemId: "rankuser"
});

var boardtype = new boardtype({
    elemId: "board-type"
});

var userinfo = new UserInfo({
    elemId: "userinfo"
});

var saction = new singleAction();


var init = function() {
    EventControl.bind();
    loadEvent();
    bindEvent();
};

var loadboardtype = function() {
    $.ajax({
        type: "GET",
        url: eDomain.getURL("type/list"),
        dataType: "json",
        success: function(data) {
            Catchtype = data;
            $(action).trigger("loadtypelist", [data]);
            boardtype.loadData(data.data);
        },
        error: function(data) {

        }
    });
};

var loadEvent = function() {
    hotimg.loadPicData(1);
    loadboardtype();
    rankuser.loadData("user/rankuser/list");
};
var bindEvent = function() {
    clickActiontype();
    clickhotHandler();
    clickcreatebtn();
    prevhotclickHandler();
    nexthotclickHandler();
};
var prevhotclickHandler = function(){
    $(".btn-prev").click(function(e){
         ;
        var curnum = parseInt($(".active").text(),10) - 1;
        if(curnum === 0){
            return false;
        }
        var preElem = $(".ui-control a").eq(--curnum)[0];
        $(hotimg).trigger("changehotpic", [preElem]);
    });
}
var nexthotclickHandler = function(){
    $(".btn-next").click(function(e){
         ;
        var curnum = parseInt($(".active").text(),10) - 1;
        if(curnum === 3){
            return false;
        }
        var nextElem = $(".ui-control a").eq(++curnum)[0];
        $(hotimg).trigger("changehotpic", [nextElem]);
    });
}
var clickhotHandler = function() {
    uicontrol.delegate("a", "click", function(e) {
        $(hotimg).trigger("changehotpic", [e.target]);
        e.preventDefault();
    });
};
var clickcreatebtn = function(){
    $(".btn-text").click(function(e){
        if($(".backinfo").length === 0){
            alert("请先登录");
            $("#qsso-login").trigger("click");
            e.preventDefault();
        }
    });
}
var clickActiontype = function() {
    listtabs = $(".list-tabs");
    listtabs.delegate("a", "click", function(e) {
        var id = e.target.parentElement.id;
        saction.changestate(e.target);
        saction.loadSingleAction(id,e.target.id);
        e.preventDefault();
    });
}

init();