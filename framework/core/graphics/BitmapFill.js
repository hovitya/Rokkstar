/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 *
 * @class
 * @classdesc
 * Fills the shape with image.
 * @name BitmapFill
 * @augments core.graphics.Fill
 * @package core.graphics
 * @component graphics
 * @xml
 * The <code><rg:BitmapFill></code> tag inherits all the attributes of its superclass,
 * and adds the following attributes:
 * <pre>
 * <rg:BitmapFill
 * <b>Properties</b>
 * <b>Events</b>
 * />
 * </pre>
 *
 */
core.graphics.BitmapFill = Rokkstar.createClass('core.graphics.BitmapFill', 'core.graphics.Fill', function () {
    "use strict";

    /**
     *
     * @param {CanvasRenderingContext2D} graphics
     */
    this.applyFill = function (graphics) {
        graphics.fillStyle = "#000000";
    };

    /**
     *
     * @param {CanvasRenderingContext2D} graphics
     */
    this.callFill = function (graphics, x, y, w, h) {
        if (this.getSource() !== undefined && this.getSource() !== null) {
            var oldAlpha = graphics.globalAlpha,
                oldOperation = graphics.globalCompositeOperation;
            graphics.fill();
            graphics.globalAlpha = 1.0;
            graphics.globalCompositeOperation = "source-atop";
            graphics.drawImage(this.getSource().getDrawableSource(), x, y, w, h);
            graphics.globalCompositeOperation = oldOperation;
            graphics.globalAlpha = oldAlpha;
        }
    };

    this._triggerChange = function (event) {
        this.triggerEvent('change');
    };

}, [
    new Attr("source", undefined, "core.graphics.IDrawable")
]);