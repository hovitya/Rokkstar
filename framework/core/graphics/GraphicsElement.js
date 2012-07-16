/**
 *
 * @constructs
 * @augments core.DrawableComponent
 */
core.graphics.GraphicsElement=Rokkstar.createClass('core.graphics.GraphicsElement','core.DrawableComponent',function(){

    this.drawingInvalid=true;

    this.canvasSizeChanged=false;

    this.measure=function(){
        var mw=this.measuredWidth;
        var mh=this.measuredHeight;
        this.callSuper('measure');
        //Repaint graphics
        if(mw!=this.measuredWidth || mh!=this.measuredHeight){
            //Reset size
            this.domElement.width=this.measuredWidth;
            this.domElement.height=this.measuredHeight;
            this.invalidateDrawing();
        }
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
                    this.clearGraphics();
                    this.draw(this.graphics);
                },this);
            }
            //Call drawing during next animation frame
            Rokkstar.requestAnimationFrame(this.drawProxy);
        }
    }

    this.drawProxy=null;

    this.clearGraphics=function(){
        this.graphics.clearRect(0,0,this.domElement.width,this.domElement.height);
    }

    /**
     * Draws graphics.
     * @param {HTMLCanvasElement} canvas Graphic context to draw to.
     */
    this.draw=function(graphics){

    }

});