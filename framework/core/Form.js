/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.SkinnableContainer
 * @borrows core.behaviours.FormItemBehaviour#_refreshLabel
 * @borrows core.behaviours.FormItemBehaviour#doValidation
 * @borrows core.behaviours.FormItemBehaviour#validate
 * @borrows core.behaviours.FormItemBehaviour#formItemCreateAttributes
 * @borrows core.behaviours.FormItemBehaviour#formItemInit
 * @borrows core.behaviours.FormItemBehaviour#labelNode
 * @constructor
 */
core.Form=Rokkstar.createClass('core.Form','core.SkinnableContainer',function(){

    this.init=function(){
        this.callSuper('init');
        this.formItemInit();
    }

},[new Attr('label','','string'),new Attr('disabled',false,'boolean')],['core.behaviours.FormItemBehaviour']);