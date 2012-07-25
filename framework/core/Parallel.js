core.Parallel=Rokkstar.createClass('core.Parallel','core.Sequence',function(){
    this.createTween=function(){
        this.tween=new Parallel();
        var scope=this;
        var a={};
        a.onMotionFinished=function(){
            scope.triggerEvent('animationEnded');
        }
        a.onMotionStarted=function(){
            scope.triggerEvent('animationStarted');
        }
        this.tween.addListener(a);
    }
});