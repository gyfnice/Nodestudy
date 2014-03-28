function Rankuser() {
    Rankuser.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(Rankuser, XControl);
Rankuser.prototype.update = function(data) {
    this.insertBody(data);
}

Rankuser.prototype.insertBody = function(data) {
    for (var i = 0, max = data.length; i < max; i++) {
        this.text('<li class="user-items">');
        this.text('   <a href="', data[i].id, '" class="user-img">');
        this.text('      <img src="', data[i].headimg, '" alt="', data[i].username, '">');
        this.text('   </a>');
        this.text('   <div class="single-info">');
        this.text('     <h3 class="user-name">', data[i].username, '</h3>');
        this.text('     <p class="user-score"><span>积分:</span><span class="uscore">', data[i].total_score, '</span></p>');
        this.text('   </div>');
        this.text('</li>');
    }
}
Rankuser.prototype.loadData = function(data){
    $(this).trigger("loaduser",[data]);
}


module.exports = Rankuser;