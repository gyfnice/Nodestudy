require("com/config");
require('com/jquery');
require('com/lib');
require('com/Hintlength');
require('plugin/jquery.json-2.4.min');
require('plugin/qdatepicker.js');
require('plugin/picker.js');
require('plugin/picker.time.js');
require('plugin/legacy');
require('plugin/ajaxfileupload');
require('plugin/jquery.Jcrop');
require('plugin/check.js');
var UserInfo = require('com/UserInfo');
var Hintlength = require('com/Hintlength');
var StepNextTab = require('create/StepNextTab');
var FinalStep = require('create/FinalStep');

var CatchactionInfo;
var Catchuser;
var Catchtypelist;
var CatchActionuser;
var imgName;

var filechangeflag = 0;
var sucessflag = 0;
var flagpic = 0;
var cutpicflag = 0;
var savepicflag = 0;
var backeditflag = 0;

var $plist = $("#plist");
var $typesel = $('.typesel');
var $subtype = $('.subtype');
var $pselect = $('#pselect');
var $subselect = $('#subselect');
var $sublist = $('#sublist');
var $feepr = $('#feepr');
var $free = $('#free');
var $avgFee = $('.avgFee');
var $inprice = $('.input__fee');
var $titletext = $('.titletext');
var $addresstext = $('.addresstext');
var $judgeinput = $('.addresstext,.titletext');

var $piccancel = $("#piccancel");
var $submit = $("#submit");
var $piclay = $(".uploadpic");
var $mask = $('#mask');
var $fail = $('.fail');
var $success = $(".success");

var $picturefile = $("#picturefile");
var $mydate = $('#mydate');
var $enddate = $('#enddate');
var $textarea = $('textarea');
var $controlnum = $('.controlnum');

var $addressspace = $('.addressspace');
var $addresssizewarn = $('.addresssizewarn');
var $addressnull = $('.addressnull');

var $titlespace = $('.titlespace');
var $titlesizewarn = $('.titlesizewarn');
var $titlenull = $('.titlenull');

var $activitydetail = $('#activitydetail');

var $textareawarn = $(".textwarn");
var $pricewarn = $(".pricewarn");
var $timewarn = $('.timewarn');
var $datewarn = $('.datewarn');
var $timestart = $('#time-start');
var $timeend = $('#time-end');

var $nextbtn = $('.activity__next');

var EventControl = {};

EventControl.bind = function() {
    $(userinfo).bind("loaduser", function(e, data) {
        Catchuser = data.data;
        userinfo.clear();
        userinfo.updateSource(data);
        userinfo.render();
        if ($(".backinfo").length === 0) {
            $("#qsso-login").trigger("click");
            e.preventDefault();
        }
    });
    $(cutimgtab).bind("uploadpic", function(e) {
        $(".photo__up").click(function(e) {
            $picturefile.trigger("click");
            if(filechangeflag === 1){
                showloadpic();
            }
        });
        $(".activity__pub").one("click",function(e){
             ;
            $(this).text("正在提交...");
            if(savepicflag === 1){
                ajaxpicload();
            }else{
                postaction();
            }
        });
    });
    $(QDP).bind("datehide", function(e) {
        var startime = new Date($mydate.val()).getTime();
        var endtime = new Date($enddate.val()).getTime();
        if(endtime < startime){
            QDP.ins.select(new Date($mydate.val()));
        }

    });
    $(finalstep).bind("actionsuccess",function(e){
        $(".activity__release").click(function(e){
            window.location.href = "./index.html"
        });
        $(".activity__goon").click(function(e){
            window.location.reload();
        });
    });

}

var postaction = function(){
    
     $.ajax({
        type: "POST",
        url: eDomain.getURL("actiontype/addaction"),
        dataType: "json",
        data: $.toJSON(CatchactionInfo),
        contentType: "application/json",
        success: function(data) {
            if(!data.ret){
                alert(data.errmsg);
                return false;
            }
            finalstep.updateSource();
            finalstep.render();
        },
        error: function(data) {

        }
    });
};
var userinfo = new UserInfo({
    elemId: "userinfo"
});

