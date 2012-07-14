/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /**
 * @augments core.AlignmentLayout
 * @constructor
 */
core.HorizontalLayout=Rokkstar.createClass('core.HorizontalLayout','core.AlignmentLayout',function(){
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
                div.elements[i].domElement.style.position='absolute';
                div.elements[i].domElement.style.width=layout.stringToPixel(div.elements[i].getWidth(),containerWidth,layout.getPaddingLeft(),layout.getPaddingRight());
                div.elements[i].domElement.style.height=layout.stringToPixel(div.elements[i].getHeight(),containerHeight,layout.getPaddingTop(),layout.getPaddingBottom());
                div.elements[i].measure();
                var width=div.elements[i].measuredWidth;
                var height=div.elements[i].measuredHeight;

                if(verticalAlign=='top'){
                    div.elements[i].domElement.style.top=this.getPaddingTop()+'px';
                    div.elements[i].domElement.style.left=currentLeft+'px';
                }else if(verticalAlign=='bottom'){
                    div.elements[i].domElement.style.bottom=this.getPaddingBottom()+'px',
                    div.elements[i].domElement.style.left=currentLeft+'px';
                }else{
                    var space=Math.round((parseInt(containerHeight)-parseInt(this.getPaddingTop())-parseInt(this.getPaddingBottom())-parseInt(height))/2);
                    div.elements[i].domElement.style.top=space+'px';
                    div.elements[i].domElement.style.left=currentLeft+'px';
                }
                currentLeft=parseInt(currentLeft)+parseInt(width)+parseInt(gap);
            }
        }else if(horizontalAlign=='right'){
            var currentRight=this.getPaddingRight();
            for(var i=elements.length-1;i>=0;i--){
                div.elements[i].domElement.style.position='absolute';
                div.elements[i].domElement.style.width=layout.stringToPixel(div.elements[i].getWidth(),containerWidth,layout.getPaddingLeft(),layout.getPaddingRight());
                div.elements[i].domElement.style.height=layout.stringToPixel(div.elements[i].getHeight(),containerHeight,layout.getPaddingTop(),layout.getPaddingBottom());
                div.elements[i].measure();
                var width=div.elements[i].measuredWidth;
                var height=div.elements[i].measuredHeight;

                if(verticalAlign=='top'){
                    div.elements[i].domElement.style.top=this.getPaddingTop()+'px';
                    div.elements[i].domElement.style.right=currentRight+'px';
                }else if(verticalAlign=='bottom'){
                    div.elements[i].domElement.style.bottom=this.getPaddingBottom()+'px';
                    div.elements[i].domElement.style.right=currentRight+'px';
                }else{
                    var space=Math.round((parseInt(containerHeight)-parseInt(this.getPaddingTop())-parseInt(this.getPaddingBottom())-parseInt(height))/2);
                    div.elements[i].domElement.style.top=space+'px';
                    div.elements[i].domElement.style.right=currentRight+'px';
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
                elements[i].domElement.style.left=(parseInt(elements[i].domElement.style.left)+correction)+"px";
            }

        }
    }
});