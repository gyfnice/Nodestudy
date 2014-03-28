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
            search: '../../../QNR-play/data/actionlist.json',
            info: '../activity/detail.do'
        },
        type: {
            list: '../allClassifyData.do',
            mod: "type/mod.do",
            add: 'type/add.do',
            del: 'type/delete.do'
        },
        hotimg: {
            list: '../activity/hots.do'
        },
        user: {
            rankuser: {
                list: '../user/getStarUser.do'
            },
            actionuser: {
                list: '../userActivity/enrolledUser.do'
            },
            list: '../../../QNR-play/data/user.json'
        },
        usercenter: {
            baseinfo: '../../../QNR-play/data/baseinfo.json',
            publishaction: '../../../QNR-play/data/single-action.json',
            joinaction: '../../../QNR-play/data/single-action.json',
            proceedaction: '../../../QNR-play/data/single-action.json',
            followtype: '../../../QNR-play/data/followlist.json'
        },
        message: {
            list: '../comment/list.do',
            add: '../comment/add.do'
        }
        
    }
};