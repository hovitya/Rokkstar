/* Rokkstar JavaScript Framework
 * 
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @classdef Solid color fill.
 * @class
 */
core.graphics.SolidColorFill = Rokkstar.createClass('core.graphics.SolidColorFill', 'core.graphics.Fill', function () {
    /**
     *
     * @param {CanvasRenderingContext2D} graphics
     */
    this.applyFill=function(graphics){
        var rgb=Rokkstar.hexToRgb(this.getColor());
        //console.log("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+this.getAlpha().toString()+")");
        graphics.fillStyle="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+this.getAlpha().toString()+")";
    }

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('colorPropertyChanged',this._triggerChange,this)
        this.createEventListener('alphaPropertyChanged',this._triggerChange,this)
    }

    this._triggerChange=function(event){
        this.triggerEvent('change');
    }

    this.callFill=function(graphics){
        graphics.fill();
    }

},[new Attr('color','#000000','string'),new Attr('alpha',1.0,'float')]);