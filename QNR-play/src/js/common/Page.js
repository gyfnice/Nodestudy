var Maxpagelist = 7;

function Page() {
    Page.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(Page, XControl);
Page.prototype.update = function(page) {
    if (page.totalpage < Maxpagelist) {
        this.lessPage(page);
    } else {
        this.morePage(page);
    }

}
Page.prototype.lessPage = function(page) {
    if (page.totalpage !== 1) {
        for (var i = 1, max = page.totalpage; i <= max; i++) {
            this.fillCorrectPage(page, i);
        }
    }
}
Page.prototype.morePage = function(page) {
    if (page.currentpage < Maxpagelist - 2) {
        this.startPageStyle(page);
    } else if (page.currentpage > page.totalpage - 4) {
        this.endPageStyle(page);
    } else {
        this.middlePageStyle(page);
    }
}
Page.prototype.middlePageStyle = function(page) {
    var total = page.totalpage;
    var current = page.currentpage;
    var before = 2;
    var after = 3;
    var start = (current - before);
    var end = (current + after);
    for (var i = 1; i <= total; i++) {
        if (i == (before)) {
            i = start;
            this.insertDot();
        } else if (i == (current + after)) {
            i = (total - after + 3);
            this.insertDot();
        }
        this.fillCorrectPage(page, i);
    }
}
Page.prototype.endPageStyle = function(page) {
    this.insertHead();
    this.insertDot();
    var totalpage = page.totalpage;
    for (var i = totalpage - 4; i <= totalpage; i++) {
        this.fillCorrectPage(page, i);
    }
}
Page.prototype.startPageStyle = function(page) {
    for (var i = 1, max = Maxpagelist - 1; i < max; i++) {
        this.fillCorrectPage(page, i);
    }
    this.insertDot();
     
    this.insertfinalPage(page.totalpage);
}
Page.prototype.fillCorrectPage = function(page, i) {
    if (i === page.currentpage) {
        this.insertCurrentPage(i);
    } else {
        this.insertNormalPage(i);
    }
}
Page.prototype.insertHead = function() {
    this.text('<li>');
    this.text('    <a href="#1">1</a>');
    this.text('</li>');
}
Page.prototype.insertfinalPage = function(end) {
    this.text('<li>');
    this.text('    <a href="#', end, '">', end, '</a>');
    this.text('</li>');
}
Page.prototype.insertDot = function() {
    this.text('<li class="dot">');
    this.text('    <span>....</span>');
    this.text('</li>');
}
Page.prototype.insertCurrentPage = function(data) {
    this.text('<li class="page-on">');
    this.text('    <span href="#', data, '">', data, '</span>');
    this.text('</li>');
}
Page.prototype.insertNormalPage = function(data) {
    this.text('<li>');
    this.text('    <a href="#', data, '">', data, '</a>');
    this.text('</li>');
}

module.exports = Page;