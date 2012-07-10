/**
 * @augments core.AlignmentLayout
 * @constructor
 */
core.HorizontalLayout=function(){
    extend(this,"core.AlignmentLayout");
    /**
     * 
     * @param {core.VisualComponent} div Parent component
     */
    this.doLayout=function(div){
        this.callSuper('doLayout',div);
        
        var containerWidth=div.measuredWidth;
        var containerHeight=div.measuredHeight;
        var layout=this;
        var elements=div.elements;
        var verticalAlign=this.getVerticalAlign();
        var horizontalAlign=this.getHorizontalAlign();
        var gap=this.getGap();
        var currentLeft=this.getPaddingLeft();
        if(horizontalAlign=='left' || horizontalAlign=='center'){
            for(var i in elements){
                $(div.elements[i].domElement).css({
                    'position':'absolute',
                    'width':layout.stringToPixel(div.elements[i].getWidth(),containerWidth,layout.getPaddingLeft(),layout.getPaddingRight()),
                    'height':layout.stringToPixel(div.elements[i].getHeight(),containerHeight,layout.getPaddingTop(),layout.getPaddingBottom())
                });
                div.elements[i].measure();
                var width=div.elements[i].measuredWidth;
                var height=div.elements[i].measuredHeight;

                if(verticalAlign=='top'){
                    $(div.elements[i].domElement).css({
                        top:this.getPaddingTop()+'px',
                        left:currentLeft+'px'
                    });
                }else if(verticalAlign=='bottom'){
                    $(div.elements[i].domElement).css({
                        bottom:this.getPaddingBottom()+'px',
                        left:currentLeft+'px'
                    });
                }else{
                    var space=Math.round((parseInt(containerHeight)-parseInt(this.getPaddingTop())-parseInt(this.getPaddingBottom())-parseInt(height))/2);
                    $(div.elements[i].domElement).css({
                        top:space+'px',
                        left:currentLeft+'px'
                    });
                }
                currentLeft=parseInt(currentLeft)+parseInt(width)+parseInt(gap);
            }
        }else if(horizontalAlign=='right'){
            var currentRight=this.getPaddingRight();
            for(var i=elements.length-1;i>=0;i--){
                $(div.elements[i].domElement).css({
                    'position':'absolute',
                    'width':layout.stringToPixel(div.elements[i].getWidth(),containerWidth,layout.getPaddingLeft(),layout.getPaddingRight()),
                    'height':layout.stringToPixel(div.elements[i].getHeight(),containerHeight,layout.getPaddingTop(),layout.getPaddingBottom())
                });
                div.elements[i].measure();
                var width=div.elements[i].measuredWidth;
                var height=div.elements[i].measuredHeight;

                if(verticalAlign=='top'){
                    $(div.elements[i].domElement).css({
                        top:this.getPaddingTop()+'px',
                        right:currentRight+'px'
                    });
                }else if(verticalAlign=='bottom'){
                    $(div.elements[i].domElement).css({
                        bottom:this.getPaddingBottom()+'px',
                        right:currentRight+'px'
                    });
                }else{
                    var space=Math.round((parseInt(containerHeight)-parseInt(this.getPaddingTop())-parseInt(this.getPaddingBottom())-parseInt(height))/2);
                    $(div.elements[i].domElement).css({
                        top:space+'px',
                        right:currentRight+'px'
                    });
                }
                currentRight=parseInt(currentRight)+parseInt(width)+parseInt(gap);
            }
        }
        
        if(horizontalAlign=='center'){
            //Fixing positions
            currentLeft-=parseInt(gap);
            var correction=containerWidth-currentLeft;
            correction=Math.round(correction/2);
            for(var i in elements){
                $(elements[i].domElement).css('left',parseInt($(elements[i].domElement).css('left'))+correction);
            }

        }
    }
}