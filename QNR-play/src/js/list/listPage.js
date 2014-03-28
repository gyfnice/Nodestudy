var Page = require('com/Page.js');
function listPage() {
    listPage.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(listPage, Page);

module.exports = listPage;