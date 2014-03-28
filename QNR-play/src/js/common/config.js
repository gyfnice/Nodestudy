window.eDomain={
    static: '',
    devMode: false,
    webroot: '',
    getURL: function(path) {
        var root = path.indexOf("/") === 0 ? "/" : this.webroot;
        path = path.replace(/^\//, "");
        if (this.devMode) {
            this.webroot = "/test/";
            var devPath = path.replace(/\//g, "");
            return this.webroot + devPath + ".json";
        }
        var onlinePath = path.replace(/\//g, ".");
        return root + eval("this.router." + onlinePath);
    },
    router: {
        actiontype: {
            list: '../activity/classfiyHots.do',
            slist: '../activity/subclassifyHots.do',
            search: '../activity/search.do',
            info: '../activity/detail.do',
            addactuser: '../activity/signUp.do',
            loadpic:'../fileupload/uploadImg.do',
            addaction:'../activity/add.do',
            voteup:'../activity/assess.do'
        },
        type: {
            list: '../classify/allClassifyData.do',
            mod: "type/mod.do",
            add: 'type/add.do',
            del: 'type/delete.do',
            search:'../activity/classify.do'
        },
        hotimg: {
            list: '../activity/hots.do'
        },
        user: {
            rankuser: {
                list: '../user/showStarUser.do'
            },
            actionuser: {
                list: '../userActivity/enrolledUser.do'
            },
            list: '../user/isLogin.do',
            exit: '../user/logout.do',
            updatehead:'../user/updateHeadImg.do',
            isjoin:'../userActivity/isUserEnroll.do',
            exam:'../activity/notExamine/count.do'
        },
        usercenter: {
            baseinfo: '../user/showUser.do',
            publishaction: '../activity/published.do',
            joinaction: '../userActivity/participated.do',
            proceedaction: '../userActivity/enrolled.do',
            followtype: '../userClassify/list.do',
            deletetype:'../userClassify/del.do',
            addtype:'../userClassify/add.do'
        },
        message: {
            list: '../comment/list.do',
            add: '../comment/add.do'
        },
        img:{
            /*headimg:'../resources/headimgs/',
            posterimg:'../resources/posterimgs/'*/
            headimg:'http://sources.corp.qunar.com/QNR-play/headimgs/',
            posterimg:'http://sources.corp.qunar.com/QNR-play/posterimgs/'
        }
    }
};