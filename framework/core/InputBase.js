/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
 * @augments core.VisualComponent
 * @constructor
 */
core.InputBase=Rokkstar.class('core.InputBase','core.VisualComponent',function(){

    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.createAttribute('value',"",'string');
        this.createAttribute('disabled',false,'boolean');
    }

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('change',this._inputChanged,this);
        this.createEventListener('disabledPropertyChanged',this._disabledChanged,this);
        this.createEventListener('valuePropertyChanged',this._valueChanged,this);
    }

    this.createDomElement=function(){
        this.domElement=document.createElement('input');
        this.domElement.style[Modernizr.prefixed('boxSizing')]='border-box';
        this.domElement.style.position='absolute';
    }

    this._valueChanged=function(){
        this.domElement.value=this.getValue();
    }

    this._inputChanged=function(){
        this.setValue(this.domElement.value);
    }

    this._disabledChanged=function(){
        this.domElement.disabled=this.getDisabled();
    }

});
