require("com/config");
require('com/jquery');
require('com/lib');
require('plugin/qdatepicker.js');
var UserInfo = require('com/UserInfo');
var Rankuser = require('com/Rankuser');
var ListType = require('list/ListType');
var Resultlist = require('list/ResultList');
var ListPage = require('list/listPage');
var idlist;
var $pagelist = $(".page-list");
var EventControl = {};

EventControl.bind = function() {
    $(userinfo).bind("loaduser", function(e, data) {
        userinfo.clear();
        userinfo.updateSource(data);
        userinfo.render();
    });

    $(rankuser).bind("loaduser", function(e, data) {
        rankuser.updateSource(data);
        rankuser.render();
    });

    $(listtype).bind("loadtypelist", function(e, data, id, sid) {
        data.itemid = id;
        data.itemsid = sid;
        listtype.updateSource(data);
        listtype.render();
    });
    $(listtype).bind("rendercompletelist", function(e) {
        timeClickHandler();
    });
    $(resultlist).bind("loadresultlist", function(e, data, page, currentpage) {
        resultlist.clear();
        resultlist.updateSource(data);
        resultlist.render();
        $(pagelist).trigger("loadlistpage", [page, currentpage]);
    });

    $(pagelist).bind("loadlistpage", function(e, page, currentpage) {
        var data = {
            totalpage: page,
            currentpage: currentpage
        };
        pagelist.clear();
        pagelist.updateSource(data);
        pagelist.render();
    });
    $(QDP).bind("datehide", function(e) {
        loadlistResult(idlist, 1, $("#mydate").val());
        $(".qunar-dp").hide();
        $(".selectdate").text($("#mydate").val());
    });
};


var rankuser = new Rankuser({
    elemId: "rankuser"
});

var userinfo = new UserInfo({
    elemId: "userinfo"
});

var listtype = new ListType({
    elemId: "nav-list"
});

var resultlist = new Resultlist({
    elemId: "actionlist"
});

var pagelist = new ListPage({
    elemId: "pagelist"
});

var getPage = function(data) {
    loadlistResult(data);
};
var loadlistResult;

var getSearchResult = function(data) {
    $(".tsearch-fields input").val(data[0]);
    $("#nav-list").html('<div class="searchkeyhint"><span class="hintkey">'+data[0]+'</span>相关的活动</div>');
    loadlistResult = function(data, page) {
        resultlist.loadActionListbyword(data[0], page);
    };
    var page = location.hash === "" ? 1 : location.hash.slice(1);
    loadlistResult(data, parseInt(page, 10));
};


var displaytypeListResult = function(data) {
    if (data.length === 1) {
        listtype.loadData(data[0], "none");
        loadlistResult = function(data, page, time) {
            resultlist.loadActionListbyid({
                id: data[0]
            }, "id", page, time);
        }
    } else {
        listtype.loadData(data[0], data[1]);
        loadlistResult = function(data, page, time) {
            resultlist.loadActionListbyid({
                sid: data[1]
            }, "sid", page, time);
        }
    }
    var page = location.hash === "" ? 1 : location.hash.slice(1);
    loadlistResult(data, parseInt(page, 10), "all");
};

var UrlType = {
    "id": displaytypeListResult,
    "searchword": getSearchResult
};

var Deptachrender = function(UrlKeyArray) {
    idlist = QNR.Tools.map(UrlKeyArray, function(elem) {
        return elem.value;
    });
    var key = UrlKeyArray[0] === undefined ? "searchword" :UrlKeyArray[0].key;
    UrlType[key](idlist);
};
var clickcreatebtn = function() {
    $(".btn-text").click(function(e) {
        if ($(".backinfo").length === 0) {
            alert("请先登录");
            $("#qsso-login").trigger("click");
            e.preventDefault();
        }
    });
}
var EventHandler = function() {
    dateHandler();
    listClickHandler();
    clickcreatebtn();
    timeClickHandler();
}
var dateHandler = function() {
    $("#mydate").qdatepicker({
        ui: 'qunar',
        forceCorrect: false
    });
    $("#mydate").show();
    $(".qunar-dp").hide();
}
var goTop = function() {
    $("html, body").animate({
        scrollTop: 0
    }, 110);
}
var listClickHandler = function() {
    $pagelist.delegate("a", "click", function(e) {
        var time = $(".type-nav__time .on a").data("val");
        loadlistResult(idlist, parseInt($(e.target).text(), 10), time);
        goTop();
    });
}
var timeClickHandler = function() {
    $(".site-main").css("overflow", "visible");
    $(".type-nav__time a").click(function(e) {
        $(".qunar-dp").hide();
        var a = $(this);
        if (a.hasClass("selectdate")) {
            $(".qunar-dp").show();
            $(".qunar-dp").css({
                top: '-33px',
                left: '360px'
            });
            QDP.ins.show();
        } else {
            var timeval = $.trim(a.data('val'));
            loadlistResult(idlist, 1, timeval);
        }
        a.closest(".type-nav__time").find("li").removeClass();
        a.closest('li').addClass('on');
        e.preventDefault();
    });
}
var init = function() {
    var UrlKeyArray = QNR.Tools.getUrlValue();
    Deptachrender(UrlKeyArray);
    EventControl.bind();
    loadEvent();
    EventHandler();
};
var loadEvent = function() {
    rankuser.loadData("user/rankuser/list");
    userinfo.loadData();
};
init();