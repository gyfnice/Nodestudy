function Hintlength(event, controlelem, clen, maxsize, enternum,maxEnter) {
    this.currentlength = clen;
    this.maxsize = maxsize;
    this.$controlelem = controlelem;
    this.event = event;
    this.enternum = enternum;
    this.maxEnter = maxEnter;
}
Hintlength.prototype.display = function() {
    this.$controlelem.removeClass("warntext");
    this.$controlelem.show();
    this.$controlelem.text(this.currentlength + "/" + this.maxsize);
}
Hintlength.prototype.hide = function() {
    this.$controlelem.hide();
}
Hintlength.prototype.manyEnter = function() {
    this.preventEnter();
    this.hintText("最多"+this.maxEnter+"行");
    this.highlight();
}
Hintlength.prototype.stop = function() {
    this.preventText();
    this.hintText("文本过长");
    this.highlight();
}
Hintlength.prototype.hintText = function(text) {
    this.$controlelem.text(text);
}
Hintlength.prototype.highlight = function() {
    this.$controlelem.addClass("warntext");
}
Hintlength.prototype.preventText = function() {
     this.event.target.value = this.event.target.value.substring(0, this.maxsize);
}
Hintlength.prototype.preventEnter = function() {
    var count = 0;
    var me = this;
    var str = this.event.target.value.replace(/\r\n|\r|\n/g,function(pos){
        count++;
        if(count < me.maxEnter){
            return pos;
        }else{
            return pos="\\~~~";
        }
    });
    this.event.target.value = str.replace(/\\~~~/g,'');
}
Hintlength.prototype.Execute = function() {
    if (this.currentlength === 0) {
        this.hide();
    } else if (this.currentlength > this.maxsize) {
        this.stop();
    } else if (this.enternum >= this.maxEnter) {
        this.manyEnter();
    } else {
        this.display();
    }
}

module.exports = Hintlength;