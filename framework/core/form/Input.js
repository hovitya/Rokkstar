/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /**
 * @augments core.helpers.FormItem
 * @constructor
 */
core.form.Input=Rokkstar.createClass('core.form.Input','core.helpers.FormItem',function(){

    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.declareSkinPart('input',true,'core.InputBase');
    }



    this.init=function(){
        this.callSuper('init');
        this.setSkinClass('core.skins.InputSkin');
        this.createEventListener('tabIndexPropertyChanged',this.tabIndexChanged,this);
        this.createEventListener('valuePropertyChanged',this._commit,this);
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
            instance.createEventListener('valuePropertyChanged',this._inputChanged,this);
        }
    }

    this.partRemoved=function(name,instance){
        this.callSuper('partRemoved',name,instance);
        if(name=='input'){
            instance.deleteEventListener('focus',this.focused,this);
            instance.deleteEventListener('blur',this.blured,this);
            instance.deleteEventListener('valuePropertyChanged',this._inputChanged,this);
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

    this._commitEnabled=true;

    /**
     *
     * @param {core.events.PropertyChangeEvent} event
     * @private
     */
    this._inputChanged=function(event){
        this._commitEnabled=false;
        this.setValue(event.newValue);
        this._commitEnabled=true;
    }

    this._commit=function(event){
        if(this._commitEnabled && this.hasSkinPart('input')){
            this.getSkinPart('input').setValue(this.getValue());
        }
    }

},[new Attr('tabIndex',0,'integer'),new Attr('value',"",'string')]);