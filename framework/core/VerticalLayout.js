/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.AlignmentLayout
 * @constructor
 */
core.VerticalLayout=Rokkstar.class('core.VerticalLayout','core.AlignmentLayout',function(){
    /**
     * 
     * @param {core.VisualComponent} div parent div
     */
    this.doLayout=function(div){
        this.callSuper('doLayout',div);
        
        var containerWidth=div.measuredWidth;
        var containerHeight=div.measuredHeight;
        var layout=this;
        var elements=div.elements;
        var verticalAlign=this.getVerticalAlign();
        var gap=this.getGap();
        var currentTop=this.getPaddingTop();
        if(verticalAlign=='top' || verticalAlign=='middle'){
            for(var i in elements){
                $(div.elements[i].domElement).css({
                    'position':'absolute',
                    'width':layout.stringToPixel(div.elements[i].getWidth(),containerWidth,layout.getPaddingLeft(),layout.getPaddingRight()),
                    'height':layout.stringToPixel(div.elements[i].getHeight(),containerHeight,layout.getPaddingTop(),layout.getPaddingBottom())
                });
                div.elements[i].measure();

                var width=div.elements[i].measuredWidth;
                var height=div.elements[i].measuredHeight;
                
                if(this.getHorizontalAlign()=='left'){
                    $(div.elements[i].domElement).css({
                        top:currentTop+'px',
                        left:this.getPaddingLeft()+'px'
                    });
                }else if(this.getHorizontalAlign()=='right'){
                    $(div.elements[i].domElement).css({
                        top:currentTop+'px',
                        right:this.getPaddingRight()+'px'
                    });
                }else{
                    var space=Math.round((parseInt(containerWidth)-parseInt(this.getPaddingLeft())-parseInt(this.getPaddingRight())-parseInt(width))/2);
                    $(div.elements[i].domElement).css({
                        top:currentTop+'px',
                        left:space+'px'
                    });
                }
                currentTop=parseInt(currentTop)+parseInt(height)+parseInt(gap);
            }
        }else if(verticalAlign=='bottom'){
            var currentBottom=this.getPaddingBottom();
            for(var i=elements.length-1;i>=0;i--){
                $(div.elements[i].domElement).css({
                    'position':'absolute',
                    'width':layout.stringToPixel(div.elements[i].getWidth(),containerWidth,layout.getPaddingLeft(),layout.getPaddingRight()),
                    'height':layout.stringToPixel(div.elements[i].getHeight(),containerHeight,layout.getPaddingTop(),layout.getPaddingBottom())
                });
                div.elements[i].measure();
                var width=div.elements[i].measuredWidth;
                var height=div.elements[i].measuredHeight;

                if(this.getHorizontalAlign()=='left'){
                    $(div.elements[i].domElement).css({
                        bottom:currentBottom+'px',
                        left:this.getPaddingLeft()+'px'
                    });
                }else if(this.getHorizontalAlign()=='right'){
                    $(div.elements[i].domElement).css({
                        bottom:currentBottom+'px',
                        right:this.getPaddingRight()+'px'
                    });
                }else{
                    var space=Math.round((parseInt(containerWidth)-parseInt(this.getPaddingLeft())-parseInt(this.getPaddingRight())-parseInt(width))/2);
                    $(div.elements[i].domElement).css({
                        bottom:currentBottom+'px',
                        left:space+'px'
                    });
                }
                currentBottom=parseInt(currentBottom)+parseInt(height)+parseInt(gap);
            }
        }
        
        if(verticalAlign=='middle'){
            //Fixing positions
            currentTop-=parseInt(gap);
            var correction=containerHeight-currentTop;
            correction=Math.round(correction/2);
            for(var i in elements){
                $(elements[i].domElement).css('top',parseInt($(elements[i].domElement).css('top'))+correction);
            }

        }
    }
});