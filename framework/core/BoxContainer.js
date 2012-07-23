core.BoxContainer=Rokkstar.createClass('core.BoxContainer','core.Group',function(){
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
        this.createEventListener('gradientModePropertyChanged',this.invalidateBackground,this);
        this.createEventListener('gradientStartPropertyChanged',this.invalidateBackground,this);
        this.createEventListener('gradientEndPropertyChanged',this.invalidateBackground,this);
        this.createEventListener('gradientAlphaStartPropertyChanged',this.invalidateBackground,this);
        this.createEventListener('gradientAlphaEndPropertyChanged',this.invalidateBackground,this);

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
        this.invalidateProperties();
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
        this.invalidateProperties();
    }

    this.refreshBackground=function(){
        if(this.getGradientMode()){
            var colorRgb=Rokkstar.hexToRgb(this.getGradientStart());
            var startStr="rgba("+colorRgb.r+","+colorRgb.g+","+colorRgb.b+","+this.getGradientAlphaStart().toString()+")";
            colorRgb=Rokkstar.hexToRgb(this.getGradientEnd());
            var endStr="rgba("+colorRgb.r+","+colorRgb.g+","+colorRgb.b+","+this.getGradientAlphaEnd().toString()+")";
            if(BrowserDetect.browser=="Firefox"){
                this.domElement.style.background="-moz-linear-gradient(top,  "+startStr+",  "+endStr+")";
            }else if(BrowserDetect.browser=="Opera"){
                this.domElement.style.background="-o-linear-gradient(top,  "+startStr+",  "+endStr+")";
            }else if(BrowserDetect.browser=="Explorer"){
                //Convert to ARGB
                var colorRgb=Rokkstar.hexToRgb(this.getGradientStart());
                var opacity=this.getGradientAlphaStart()*255;
                var color1='#'+colorRgb.r.toString(16)+colorRgb.g.toString(16)+colorRgb.b.toString(16)+opacity.toString(16);
                colorRgb=Rokkstar.hexToRgb(this.getGradientEnd());
                opacity=this.getGradientAlphaEnd()*255;
                var color2='#'+colorRgb.r.toString(16)+colorRgb.g.toString(16)+colorRgb.b.toString(16)+opacity.toString(16);
                this.domElement.style[Modernizr.prefixed('filter')]="progid:DXImageTransform.Microsoft.gradient(startColorstr="+color1+", endColorstr="+color2+")";
            }else{
                this.domElement.style.background="-webkit-gradient(linear, left top, left bottom,  from("+startStr+"),  to("+endStr+"))";
            }
        }else if(this.getBackgroundAlpha()==0.0){
            this.domElement.style.background='none';
        }else{
            var rgb=Rokkstar.hexToRgb(this.getBackgroundColor());
            this.domElement.style.background="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+this.getBackgroundAlpha().toString()+")";
        }
    }

    this.borderInvalid=true;

    this.invalidateBorder=function(){
        this.borderInvalid=true;
        this.invalidateProperties();
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
    new Attr('borderAlpha',1.0,'float'),new Attr('borderColor','#000000','string'),new Attr('borderWidth',1,'integer'),new Attr('backgroundColor','#FFFFFF','string'),new Attr('backgroundAlpha',1.0,'float'),new Attr('gradientMode',false,'boolean'),new Attr('gradientStart','#FFFFFF','string'),new Attr('gradientEnd','#000000','string'),new Attr('gradientAlphaStart',1.0,'float'),new Attr('gradientAlphaEnd',1.0,'string'),
    new Attr('corner',0,'integer'),new Attr('topLeftCorner',undefined,'integer'),new Attr('topRightCorner',undefined,'integer'),new Attr('bottomLeftCorner',undefined,'integer'),new Attr('bottomRightCorner',undefined,'integer')]);