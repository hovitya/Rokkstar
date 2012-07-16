/**
 *
 * @constructs
 * @augments core.DrawableComponent
 */
core.graphics.GraphicsElement=Rokkstar.createClass('core.graphics.GraphicsElement','core.DrawableComponent',function(){

    this.drawingInvalid=true;

    this.canvasSizeChanged=false;

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('filtersPropertyChanged',this._filtersChanged,this);
    }

    this.measure=function(){
        var mw=this.measuredWidth;
        var mh=this.measuredHeight;
        this.callSuper('measure');
        //Repaint graphics
        if(mw!=this.measuredWidth || mh!=this.measuredHeight){
            //Reset size
            var outerPadding=this.getCanvasOuterPadding();
            this.canvas.width=this.measuredWidth+2*outerPadding;
            this.canvas.height=this.measuredHeight+2*outerPadding;
            this.invalidateDrawing();
        }
    }

    this.sizeReset=function(){

    }

    this.invalidateDrawing=function(){
        this.drawingInvalid=true;
        this.invalidateProperties();
    }

    this.commitProperties=function(){
        this.callSuper('commitProperties');
        if(this.drawingInvalid){
            if(this.drawProxy==null){
                this.drawProxy=$.proxy(function(){
                    var outerPadding=this.getCanvasOuterPadding();
                    this.clearGraphics();
                    this.draw(this.graphics,outerPadding,outerPadding,this.measuredWidth,this.measuredHeight);
                    //Apply filters
                    var filters=this.getFilters();
                    var i=filters.length;
                    while(--i>=0){
                        filters[i].apply(this.canvas);
                    }
                },this);
            }
            //Call drawing during next animation frame
            Rokkstar.requestAnimationFrame(this.drawProxy);
        }
    }

    this.drawProxy=null;

    this.clearGraphics=function(){
        this.graphics.clearRect(0,0,this.canvas.width,this.canvas.height);
    }

    this._filtersChanged=function(event){
        var oldFilters=event.oldValue;
        var i=oldFilters.length;
        while(--i>=0){
            oldFilters[i].deleteEventListener('change',this.invalidateFilters,this);
        }

        var newFilters=this.getFilters();
        var j=newFilters.length;
        while(--j>=0){
            newFilters[j].createEventListener('change',this.invalidateFilters,this);
        }
    }

    this.invalidateFilters=function(){
        this.invalidateDrawing();
    }

    /**
     * Draws graphics.
     * @param {HTMLCanvasElement} canvas Graphic context to draw to.
     */
    this.draw=function(graphics){

    }

},[new Attr('filters',[],'array')]);