require("com/config");
require('com/jquery');
require('com/lib');
require('plugin/ajaxfileupload');
require('plugin/jquery.Jcrop');
var UserCenterPage = require('com/Page.js');
var UserInfo = require('com/UserInfo');
var selectType = require('com/selectType');
var UserbaseInfo = require('userinfo/UserbaseInfo');
var Followtype = require('userinfo/Followtype');
var UserAction = require('userinfo/UserAction');
var ProceedAction = require('userinfo/ProceedAction');
var userid;
var Catchuser;
var Catchfollowlist;

var filechangeflag = 0;
var flagpic = 0;
var cutpicflag = 0;

var preheadimg = eDomain.getURL("img/headimg");
var $joinpage = $('#joinpagelist');
var $pubpage = $('#pubpagelist');
var $uploadpic;
var $addbtntype;
var $closetype;
var $picturefile = $('#picturefile'); 
var $infolist = $(".info-list");
var EventControl = {};

EventControl.bind = function() {
    $(userinfo).bind("loaduser", function(e, data) {
        Catchuser = data.data;
        userinfo.clear();
        userinfo.updateSource(data);
        userinfo.render();
        followtype.loadData(userid);
    });

    $(followtype).bind("loadfollowlist", function(e, flist) {
        Catchfollowlist = flist.data;
        baseinfo.loadData(userid, flist.data);
    });
    $(followtype).bind("deletefollowlist", function(e, data, event) {
        followtype.loadData(userid);
    });

    $(baseinfo).bind("loaduserinfo", function(e, data) {
        baseinfo.clear();
        baseinfo.updateSource(data);
        baseinfo.render();
    });
    $(baseinfo).bind("completeinfo", function(e, uid) {
        if (Catchuser.isLogin) {
            if (Catchuser.user.id === uid) {
                getauthorityExec();
            }
        }
    });

    $(pubuseraction).bind("loaduseraction", function(e, data, page, currentpage) {
        pubuseraction.clear();
        pubuseraction.updateSource(data.data);
        pubuseraction.render();
        $(pubpagelist).trigger("loadlistpage", [page, currentpage]);
    });

    $(joinuseraction).bind("loaduseraction", function(e, data, page, currentpage) {
        joinuseraction.clear();
        joinuseraction.updateSource(data.data);
        joinuseraction.render();
        $(joinpagelist).trigger("loadlistpage", [page, currentpage]);
    });
    $(joinpagelist).bind("loadlistpage", function(e, page, currentpage) {
        var data = {
            totalpage: page,
            currentpage: currentpage
        };
        joinpagelist.clear();
        joinpagelist.updateSource(data);
        joinpagelist.render();
    });
    $(proceedaction).bind("loadproceedaction", function(e, data) {
        proceedaction.updateSource(data.data);
        proceedaction.render();
    });
    $(pubpagelist).bind("loadlistpage", function(e, page, currentpage) {
        var data = {
            totalpage: page,
            currentpage: currentpage
        };
        pubpagelist.clear();
        pubpagelist.updateSource(data);
        pubpagelist.render();
    });

    $(selecttype).bind("loadselectlist", function(e, data) {
        data.selectflist = Catchfollowlist;
        selecttype.clear();
        selecttype.updateSource(data);
        selecttype.render();
    });


};


var userinfo = new UserInfo({
    elemId: "userinfo"
});

var baseinfo = new UserbaseInfo({
    elemId: "baseinfo"
});

var pubuseraction = new UserAction({
    elemId: 'pubaction'
});
var pubpagelist = new UserCenterPage({
    elemId: "pubpagelist"
});
var joinuseraction = new UserAction({
    elemId: "joinaction"
});
var joinpagelist = new UserCenterPage({
    elemId: "joinpagelist"
});
var proceedaction = new ProceedAction({
    elemId: "proceedaction"
});
var selecttype = new selectType({
    elemId: "selectItem"
});
var followtype = new Followtype({
    elemId: "followlist"
});



var getauthorityExec = function() {
    $(".hidden").show();
    $("#picturefile").hide();
    $infolist.prepend('<a href="#" class="uploadpic hidden">修改头像</a>');
    $uploadpic = $(".uploadpic");
    $addbtntype = $("#addbtntype");
    $closetype = $(".closetype");
    infoImgmouseHandler();
    uploadpicmouseHandler();
    uploadpicClickHandler();
    clickaddtype();
    clickclosetype();
};

var clickclosetype = function() {
    $closetype.delegate("a", "click", function(e) {
        var subid = e.target.id;
        followtype.deletetype(userid, subid, e);
        e.preventDefault();
    });
};
var infoImgmouseHandler = function() {
    $(".info-img img").mouseenter(function(e) {
        $uploadpic.show();
    }).mouseleave(function(e) {
        $uploadpic.hide();
    });
};
var uploadpicmouseHandler = function() {
    $uploadpic.mouseenter(function(e) {
        $uploadpic.show();
    }).mouseleave(function(e) {
        $uploadpic.hide();
    });
};

