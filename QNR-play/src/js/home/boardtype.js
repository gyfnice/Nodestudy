function boardtype() {
    boardtype.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(boardtype, XControl);
boardtype.prototype.update = function(data) {
    this.insertBody(data);
}
boardtype.prototype.insertBody = function(data) {
    for (var i = 0, max = data.length; i < max; i++) {
        if(i === max - 1){
            this.text('<li class="categories c-last">');
        }else{
            this.text('<li class="categories">');
        }
        this.text('   <h5>');
        this.text('       <a href="action-list.html?id=',data[i].id,'">',data[i].name, '»</a>');
        this.text('   </h5>');
        this.text('   <ul>');
        this.insertlist(data[i].child,data[i]);
        this.text('   </ul>');
        this.text('</li>');
    }
}
boardtype.prototype.insertlist = function(data,parent) {
    for (var i = 0, max = data.length; i < max; i++) {
        this.text('       <li>');
        this.text('           <a href="action-list.html?id=', parent.id, '&sid=',data[i].id,'">', data[i].subName, '</a>');
        this.text('       </li>');
    }
}
boardtype.prototype.loadData = function(data){
    $(this).trigger("loadboard",[data]);
}
module.exports = boardtype;