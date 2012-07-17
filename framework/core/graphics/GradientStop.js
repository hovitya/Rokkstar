/* Rokkstar JavaScript Framework
 * 
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @classdef Represents a gradient stop.
 * @class
 */
core.graphics.GradientStop=Rokkstar.createClass('core.graphics.GradientStop','core.Component',function(){
    /**
     * Add this gradient stop into an existing CanvasGradient object
     * @param {CanvasGradient} gradient
     */
    this.addInto=function(gradient){
        var rgb=Rokkstar.hexToRgb(this.getColor());
        gradient.addColorStop(this.getRatio(),"rgba("+rgb.r+","+rgb.g+","+rgb.b+","+this.getAlpha().toString()+")");
    }
},[new Attr('alpha',1.0,'float'),new Attr('color','#000000','string'),new Attr('ratio',0.0,'float')]);