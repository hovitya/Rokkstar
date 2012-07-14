/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /**
 * @augments core.Panel
 * @constructor
 */
core.TitlePanel=Rokkstar.createClass('core.TitlePanel','core.Panel',function(){

    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.declareSkinPart('label',false,'core.Label');
    }

    this.init=function(){
        this.callSuper('init');
        this.setSkinClass("core.skins.TitlePanelSkin");
        this.createEventListener('titleLabelPropertyChanged',this.updateLabel,this);
    }


    this.partAdded=function(name,instance){
        this.callSuper('partAdded',name,instance);
        if(name=='label'){
            instance.setText(this.getTitleLabel());
        }
    }

    this.updateLabel=function(){
        if(this.hasSkinPart('label')){
            this.getSkinPart('label').setText(this.getTitleLabel());
        }
    }


},[new Attr('titleLabel','')]);