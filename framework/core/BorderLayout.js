core.BorderLayout=Rokkstar.class('core.BorderLayout','core.Layout',function(){

    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.createAttribute('gap', '5');
        this.createAttribute('gapRight', undefined);
        this.createAttribute('gapTop', undefined);
        this.createAttribute('gapBottom', undefined);
        this.createAttribute('gapLeft', undefined);
    }

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('gapPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('gapRightPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('gapTopPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('gapBottomPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('gapLeftPropertyChanged',this.selfRefreshLayout,this);
    }

    this.currentHandle=null;

    /**
     *
     * @param {core.VisualContainer} div Target container
     */
    this.doLayout=function(div){
        this.callSuper('doLayout',div);

        var gap=this.getGap();
        var leftGap=this.getGapLeft();
        var rightGap=this.getGapRight();
        var topGap=this.getGapTop();
        var bottomGap=this.getGapBottom();

        var leftPadding=this.getPaddingLeft();
        var rightPadding=this.getPaddingRight();
        var topPadding=this.getPaddingTop();
        var bottomPadding=this.getPaddingBottom();

        if(leftGap==undefined){
            leftGap=gap;
        }
        if(rightGap==undefined){
            rightGap=gap;
        }
        if(topGap==undefined){
            topGap=gap;
        }
        if(bottomGap==undefined){
            bottomGap=gap;
        }
        var topSlot=null;
        var leftSlot=null;
        var rightSlot=null;
        var bottomSlot=null;
        var centerSlot=null;
        for(var i in div.elements){
            var element=div.elements[i];
            switch(element.getPosition()){
                case 'center':
                    if(centerSlot==null){
                        centerSlot=element;
                    }else{
                        throw new core.exceptions.Exception('Multiple "center" part found for a border layout.');
                    }
                    break;
                case 'left':
                    if(leftSlot==null){
                        leftSlot=element;
                    }else{
                        throw new core.exceptions.Exception('Multiple "left" part found for a border layout.');
                    }
                    break;
                case 'right':
                    if(rightSlot==null){
                        rightSlot=element;
                    }else{
                        throw new core.exceptions.Exception('Multiple "right" part found for a border layout.');
                    }
                    break;
                case 'bottom':
                    if(bottomSlot==null){
                        bottomSlot=element;
                    }else{
                        throw new core.exceptions.Exception('Multiple "bottom" part found for a border layout.');
                    }
                    break;
                case 'top':
                    if(topSlot==null){
                        topSlot=element;
                    }else{
                        throw new core.exceptions.Exception('Multiple "top" part found for a border layout.');
                    }
                    break;
            }
        }


        //Create top element
        var topPosition=topPadding;
        if(topSlot!=null){

            topSlot.domElement.style.position='absolute';
            topSlot.domElement.style.top=topPadding+'px';
            topSlot.domElement.style.left=leftPadding+'px';
            topSlot.domElement.style.right=rightPadding+'px';
            topSlot.domElement.style.height=this.stringToPixel(topSlot.getHeight(),div.measuredHeight,topPadding,bottomPadding);
            topSlot.measure();

            //Create top gap
            handle=document.createElement('div');
            handle.className="coreTopBorderHandle coreUpDownHandle";
            div.domElement.appendChild(handle);

            handle.style.position='absolute';
            handle.style.top=(parseInt(topPadding)+parseInt(topSlot.measuredHeight))+'px';
            handle.style.left=leftPadding+'px';
            handle.style.right=rightPadding+'px';
            handle.style.height=topGap+"px";
            handle.parentPanel=topSlot;
            handle.addEventListener('mousedown',this.handleClickedProxy);
            topPosition=parseInt(topPadding)+parseInt(topSlot.measuredHeight)+parseInt(topGap);
        }



        //Create bottom element
        var bottomPosition=bottomPadding;
        if(bottomSlot!=null){

            bottomSlot.domElement.style.position='absolute';
            bottomSlot.domElement.style.bottom=bottomPadding+'px';
            bottomSlot.domElement.style.left=leftPadding+'px';
            bottomSlot.domElement.style.right=rightPadding+'px';
            bottomSlot.domElement.style.height=this.stringToPixel(bottomSlot.getHeight(),div.measuredHeight,topPadding,bottomPadding);

            bottomSlot.measure();

            //Create bottom gap
            handle=document.createElement('div');
            handle.className="coreBottomBorderHandle coreUpDownHandle";
            div.domElement.appendChild(handle);

            handle.style.position='absolute';
            handle.style.bottom=(parseInt(bottomPadding)+parseInt(bottomSlot.measuredHeight))+'px';
            handle.style.left=leftPadding+'px';
            handle.style.right=rightPadding+'px';
            handle.style.height=bottomGap+"px";

            handle.parentPanel=bottomSlot;
            handle.addEventListener('mousedown',this.handleClickedProxy);
            bottomPosition=parseInt(bottomPadding)+parseInt(bottomSlot.measuredHeight)+parseInt(bottomGap);
        }

        //Create left element
        var leftPosition=leftPadding;
        if(leftSlot!=null){

            leftSlot.domElement.style.position='absolute';
            leftSlot.domElement.style.bottom=bottomPosition+'px';
            leftSlot.domElement.style.left=leftPadding+'px';
            leftSlot.domElement.style.top=topPosition+'px';
            leftSlot.domElement.style.width=this.stringToPixel(leftSlot.getWidth(),div.measuredWidth,leftPadding,rightPadding);

            leftSlot.measure();

            //Create bottom gap
            handle=document.createElement('div');
            handle.className="coreLeftBorderHandle coreLeftRightHandle";
            div.domElement.appendChild(handle);

            handle.style.position='absolute';
            handle.style.bottom=bottomPosition+'px';
            handle.style.left=(parseInt(leftPadding)+parseInt(leftSlot.measuredWidth))+'px';
            handle.style.top=topPosition+'px';
            handle.style.width=leftGap+"px";

            handle.parentPanel=leftSlot;
            handle.addEventListener('mousedown',this.handleClickedProxy);
            leftPosition=parseInt(leftPadding)+parseInt(leftSlot.measuredWidth)+parseInt(leftGap);
        }

        //Create right element
        var rightPosition=rightPadding;
        if(rightSlot!=null){


            rightSlot.domElement.style.position='absolute';
            rightSlot.domElement.style.bottom=bottomPosition+'px';
            rightSlot.domElement.style.right=rightPadding+'px';
            rightSlot.domElement.style.top=topPosition+'px';
            rightSlot.domElement.style.width=this.stringToPixel(rightSlot.getWidth(),div.measuredWidth,leftPadding,rightPadding);

            rightSlot.measure();

            //Create right gap
            handle=document.createElement('div');
            handle.className="coreRightBorderHandle coreLeftRightHandle";
            div.domElement.appendChild(handle);


            handle.style.position='absolute';
            handle.style.bottom=bottomPosition+'px';
            handle.style.right=(parseInt(rightPadding)+parseInt(rightSlot.measuredWidth))+'px';
            handle.style.top=topPosition+'px';
            handle.style.width=rightGap+"px";

            handle.parentPanel=rightSlot;
            handle.addEventListener('mousedown',this.handleClickedProxy);
            rightPosition=parseInt(rightPadding)+parseInt(rightSlot.measuredWidth)+parseInt(rightGap);
        }

        if(centerSlot!=null){

            centerSlot.domElement.style.position='absolute';
            centerSlot.domElement.style.left=leftPosition+'px';
            centerSlot.domElement.style.right=rightPosition+'px';
            centerSlot.domElement.style.top=topPosition+'px';
            centerSlot.domElement.style.bottom=bottomPosition+'px';

            centerSlot.measure();
        }


    }

    this.handleClicked=function(event){
        this.currentHandle=event.currentTarget;
        this.lastPoint.x=event.pageX;
        this.lastPoint.y=event.pageY;
        this.resizeValue=0;
        $(this.currentHandle).addClass("coreHandleHighlight");
        $(window).mousemove(this.handleMoveProxy);
        $(window).mouseup(this.handleUpProxy);

    }

    this.handleClickedProxy=$.proxy(this.handleClicked,this);

    this.lastPoint={x:0,y:0};
    this.resizeValue=0;

    this.handleMove=function(event){
        var $ch=$(this.currentHandle);
        if($ch.hasClass('coreRightBorderHandle')){
            $ch.css({
                right:(parseInt($ch.css('right'))+Math.round(this.lastPoint.x-event.pageX))+'px'

            });
            this.resizeValue+=Math.round(this.lastPoint.x-event.pageX);
        }else if($ch.hasClass('coreBottomBorderHandle')){
            $ch.css({
                bottom:(parseInt($ch.css('bottom'))+Math.round(this.lastPoint.y-event.pageY))+'px'
            });
            this.resizeValue+=Math.round(this.lastPoint.y-event.pageY);
        }else if($ch.hasClass('coreLeftBorderHandle')){
            $ch.css({
                left:(parseInt($ch.css('left'))+Math.round(event.pageX-this.lastPoint.x))+'px'
            });
            this.resizeValue+=Math.round(event.pageX-this.lastPoint.x);
        }else if($ch.hasClass('coreTopBorderHandle')){
            $ch.css({
                top:(parseInt($ch.css('top'))+Math.round(event.pageY-this.lastPoint.y))+'px'
            });
            this.resizeValue+=Math.round(event.pageY-this.lastPoint.y);
        }
        this.lastPoint.x=event.pageX;
        this.lastPoint.y=event.pageY;
    }

    this.handleMoveProxy=$.proxy(this.handleMove,this);

    this.handleUp=function(event){
        $(window).unbind('mousemove',this.handleMoveProxy);
        $(window).unbind('mouseup',this.handleUpProxy);

        var $ch=$(this.currentHandle);
        if($ch.hasClass('coreLeftRightHandle')){
            this.currentHandle.parentPanel.setWidth((parseInt(this.currentHandle.parentPanel.measuredWidth)+this.resizeValue)+"px");
        }else{
            this.currentHandle.parentPanel.setHeight((parseInt(this.currentHandle.parentPanel.measuredHeight)+this.resizeValue)+"px");
        }
        $ch.removeClass("coreHandleHighlight");
        this.currentHandle=null;

    }

    this.handleUpProxy= $.proxy(this.handleUp,this);

} );