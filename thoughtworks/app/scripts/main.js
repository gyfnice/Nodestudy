require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery'
    }
});

require(['common/lib', 'module/dialog'], function(Lib, dialog) {
    'use strict';
    var itemElem = Lib.$("items");
    var dialogElem = Lib.$("dialog");
    var closedialogElem = Lib.$("close");
    var addResourceElem = Lib.$("addbtn");


    dialog.init({
        dialogElem: dialogElem,
        close: closedialogElem,
        addbtn: addResourceElem
    });

    dialog.on("show", function(pagey, y, curentElem) {
        dialog.show(pagey, y, curentElem);
    });

    function init() {
        bindEvent();
    };

    function bindEvent() {
        addLinkHandler();
        closeTagHandler();
    };

    function addLinkHandler() {
        Lib.addEventListener(itemElem, "click", function(event) {
            event.preventDefault();
            if (event.target.className === 'item__addlink') {
                var pageY = event.target.offsetTop;
                var currentElem = event.target.parentElement.getElementsByTagName("ul")[0];
                dialog.emit("show", pageY, event.pageY, currentElem);
            }
        });
    };

    function closeTagHandler() {
        Lib.addEventListener(itemElem, "click", function(event) {
            event.preventDefault();
            if (event.target.className.slice(0, 5) === 'close') {
                removenode(event);
            }
        });
    };

    function removenode(event) {
        Lib.removenode(event.target.parentElement);
    };

    init();
});