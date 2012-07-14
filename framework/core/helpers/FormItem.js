/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
 * Abstract base class for form input elements
 * @augments core.SkinnableComponent
 * @borrows core.behaviours.FormItemBehaviour#_refreshLabel
 * @borrows core.behaviours.FormItemBehaviour#doValidation
 * @borrows core.behaviours.FormItemBehaviour#validate
 * @borrows core.behaviours.FormItemBehaviour#formItemCreateAttributes
 * @borrows core.behaviours.FormItemBehaviour#formItemInit
 * @borrows core.behaviours.FormItemBehaviour#labelNode
 * @constructor
 */
core.helpers.FormItem=Rokkstar.createClass('core.helpers.FormItem','core.SkinnableComponent',function(){

    this.init=function(){
        this.callSuper('init');
        this.formItemInit();
        this.createEventListener('disabledPropertyChanged',this.invalidateSkinState,this);
    }


    this.getSkinState=function(){
        if(this.getDisabled()){
            return 'disabled';
        }else{
            return 'normal';
        }
    }
},[new Attr('label','','string'),new Attr('disabled',false,'boolean')],['core.behaviours.FormItemBehaviour']);