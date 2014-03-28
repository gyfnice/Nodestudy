var $mask = $("#mask");
var $type = $(".select-type");

function selectType() {
    selectType.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(selectType, XControl);
selectType.prototype.update = function(data) {
    this.insertContent(data);
}
selectType.prototype.insertBody = function(data) {
    for (var i = 0, max = data.length; i < max; i++) {
        this.text('<li class="select-item1">');
        this.text('    <h4>',data[i].name,'类</h4>');
        this.text('    <div>');
        this.text('        <form class="ac-custom ac-checkbox ac-checkmark" autocomplete="off">');
        this.text('            <ul>');
        this.insertlist(data);
        this.text('            </ul>');
        this.text('        </form>');
        this.text('    </div>');
        this.text('</li>');
    }
}
selectType.prototype.insertlist = function(data) {
    for (var i = 0, max = data.length; i < max; i++) {
        this.text('                 <li>');
        this.text('                      <input id="',data[i].id,'" name="',data[i].name,'" type="checkbox">');
        this.text('                      <label for="',data[i].id,'">nice</label>');
        this.text('                 </li>');
    }
}
selectType.prototype.show = function(){
    $(this).trigger("getlist");
    $mask.height($("body").height());
    $mask.show();
    $type.show();
}
selectType.prototype.hide = function(){
    $mask.hide();
    $type.hide();
}
selectType.prototype.bindclick = function(){
    $type.delegate(".select-close, .btn-ok, .btn-cancel","click",function(e){
         ;
    });
}
module.exports = selectType;