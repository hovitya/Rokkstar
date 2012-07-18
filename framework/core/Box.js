core.Box=Rokkstar.createClass('core.Box','core.VisualComponent',function(){
    this.init=function(){
        this.callSuper('init');

        //Shadow listeners
        this.createEventListener('shadowPropertyChanged',this.invalidateShadow,this);
        this.createEventListener('shadowOffsetXPropertyChanged',this.invalidateShadow,this);
        this.createEventListener('shadowOffsetYPropertyChanged',this.invalidateShadow,this);
        this.createEventListener('shadowSpreadPropertyChanged',this.invalidateShadow,this);
        this.createEventListener('shadowInsetPropertyChanged',this.invalidateShadow,this);
        this.createEventListener('shadowAlphaPropertyChanged',this.invalidateShadow,this);
        this.createEventListener('shadowColorPropertyChanged',this.invalidateShadow,this);

        //Background listeners
        this.createEventListener('backgroundColorPropertyChanged',this.invalidateBackground,this);
        this.createEventListener('backgroundAlphaPropertyChanged',this.invalidateBackground,this);

        //Border listeners
        this.createEventListener('borderColorPropertyChanged',this.invalidateBorder,this);
        this.createEventListener('borderAlphaPropertyChanged',this.invalidateBorder,this);
        this.createEventListener('cornerPropertyChanged',this.invalidateBorder,this);
        this.createEventListener('topLeftCornerPropertyChanged',this.invalidateBorder,this);
        this.createEventListener('topRightCornerPropertyChanged',this.invalidateBorder,this);
        this.createEventListener('bottomLeftCornerPropertyChanged',this.invalidateBorder,this);
        this.createEventListener('bottomRightCornerPropertyChanged',this.invalidateBorder,this);
    }

    this.commitProperties=function(){
        this.callSuper('commitProperties');
        if(this.shadowInvalid){
            this.refreshShadow();
            this.shadowInvalid=false;
        }
        if(this.borderInvalid){
            this.refreshBorder();
            this.borderInvalid=false;
        }

        if(this.backgroundInvalid){
            this.refreshBackground();
            this.backgroundInvalid=false;
        }
    }



    this.shadowInvalid=true;

    this.invalidateShadow=function(){
        this.shadowInvalid=true;
        this.invalidateDisplayList();
    }

    this.refreshShadow=function(){
        //Apply shadow
        if(!this.getShadow()){
            this.domElement.style[Modernizr.prefixed('boxShadow')]='none';
        }else{
            if(!this.getShadowInset()){
                var shadow="";
            }else{
                var shadow="inset ";
            }
            shadow=shadow+this.getShadowOffsetX().toString()+"px "+this.getShadowOffsetY().toString()+"px "+this.getShadowBlur().toString()+"px "+this.getShadowSpread()+"px rgba(";
            var rgb=Rokkstar.hexToRgb(this.getShadowColor());
            shadow=shadow+rgb.r+","+rgb.g+","+rgb.b+","+this.getShadowAlpha().toString()+")";
            this.domElement.style[Modernizr.prefixed('boxShadow')]=shadow;
        }

    }

    this.backgroundInvalid=true;

    this.invalidateBackground=function(){
        this.backgroundInvalid=true;
        this.invalidateDisplayList();
    }

    this.refreshBackground=function(){
        if(this.getBackgroundAlpha()==0.0){
            this.domElement.style.background='none';
        }else{
            var rgb=Rokkstar.hexToRgb(this.getBackgroundColor());
            this.domElement.style.background="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+this.getBackgroundAlpha().toString()+")";
        }
    }

    this.borderInvalid=true;

    this.invalidateBorder=function(){
        this.borderInvalid=true;
        this.invalidateDisplayList();
    }

    this.refreshBorder=function(){
        if(this.getBorderAlpha()==0.0){
            this.domElement.style.border='none';
        }else{
            var rgb=Rokkstar.hexToRgb(this.getBorderColor());
            this.domElement.style[Modernizr.prefixed('backgroundClip')]='border-box';
            this.domElement.style.borderColor="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+this.getBorderAlpha().toString()+")";
            this.domElement.style.borderWidth=this.getBorderWidth()+"px";
            this.domElement.style.borderStyle="solid";
        }

        //Corner roundness
        var corner=this.getCorner();
        var topLeftCorner=this.getTopLeftCorner();
        var topRightCorner=this.getTopRightCorner();
        var bottomLeftCorner=this.getBottomLeftCorner();
        var bottomRightCorner=this.getBottomRightCorner();
        if(topLeftCorner===undefined) topLeftCorner=corner;
        if(topRightCorner===undefined) topRightCorner=corner;
        if(bottomLeftCorner===undefined) bottomLeftCorner=corner;
        if(bottomRightCorner===undefined) bottomRightCorner=corner;

        this.domElement.style[Modernizr.prefixed('borderBottomLeftRadius')]=bottomLeftCorner.toString()+"px";
        this.domElement.style[Modernizr.prefixed('borderBottomRightRadius')]=bottomRightCorner.toString()+"px";
        this.domElement.style[Modernizr.prefixed('borderTopLeftRadius')]=topLeftCorner.toString()+"px";
        this.domElement.style[Modernizr.prefixed('borderTopRightRadius')]=topRightCorner.toString()+"px";
    }

},[new Attr('shadow',false,'boolean'),new Attr('shadowOffsetX',2,'integer'),new Attr('shadowOffsetY',2,'integer'),new Attr('shadowBlur',2.0,'float'),new Attr('shadowColor','#000000','string'),new Attr('shadowAlpha',0.5,'float'),new Attr('shadowInset',false,'boolean'),new Attr('shadowSpread',0,'integer'),
    new Attr('borderAlpha',1.0,'float'),new Attr('borderColor','#000000','string'),new Attr('borderWidth',1,'integer'),new Attr('backgroundColor','#FFFFFF','string'),new Attr('backgroundAlpha',1.0,'float'),
    new Attr('corner',0,'integer'),new Attr('topLeftCorner',undefined,'integer'),new Attr('topRightCorner',undefined,'integer'),new Attr('bottomLeftCorner',undefined,'integer'),new Attr('bottomRightCorner',undefined,'integer')]);