/* Rokkstar JavaScript Framework
 * 
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @class
 * @augments core.graphics.GraphicsElement
 */
core.graphics.Ellipse = Rokkstar.createClass('core.graphics.Ellipse', 'core.graphics.GraphicsElement', function () {
    /**
     *
     * @param {CanvasRenderingContext2D} graphics
     */
    this.draw=function(graphics){
        var x=0;
        var y=0;
        var w=this.measuredWidth;
        var h=this.measuredHeight;
        var kappa = .5522848;
        var ox = (w / 2) * kappa,
            oy = (h / 2) * kappa,
            xe = x + w,
            ye = y + h,
            xm = x + w / 2,
            ym = y + h / 2;

        graphics.beginPath();
        graphics.moveTo(x, ym);
        graphics.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        graphics.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        graphics.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        graphics.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        graphics.closePath();
        graphics.stroke();
    }
});