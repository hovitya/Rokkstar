/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 *
 * @constructor
 */
core.ParallaxLayout=Rokkstar.createClass('core.ParallaxLayout','core.Layout',function(){

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('positionXPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('positionYPropertyChanged',this.selfRefreshLayout,this);
    }
    /**
     *
     * @param {core.VisualContainer} div
     */
    this.doLayout=function(div){
        this.callSuper('doLayout',div);
        for(var i in div.elements){
            var elem=div.elements[i];
            if(elem.getWidth()!=undefined && elem.getWidth()!=null) elem.domElement.style.width=this.stringToPixel(elem.getWidth(),div.measuredWidth,this.getPaddingLeft(),this.getPaddingRight());
            else elem.domElement.style.width='100%';
            if(elem.getHeight()!=undefined && elem.getHeight()!=null) elem.domElement.style.height=this.stringToPixel(elem.getHeight(),div.measuredHeight,this.getPaddingTop(),this.getPaddingBottom());
            else elem.domElement.style.height='100%';
            var distance=elem.getDistance();
            var distanceX=elem.getDistanceX();
            var distanceY=elem.getDistanceY();
            if(distanceX==undefined) distanceX=distance;
            if(distanceY==undefined) distanceY=distance;
            var xMod=(100-distanceX)/100.0;
            var yMod=(100-distanceY)/100.0;
            if(elem.getX()!=undefined) var x=elem.getX()+this.getPositionX()*xMod;
            else var x=this.getPositionX()*xMod;
            if(elem.getY()!=undefined) var y=elem.getY()+this.getPositionY()*yMod;
            else var y=this.getPositionY()*xMod;
            elem.domElement.style.left=x+'px';
            elem.domElement.style.top=y+'px';
            elem.domElement.style.position='absolute';
            elem.measure();
        }

    }
},[new Attr('positionX',0,'integer'),new Attr('positionY',0,'integer')]);