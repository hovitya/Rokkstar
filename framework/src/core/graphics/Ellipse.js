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
 * @augments core.graphics.ClosedGraphicsElement
 */
core.graphics.Ellipse = Rokkstar.createClass('core.graphics.Ellipse', 'core.graphics.ClosedGraphicsElement', function () {
    "use strict";

    /**
     *
     * @param {CanvasRenderingContext2D} graphics
     */
    this.drawPath = function (graphics, x, y, w, h) {
        var kappa = 0.5522848,
            ox = (w / 2) * kappa,
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
    };
});