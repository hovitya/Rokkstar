/* Rokkstar JavaScript Framework
 * 
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @classdef Linear gradient fill.
 * @class
 */
core.graphics.LinearGradientFill = Rokkstar.createClass('core.graphics.LinearGradientFill', 'core.graphics.Fill', function () {

    this.gradientFill = null;
    /**
     *
     * @param {CanvasRenderingContext2D} graphics
     */
    this.applyFill = function (graphics, x, y, boxWidth, boxHeight) {
        if (this.gradientFill == null) {
            var x1 = this.getPointValue(this.getStartX(), boxWidth);
            var y1 = this.getPointValue(this.getStartY(), boxHeight);
            var x2 = this.getPointValue(this.getEndX(), boxWidth);
            var y2 = this.getPointValue(this.getEndY(), boxHeight);
            this.gradientFill = graphics.createLinearGradient(x1 + x, y1 + y, x2 + x, y2 + y);
            var steps = this.getSteps();
            var i = steps.length;
            while (--i >= 0) {
                steps[i].addInto(this.gradientFill);
            }
        }
        graphics.fillStyle = this.gradientFill;
    }

    this.init = function () {
        this.callSuper('init');
        this.createEventListener('stepsPropertyChanged', this._triggerChange, this)
        this.createEventListener('startXPropertyChanged', this._triggerChange, this)
        this.createEventListener('startYPropertyChanged', this._triggerChange, this)
        this.createEventListener('endXPropertyChanged', this._triggerChange, this)
        this.createEventListener('endYPropertyChanged', this._triggerChange, this)
    }

    this._triggerChange = function (event) {
        this.gradientFill = null;
        this.triggerEvent('change');
    }

    this.callFill = function (graphics) {
        graphics.fill();
    }

    this.getPointValue = function (value, referenceValue) {
        if (Rokkstar.globals.regex.percentFormat.test(value)) {
            var percent = parseInt(value.replace('%', '')) / 100.0;
            return Math.round(referenceValue * percent);
        } else if (Rokkstar.globals.regex.pixelFormat.test(value)) {
            return parseInt(value.replace('px', ''));
        } else {
            return parseInt(value);
        }
    }

    this.addElement = function (element) {
        this.steps.push(element);
        this._triggerChange();
    }


}, [new Attr('steps', [], 'array'), new Attr('startX', '50%', 'string'), new Attr('startY', '0', 'string'), new Attr('endX', '50%', 'string'), new Attr('endY', '100%', 'string')]);