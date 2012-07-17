core.graphics.ClosedGraphicsElement=Rokkstar.createClass('core.graphics.ClosedGraphicsElement','core.graphics.GraphicsElement',function(){
    this.init=function(){
        this.callSuper('init');
        this.createEventListener('fillPropertyChanged',this._fillChanged,this);
        this.createEventListener('strokePropertyChanged',this._strokeChanged,this);
        this.createEventListener('shadowPropertyChanged',this.invalidateDrawing,this);
        this.createEventListener('shadowBlurPropertyChanged',this.invalidateDrawing,this);
        this.createEventListener('shadowOffsetXPropertyChanged',this.invalidateDrawing,this);
        this.createEventListener('shadowOffsetYPropertyChanged',this.invalidateDrawing,this);
        this.createEventListener('shadowColorPropertyChanged',this.invalidateDrawing,this);
        this.createEventListener('shadowAlphaPropertyChanged',this.invalidateDrawing,this);
    }

    this.strokeInvalid=false;

    this._fillChanged=function(event){
        var currentFill=this.getFill();
        var prevFill=event.oldValue;
        if(prevFill!=null){
            prevFill.deleteEventListener('change',this._fillValueChanged,this);
        }
        if(currentFill!=null) currentFill.createEventListener('change',this._fillValueChanged,this);
        this.invalidateDrawing();
    }

    this._fillValueChanged=function(event){
        this.invalidateDrawing();
    }

    this._strokeChanged=function(event){
        var currentStroke=this.getStroke();
        var prevStroke=event.oldValue;
        if(prevStroke!=null){
            prevStroke.deleteEventListener('change',this._strokeValueChanged,this);
        }
        if(currentStroke!=null) currentStroke.createEventListener('change',this._strokeValueChanged,this);
        this.invalidateDrawing();
    }

    this._strokeValueChanged=function(event){
        this.invalidateDrawing();
    }

    this.draw=function(graphics,x,y,width,height){
        if(this.getFill()!=null){
            this.getFill().applyFill(graphics,x,y,width,height);
        }
        if(this.getStroke()!=null){
            this.getStroke().applyStroke(graphics,x,y,width,height);
        }
        if(this.getShadow()){
            var rgb=Rokkstar.hexToRgb(this.getShadowColor());
            graphics.shadowColor="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+this.getShadowAlpha().toString()+")";
            graphics.shadowBlur=this.getShadowBlur();
            graphics.shadowOffsetX=this.getShadowOffsetX();
            graphics.shadowOffsetY=this.getShadowOffsetY();
        }else{
            graphics.shadowColor="rgba(0,0,0,0.0)";
        }
        this.drawPath(graphics,x,y,width,height);
        if(this.getFill()!=null){
            this.getFill().callFill(graphics);
            //Turn off shadow if already drawn under fill
            graphics.shadowColor="rgba(0,0,0,0.0)";
        }
        if(this.getStroke()!=null) this.getStroke().callStroke(graphics);

    }

    this.drawPath=function(graphics){

    }


},[new Attr('fill',null),new Attr('stroke',null),new Attr('shadow',false,'boolean'),new Attr('shadowOffsetX',2,'integer'),new Attr('shadowOffsetY',2,'integer'),new Attr('shadowBlur',2.0,'float'),new Attr('shadowColor','#000000','string'),new Attr('shadowAlpha',0.5,'float')]);