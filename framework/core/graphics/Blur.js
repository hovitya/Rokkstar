core.graphics.Blur=Rokkstar.createClass('core.graphics.Blur','core.graphics.Filter',function(){

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('radiusPropertyChanged',this._triggerChange,this);
    }


    this._triggerChange=function(){
        this.triggerEvent('change');
    }

    this.apply=function(canvas){
        stackBlurImage( canvas, this.getRadius(), true );
    }
},[new Attr('radius',10,'integer')])