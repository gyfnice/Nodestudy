function StepNextTab() {
    StepNextTab.superclass.constructor.apply(this, arguments);
}

$jex.extendClass(StepNextTab, XControl);
StepNextTab.prototype.update = function(data) {
    this.text('<span class="create__head">创建活动</span>');
    this.insertTabhead();
    this.insertContent(data);
    this.insertButton();
    this.onInit(function(e){
        $(this).trigger("uploadpic");
        $(".activity__back").click(function(e){
            $("#mainwrap").show();
            $("#createpic").hide();
        });
    });
}
StepNextTab.prototype.insertTabhead = function() {
    this.text('<div class="create__state">');
    this.text('     <ul class="state__step">');
    this.text('         <li class="createstate__done">');
    this.text('             <b></b>填写活动信息');
    this.text('         </li>');
    this.text('         <li class="createstate__doing">');
    this.text('             <b></b>上传活动海报');
    this.text('         </li>');
    this.text('         <li class="createstate__undo">');
    this.text('             <b></b>提交活动');
    this.text('         </li>');
    this.text('     </ul>');
    this.text('</div>');
}
StepNextTab.prototype.insertContent = function(data) {
    this.text('<div class="create__activity">');
    this.text('     <div class="activity__upphoto">');
    this.text('         <div class="photo-position">');
    this.text('             <img src="',eDomain.getURL("img/posterimg")+data.classifyId,'.jpg" alt="" width="200" height="300">');
    this.text('         </div>');
    this.text('         <div class="photo-introduction">');
    this.text('             <b>从电脑中选择你喜欢的照片</b>');
    this.text('             <p>仅支持JPG、GIF、PNG，且文件小于2M</p>');
    this.text('                 <div id="" class="photo__up">上传照片</div>');
    this.text('             <p>让你的活动更吸引人</p>');
    this.text('             <p>用一张图片代表你的活动，即使你没有专业的设计师</p>');
    this.text('             <p>随意拖拽或调整大图中的虚线区域，预览小图为裁切后的效果</p>');
    this.text('             <p>高宽比为3:2的图片会得到最完整的显示</p>');
    this.text('         </div>');
    this.text('     </div>');
    this.text('</div>');
}
StepNextTab.prototype.insertButton = function() {
    this.text('<div class="create__op">');
    this.text('     <div class="create__op-in">');
    this.text('         <div class="activity__pub">发布同城活动</div>');
    this.text('         <div class="activity__back">返回修改</div>');
    this.text('     </div>');
    this.text('</div>');
}
module.exports = StepNextTab;