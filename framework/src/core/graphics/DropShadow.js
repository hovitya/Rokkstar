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
 * @name DropShadow
 * @package core.graphics
 * @augments core.graphics.Filter
 *
 */
core.graphics.DropShadow = Rokkstar.createClass('core.graphics.DropShadow', 'core.graphics.Filter', function () {
    "use strict";

    this.init = function () {
        this.callSuper('init');
        this.createEventListener('colorPropertyChanged', this.__triggerChange, this);
        this.createEventListener('dxPropertyChanged', this.__triggerChange, this);
        this.createEventListener('dyPropertyChanged', this.__triggerChange, this);
        this.createEventListener('alphaPropertyChanged', this.__triggerChange, this);
        this.createEventListener('innerPropertyChanged', this.__triggerChange, this);
        this.createEventListener('blurRadiusPropertyChanged', this.__triggerChange, this);
    };

    this.__triggerChange = function () {
        this.triggerEvent('change');
    };

    /**
     *
     * @param {HTMLCanvasElement} graphics
     */
    this.apply = function (canvas) {
        /**
         *
         * @type {HTMLCanvasElement}
         */
        var filterCanvas = document.createElement('canvas'), ctx,
            canvasCtx = canvas.getContext('2d'),
            oldOperation = canvasCtx.globalCompositeOperation,
            oldAlpha = canvasCtx.globalAlpha;
        filterCanvas.width = canvas.width;
        filterCanvas.height = canvas.height;
        ctx = filterCanvas.getContext("2d");
        ctx.fillStyle = this.getColor();
        ctx.fillRect(0, 0, filterCanvas.width, filterCanvas.height);
        if (this.getInner()) {
            ctx.globalCompositeOperation = "xor";
        } else {
            ctx.globalCompositeOperation = "destination-in";
        }
        ctx.drawImage(canvas, this.getDx(), this.getDy());
        stackBlurImage(filterCanvas, this.getBlurRadius(), true);
        if (this.getInner()) {
            canvasCtx.globalCompositeOperation = "source-atop";
        } else {
            canvasCtx.globalCompositeOperation = "destination-over";
        }
        canvasCtx.globalAlpha = this.getAlpha();
        canvasCtx.drawImage(filterCanvas, 0, 0);
        //Restoring canvas original properties
        canvasCtx.globalCompositeOperation = oldOperation;
        canvasCtx.globalAlpha = oldAlpha;
    };
}, [
    new Attr('color', '#FFFFF', 'string'),
    new Attr('alpha', 0.5, 'float'),
    new Attr('dx', 5, 'integer'),
    new Attr('dy', 5, 'integer'),
    new Attr('blurRadius', 10, 'integer'),
    new Attr('inner', false, 'boolean')
]);