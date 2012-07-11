/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /**
 * @augments core.VisualContainer
 * @constructor
 */
core.Group=Rokkstar.class('core.Group','core.VisualContainer',function(){

    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.createAttribute('clipAndEnableScrolling',false,'boolean');
    }

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('clipAndEnableScrollingPropertyChanged',this.invalidateScrolling,this);
    }

    this.scrollingInvalid=true;

    this.invalidateScrolling=function(){
        this.scrollingInvalid=true;
        this.invalidateProperties();
    }

    this.commitProperties=function(){
        this.callSuper('commitProperties');
        if(this.scrollingInvalid){
            this.scrollingInvalid=false;
            if(this.getClipAndEnableScrolling()==true){
                $(this.domElement).css({overflow:'hidden'});
            }else{
                $(this.domElement).css({overflow:'visible'})
            }
        }
    }


});