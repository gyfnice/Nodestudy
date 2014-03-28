function FinalStep() {
    FinalStep.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(FinalStep, XControl);
FinalStep.prototype.update = function(data) {
    this.insertContent();
     this.onInit(function(e){
        $(this).trigger("actionsuccess");
    });
}
FinalStep.prototype.insertContent = function() {
    this.text('<span class="create__head">创建活动</span >');
    this.text('<div class = "create__state" > ');
    this.text('    <ul class = "state__step" > ');
    this.text('        <li class = "createstate__done" > ');
    this.text('            <b > </b>填写活动信息</li > ');
    this.text('        <li class = "createstate__done" > ');
    this.text('            <b > </b>上传活动海报');
    this.text('        </li > ');
    this.text('         <li class = "createstate__done" > ');
    this.text('         <b > </b>提交活动</li > ');
    this.text('    </ul>');
    this.text('</div > ');
    this.text('<div class = "create__activity" > ');
    this.text('    <div class = "activity-check" > ');
    this.text('        <p class = "check-state" > 活动已经提交，审核中...... </p>');
    this.text('        <p class="check-tips">Qunar玩管理员会在2个工作日内审核活动内容，并将审核结果通过邮件发给你</p > ');
    this.text('    </div>');
    this.text('</div > ');
    this.text('<div class = "create__op" > ');
    this.text('<div class = "create__op-in" > ');
    this.text('<div id = "" class = "activity__release" > 返回首页 </div>');
    this.text('<div id="" class="activity__goon">');
    this.text('     <a href="#">+继续创建活动</a > ');
    this.text('</div>');
}
module.exports = FinalStep;