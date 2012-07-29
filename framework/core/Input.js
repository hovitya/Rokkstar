/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /**
 * @augments core.helpers.FormItem
 * @constructor
 */
core.Input=Rokkstar.createClass('core.Input','core.helpers.FormItem',function(){

    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.declareSkinPart('input',true,'core.InputBase');
    }



    this.init=function(){
        this.callSuper('init');
        this.setSkinClass('core.skins.InputSkin');
        this.createEventListener('tabIndexPropertyChanged',this.tabIndexChanged,this);
    }

    this.tabIndexChanged=function(){
        if(this.hasSkinPart('input')){
            $(this.getSkinPart('input').domElement).attr('tabindex',this.getTabIndex());
        }
    }

    this.partAdded=function(name,instance){
        this.callSuper('partAdded',name,instance);
        if(name=='input'){
            instance.createEventListener('focus',this.focused,this);
            instance.createEventListener('blur',this.blured,this);
        }
    }

    this.partRemoved=function(name,instance){
        this.callSuper('partRemoved',name,instance);
        if(name=='input'){
            instance.deleteEventListener('focus',this.focused,this);
            instance.deleteEventListener('blur',this.blured,this);
        }
    }

    this.focused=function(event){
        this.focus=true;
        this.invalidateSkinState();
    }

    this.blured=function(event){
        this.focus=false;
        this.invalidateSkinState();
    }

},[new Attr('tabIndex',0,'integer')]);