var showloadpic = function(){
    $("#mask").show();
    $(".uploadpic-overlay").slideDown();
};
var cancelpic = function() {
    selecttype.hide();
    $(".uploadpic-overlay").slideUp();
};
var savepic = function() {
    if(cutpicflag === 0){
        showPreview({x:0,y:0,w:204/flagpic,h:204/flagpic});
    }
    ajaxpicload();
    cancelpic();
    
    $uploadpic.remove();
};
var ajaxpicload = function(){
    $.ajaxFileUpload({
        url: eDomain.getURL('actiontype/loadpic'),
        fileElementId: 'picturefile',
        data: {
            picx: $("#picx").val(),
            picy: $("#picy").val(),
            picw: $("#picw").val(),
            pich: $("#pich").val(),
            flagPic:flagpic,
            picType:"head"
        },
        success: function(data) {
            imgName = JSON.parse($(data.getElementsByTagName("pre")[0]).text()).data;
            $(".info-img img").prop("src",preheadimg+imgName);
            updateHead(imgName);
        },
        error: function() {
            alert("error");
        }
    });
};
var updateHead = function(imgname){
    $.ajax({
        type: "GET",
        url: eDomain.getURL('user/updatehead'),
        dataType: "json",
        data:{
            imgName:imgname
        },
        success: function(data) {
            if(!data.ret){
                alert("上传失败");
            }
        },
        error: function(data) {

        }
    });
};
var readImage = function(file) {

    var reader = new FileReader();
    var image = new Image();

    reader.readAsDataURL(file);
    reader.onload = function(_file) {
        image.src = _file.target.result;
        image.onload = function() {
            var w = this.width,
                h = this.height,
                t = file.type,
                n = file.name,
                s = ~~ (file.size / 1024) + 'KB';
            if (w > 1284 || h > 768) {
                alert("图片太大");
                return false;
            }
            $('#crop_preview').prop("src",'');
            $('#uploadPreview img').prop("src", this.src);
            $('#crop_preview').prop("src", this.src);
            flagpic = 1;
            if (w > 600) {
                $('#uploadPreview img').width(w / 2);
                $('#uploadPreview img').height(h / 2);
                flagpic = 2;
            }
            cutPicture();
        };
        image.onerror = function() {
            alert('Invalid file type: ' + file.type);
        };
    };
};

function cutPicture() {
    //记得放在jQuery(window).load(...)内调用，否则Jcrop无法正确初始化
    $("#img").Jcrop({
        onChange: showPreview,
        onSelect: showPreview,
        aspectRatio: 204 / 204
        //minSize :[200,200] 
    });
    //简单的事件处理程序，响应自onChange,onSelect事件，按照上面的Jcrop调用
}
function showPreview(coords) {
        cutpicflag = 1;
        if (parseInt(coords.w,10) > 0) {
            //计算预览区域图片缩放的比例，通过计算显示区域的宽度(与高度)与剪裁的宽度(与高度)之比得到
            var rx = $("#preview_box").width() / coords.w;
            var ry = $("#preview_box").height() / coords.h;
            //通过比例值控制图片的样式与显示
            $("#crop_preview").css({
                width: Math.round(rx * $("#img").width()) + "px", //预览图片宽度为计算比例值与原图片宽度的乘积
                height: Math.round(rx * $("#img").height()) + "px", //预览图片高度为计算比例值与原图片高度的乘积
                marginLeft: "-" + Math.round(rx * coords.x) + "px",
                marginTop: "-" + Math.round(ry * coords.y) + "px"
            });
            $("#picx").val(coords.x);
            $("#picy").val(coords.y);
            $("#picw").val(coords.w);
            $("#pich").val(coords.h);
        }
}
var uploadpicClickHandler = function() {
    $uploadpic.click(function(e) {
        $picturefile.trigger("click");
        if(filechangeflag === 1){
            showloadpic();
        }
    });
};

var pubpageclickHandler = function() {
    $pubpage.delegate("a", "click", function(e) {
        var page = parseInt($(e.target).text(), 10);
        pubuseraction.loadData("usercenter/publishaction", userid, page);
    });
};
var joinpageclickHandler = function() {
    $joinpage.delegate("a", "click", function(e) {
        var page = parseInt($(e.target).text(), 10);
        joinuseraction.loadData("usercenter/joinaction", userid, page);
    });
};

var clickaddtype = function() {
    $addbtntype.click(function(e) {
        selecttype.show();
        selecttype.loadData();
        selecttype.bindclick(userid, followtype);
    });
};
var clickEventHandler = function() {
    pubpageclickHandler();
    joinpageclickHandler();
    inputfile();
    clickcreatebtn();
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
var inputfile = function(){
    $picturefile.change(function(e) {
    cutpicflag = 0;
    $("#uploadPreview img").remove();
    $(".crop_preview img").remove();
    $("#uploadPreview").html('<img src="" id="img" name="picture">');
    $(".crop_preview").html('<img id="crop_preview" src="" />');
    if (this.disabled) return alert('File upload not supported!');
    if(!window.FileReader){
       return alert("亲你使用的浏览器w版本过低，请升级浏览器,否则使用默认图片"); 
    }
    filechangeflag = 1;
    showloadpic();
    var F = this.files;
    if (F && F[0])
        for (var i = 0; i < F.length; i++) readImage(F[i]);
    });
    $("#mask").click(cancelpic);
    $("#submit").click(savepic);
    $("#piccancel").click(cancelpic);
};
var init = function() {
    var UrlKeyArray = QNR.Tools.getUrlValue();
    userid = UrlKeyArray[0].value;
    EventControl.bind();
    loadEvent();
    clickEventHandler();
};

var loadEvent = function() {
    userinfo.loadData();
    var initpage = 1;
    pubuseraction.loadData("usercenter/publishaction", userid, initpage);
    joinuseraction.loadData("usercenter/joinaction", userid, initpage);
    proceedaction.loadData(userid);
};

init();