/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.AlignmentLayout
 * @constructor
 */
core.VerticalLayout=Rokkstar.createClass('core.VerticalLayout','core.AlignmentLayout',function(){
    /**
     * 
     * @param {core.VisualContainer} div Parent div
     */
    this.doLayout=function(div){
        //this.callSuper('doLayout',div);
        this.lastDiv=div;

        var containerWidth=parseInt(div.measuredWidth);
        var containerHeight=parseInt(div.measuredHeight);
        var layout=this;
        var elements=div.elements;
        var verticalAlign=this.getVerticalAlign();
        var gap=parseInt(this.getGap());
        
        var horizontalAlign=this.getHorizontalAlign();
        var paddingLeft=parseInt(this.getPaddingLeft());
        var paddingRight=parseInt(this.getPaddingRight());
        var paddingTop=parseInt(this.getPaddingTop());
        var paddingBottom=parseInt(this.getPaddingBottom());
        var elementsLength=elements.length;
        var position=new core.helpers.LayoutPosition(containerWidth,containerHeight,paddingLeft,paddingRight,paddingTop,paddingBottom);

        var i=0;
        if(verticalAlign=='top' || verticalAlign=='middle'){
            var currentTop=paddingTop;
            i=elementsLength;
            while(--i>=0){
                var element=div.elements[i];
                var domElement=element.domElement;
                var widthString=element.getWidth();
                var heightString=element.getHeight();
                position.clear();
                position.width=layout.stringToPixel(widthString,containerWidth,paddingLeft,paddingRight);
                position.height=layout.stringToPixel(heightString,containerHeight,paddingTop,paddingBottom);


                var width=position.getPredictedWidth();
                var height=position.getPredictedHeight();
                
                if(horizontalAlign=='left'){
                    position.top=currentTop;
                    position.left=paddingLeft;
                }else if(horizontalAlign=='right'){
                    position.top=currentTop;
                    position.right=paddingRight;
                }else{
                    var space=Math.round((containerWidth-paddingLeft-paddingRight-width)/2);
                    position.top=currentTop;
                    position.left=space;
                }
                currentTop=currentTop+height+gap;
                position.apply(element);
                element.measure(width,height);
            }
        }else if(verticalAlign=='bottom'){
            var currentBottom=paddingBottom;
            i=elementsLength;
            while(--i>=0){
                var element=div.elements[i];
                var domElement=element.domElement;
                var widthString=element.getWidth();
                var heightString=element.getHeight();
                position.clear();
                

                position.width=layout.stringToPixel(widthString,containerWidth,paddingLeft,paddingRight);
                position.height=layout.stringToPixel(heightString,containerHeight,paddingTop,paddingBottom);

                var width=position.getPredictedWidth();
                var height=position.getPredictedWidth();

                if(horizontalAlign=='left'){
                    position.bottom=currentBottom;
                    position.left=paddingLeft;
                }else if(this.getHorizontalAlign()=='right'){
                    position.bottom=currentBottom;
                    position.right=paddingRight;
                }else{
                    var space=Math.round((containerWidth-paddingLeft-paddingRight-width)/2);
                    position.bottom=currentBottom;
                    position.left=space;
                }
                currentBottom=currentBottom+height+gap;
                position.apply(element);
                element.measure(width,height);
            }
        }
        
        if(verticalAlign=='middle'){
            //Fixing positions
            currentTop-=parseInt(gap);
            var correction=containerHeight-currentTop;
            correction=Math.round(correction/2);
            i=elementsLength;
            while(--i>=0){
                element=elements[i];
                element.domElement.style.top=(parseInt(elements[i].domElement.style.top)+correction)+"px";
            }

        }
    }
});