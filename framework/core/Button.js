/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.SkinnableComponent
 * @constructor
 */
core.Button=Rokkstar.class('core.Button','core.SkinnableComponent',function(){

    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.buttonCreateAttributes();
        this.focusableCreateAttributes();
        this.createAttribute('enabled',true,'boolean');
        this.createAttribute('label','Button');
        this.declareSkinPart('label',false,'core.Label');
    }

    this.init=function(){
        this.callSuper('init');
        this.buttonInit();
        this.focusableInit();
        this.setSkinClass('core.skins.ButtonSkin');
        this.setWidth('90px');
        this.setHeight('23px');
        this.createEventListener('labelPropertyChanged',this.updateLabel,this);
        this.createEventListener('currentStatePropertyChanged',this.cStateChanged,this);
        this.setCurrentState("up");
    }

    this.updateLabel=function(){
        if(this.hasSkinPart('label')){
            this.getSkinPart('label').setText(this.getLabel());
        }
    }

    this.partAdded=function(partName,instance){
        if(partName=='label'){
            instance.setText(this.getLabel());
        }
    }

    this.getSkinState=function(){
        if(!this.getEnabled()){
            return "disabled";
        }else{
            return this.getCurrentState();
        }
    }

    this.cStateChanged=function(event){
         this.invalidateSkinState();
    }

},['core.behaviours.ButtonBehaviour','core.behaviours.FocusableBehaviour']);
