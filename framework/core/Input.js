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
    }

});