var cutimgtab = new StepNextTab({
    elemId: "createpic"
});

var finalstep = new FinalStep({
    elemId:"createpic"
});

var loadtypelist = function() {
    $.ajax({
        type: "GET",
        url: eDomain.getURL("type/list"),
        dataType: "json",
        success: function(data) {
            Catchtypelist = data.data;
            var datalist = [];
            var optionlist = [];
            var str;
            var option;
            for (var i = 0, max = Catchtypelist.length; i < max; i++) {
                str = "<li class ='" + Catchtypelist[i].id + "'>" + Catchtypelist[i].name + "</li>";
                option = "<option value ='" + Catchtypelist[i].id + "'>" + Catchtypelist[i].name + "</option>";
                datalist.push(str);
                optionlist.push(option);
            }
            $typesel.find(".selectbox_input").text(Catchtypelist[0].name);
            $subtype.find(".selectbox_input").text(Catchtypelist[0].child[0].subName);
            loadsubtypelist(Catchtypelist[0].id);
            $plist.html(datalist.join(""));
            $pselect.html(optionlist.join(""));
        },
        error: function(data) {

        }
    });
};
var showloadpic = function(){
    goTop();
    $mask.show();
    $(".uploadpic").slideDown();
}
var cancelpic = function() {
    $mask.hide();
    $piclay.slideUp();
}
var displaypic = function() {
    $(".photo-position img").prop("src",$('#crop_preview').prop("src"));
}
var savepic = function() {
    if(cutpicflag === 0){
        showPreview({x:0,y:0,w:200/flagpic,h:300/flagpic});
    }
    displaypic();
    cancelpic();
    savepicflag = 1;
    cutpicflag = 0;
}
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
            picType:"poster"
        },
        success: function(data) {
            imgName = JSON.parse($(data.getElementsByTagName("pre")[0]).text()).data;
            CatchactionInfo.poster = imgName;
            postaction();
        },
        error: function() {
            alert("error");
        }
    });
}
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
            if (w > 1584 || h > 1268) {
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
        aspectRatio: 200 / 300
        //minSize :[200,200] 
    });
    //简单的事件处理程序，响应自onChange,onSelect事件，按照上面的Jcrop调用
}
function showPreview(coords) {
        cutpicflag = 1;
        if (parseInt(coords.w) > 0) {
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
            $(".photo-position img").css({
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
var getEnternum = function(content) {
    var count = 0;
    content.replace(/\n/g, function(pos) {
        count++;
    });
    return count;
}
var actionInfokeyup = function() {
    $textarea.keyup(function(e) {
        sucessflag = 0;
        $textareawarn.hide();
        var content = this.value;
        var curlength = content.length;
        var Enternum = getEnternum(content);
        var maxsize = 2500;
        var maxEnter = 30;
        hintlen = new Hintlength(e, $controlnum, curlength, maxsize, Enternum, maxEnter);
        hintlen.Execute();
    });
}


var clickplist = function() {
    $typesel.click(function(e) {
        $sublist.hide();
        $plist.toggle();
        clickItemlist();
    });

};
var clicksublist = function() {
    $subtype.click(function(e) {
        $plist.hide();
        $sublist.toggle();
        clicksubItemlist();
    });
}
var clicksubItemlist = function() {
    $sublist.delegate("li", "click", function(e) {
        $subtype.find(".selectbox_input").text($(e.target).text());
        var typeid = $(e.target).prop("class");
        $subselect.val(typeid);
        $sublist.hide();
    });
}
var clickItemlist = function() {
    $plist.delegate("li", "click", function(e) {
        $typesel.find(".selectbox_input").text($(e.target).text());
        var typeid = $(e.target).prop("class");
        var childlist = QNR.Tools.filter(Catchtypelist, function(elem) {
            return elem.id === parseInt(typeid, 10);
        })[0].child;
        $subtype.find(".selectbox_input").text(childlist[0].subName);
        $pselect.val(typeid);
        loadsubtypelist(typeid);
        $plist.hide();
    });
};
var loadsubtypelist = function(id) {
    var childlist = QNR.Tools.filter(Catchtypelist, function(elem) {
        return elem.id === parseInt(id, 10);
    })[0].child;
    var datalist = [];
    var optionlist = [];
    var str;
    var option;
    for (var i = 0, max = childlist.length; i < max; i++) {
        str = "<li class ='" + childlist[i].id + "'>" + childlist[i].subName + "</li>";
        option = "<option value ='" + childlist[i].id + "'>" + childlist[i].subName + "</option>";
        datalist.push(str);
        optionlist.push(option);
        $sublist.html(datalist.join(""));
        $subselect.html(optionlist.join(""));
    }
};

var feechecked = function() {
    $feepr.click(function(e) {
        $avgFee.show();
    });
    $free.click(function(e) {
        $avgFee.hide();
    });
}
var switchcase = function(e, address, title) {
    if (e.target.className === "addresstext") {
        address.show();
    } else {
        title.show();
    }
}
var forbidden = function() {
    var maxfontsize = 50;
    $judgeinput.keyup(function(e) {
        if (this.value.length > maxfontsize) {
            this.value = this.value.substring(0, maxfontsize);
            switchcase(e, $addresssizewarn, $titlesizewarn);
            sucessflag = 1;
        } else {
            $addresssizewarn.hide();
            $titlesizewarn.hide();
            sucessflag = 0;
        }
        $titlenull.hide();
        $addressnull.hide();
        $addressspace.hide();
        $titlespace.hide();
    });
    $judgeinput.focusout(function() {
        $addressspace.hide();
        $titlespace.hide();
    });
};
var isoverAction = function(timestr) {
    var curdate = new Date();
    return curdate.getTime(timestr) > new Date(timestr).getTime();
}
var timechecked = function() {
    var starttime = $("#mydate").val()+" "+$("#time-start").val();
    if(isoverAction(starttime)){
        alert("活动开始时间不能早于当前时间");
        sucessflag = 1;
        return false;
    }
    if ($timestart.val() === "" || $("#time-end").val() === "") {
        $timewarn.show();
        sucessflag = 1;
    } else {
        sucessflag = 0;
    }

    
};
var convertContent = function(str) {
    return $textarea.val().replace(/\n|&lt;br&gt;/g, function(pos) {
        return pos = "<br>"
    });
}
var getactionData = function() {
    var price = $inprice.val() === "" ? 0 : $inprice.val();
    var actionObj = {};
    actionObj.classifyId = $pselect.val(),
    actionObj.subClaId = $subselect.val(),
    actionObj.title = $titletext.val(),
    actionObj.startDay = $mydate.val(),
    actionObj.endDay = $enddate.val(),
    actionObj.startHHMM = $timestart.val(),
    actionObj.endHHMM = $("#time-end").val(),
    actionObj.place = $addresstext.val(),
    actionObj.avgFee = $free.prop("checked") ? 0 : $inprice.val(),
    actionObj.description = convertContent($textarea.val()).replace(/(^\s*)|(\s*$)/g, "");
    return actionObj;
};
var Nextclick = function() {
    $nextbtn.click(function(e) {
        timechecked();

        if ($.trim($titletext.val()) === "") {
            $titlenull.show();
            sucessflag = 1;
        }
        if($.trim($textarea.val()) === ""){
            $textareawarn.show();
            sucessflag = 1;
        }
        if ($.trim($addresstext.val()) === "") {
            $addressnull.show();
            sucessflag = 1;
        }
        if($titletext.val().length > 50){
            $titlesizewarn.show();
            sucessflag = 1;
        }
        if (!$free.prop("checked") && /[^0-9]+/.test($inprice.val())) {
            $pricewarn.show();
            sucessflag = 1;
        } else if (!$free.prop("checked") && !$inprice.val()) {
            $pricewarn.show();
            sucessflag = 1;
        }
        if (sucessflag === 1) {
            failExecite();
            return false;
        }
        CatchactionInfo = getactionData();
        $success.fadeIn("slow");
        $success.fadeOut("slow", function(e) {
            goTop();
            $("#mainwrap").hide();
            CatchactionInfo.poster = CatchactionInfo.classifyId + ".jpg";
            if(backeditflag === 0){
                cutimgtab.clear();
                cutimgtab.updateSource(CatchactionInfo);
                cutimgtab.render();
                backeditflag = 1;
            }else{
                $("#createpic").show();
            }
        });
    });
}
var goTop = function() {
    $("html,body").animate({
                scrollTop: 0
    }, "fast");
}
var judgeprice = function() {
    $free.click(function(e) {
        $pricewarn.hide();
        sucessflag = 0;
    });
    $inprice.keyup(function(e) {
        if (!/[^0-9]+/.test(this.value)) {
            $pricewarn.hide();
            sucessflag = 0;
        }
        if(this.value.length > 4){
            this.value = this.value.substring(0,4);
        }
    });
};
var init = function() {
    $("input[type='radio']").iCheck();
    EventControl.bind();
    loadEvent();
    EventHandler();
    initplugin();

};
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
    $mask.click(cancelpic);
    $submit.click(savepic);
    $piccancel.click(cancelpic);
}
var bodyclick = function(){
    $("body").click(function(e) {
        if (!$(e.target).closest(".activity__classification").length) {
            $plist.hide();
            $sublist.hide();
        }
        if ($timestart.val() !== "" || $("#time-end").val() !== "") {
            $timewarn.hide();
            $datewarn.hide();
        }
    });
}
var EventHandler = function() {
    clickplist();
    clicksublist();
    bodyclick();
    feechecked();
    forbidden();
    actionInfokeyup();
    Nextclick();
    judgeprice();
    inputfile();
};
var failExecite = function() {
    $fail.fadeIn("slow");
    $fail.fadeOut("slow");
}
var initplugin = function() {
    var mintime = [];
    var curdate = new Date();
    mintime.push(curdate.getHours());
    var minsec = curdate.getMinutes() < 30 ? "00":"30";
    mintime.push(minsec);
    $timestart.pickatime({
        min: mintime,
        max: [23,30],
        format: "HH:i",
        clear: ''
    });
    $timestart.change(function(e) {
        $('#time-end').remove();
        $(".endtime").append('<input type="text" id="time-end"/>');
        var startmin = $timestart.val().match(/\d+/g);
        var startime = new Date($mydate.val()).getTime();
        var endtime = new Date($enddate.val()).getTime();
        if (startime !== endtime) {
            $('#time-end').pickatime({
                min: startmin,
                max: [23, 30],
                format: "HH:i",
                clear: ''
            });
        } else {
            $('#time-end').pickatime({
                disable: [
                    startmin
                ],
                min: startmin,
                max: [23, 30],
                format: "HH:i",
                clear: ''
            });
        }
        $('#time-end').change(function(e) {
            $timewarn.hide();
        });
    });
    var yesterday = function(data){
        var d = new Date(data - 24 * 60 * 60 * 1000);
        return d;
    };
    var currentdate = new Date();
    var yesdate = yesterday(currentdate.getTime());
    $mydate.qdatepicker({
        ui: 'qunar',
        forceCorrect: false,
        minDate:yesdate
    });
    $enddate.qdatepicker({
        ui:'qunar',
        forceCorrect:false,
        minDate:yesdate
    });
    $mydate.focusin(function(e){
        $enddate.closest(".qunar-dp").css('visibility', 'hidden');
    }).focusout(function(e){
        $enddate.closest(".qunar-dp").css('visibility', 'visible');
    });
}
var loadEvent = function() {
    userinfo.loadData();
    loadtypelist();
};

init();