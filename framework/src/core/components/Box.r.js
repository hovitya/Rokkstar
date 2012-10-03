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
 * @classdesc
 * Visual box object. Alternative to core.graphics.Rectangle. It is rendered much more faster then rectangle, so use it
 * for UI design.
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @extends core.VisualComponent
 * @version 1.0
 */
core.Box = function () {
    "use strict";

    /**
     * @override
     */
    this.init = function () {
        this.superClass.init();

        //Shadow listeners
        this.createEventListener('shadowPropertyChanged', this.invalidateShadow, this);
        this.createEventListener('shadowOffsetXPropertyChanged', this.invalidateShadow, this);
        this.createEventListener('shadowOffsetYPropertyChanged', this.invalidateShadow, this);
        this.createEventListener('shadowSpreadPropertyChanged', this.invalidateShadow, this);
        this.createEventListener('shadowInsetPropertyChanged', this.invalidateShadow, this);
        this.createEventListener('shadowAlphaPropertyChanged', this.invalidateShadow, this);
        this.createEventListener('shadowColorPropertyChanged', this.invalidateShadow, this);

        //Background listeners
        this.createEventListener('backgroundColorPropertyChanged', this.invalidateBackground, this);
        this.createEventListener('backgroundAlphaPropertyChanged', this.invalidateBackground, this);
        this.createEventListener('gradientModePropertyChanged', this.invalidateBackground, this);
        this.createEventListener('gradientStartPropertyChanged', this.invalidateBackground, this);
        this.createEventListener('gradientEndPropertyChanged', this.invalidateBackground, this);
        this.createEventListener('gradientAlphaStartPropertyChanged', this.invalidateBackground, this);
        this.createEventListener('gradientAlphaEndPropertyChanged', this.invalidateBackground, this);

        //Border listeners
        this.createEventListener('borderColorPropertyChanged', this.invalidateBorder, this);
        this.createEventListener('borderAlphaPropertyChanged', this.invalidateBorder, this);
        this.createEventListener('cornerPropertyChanged', this.invalidateBorder, this);
        this.createEventListener('topLeftCornerPropertyChanged', this.invalidateBorder, this);
        this.createEventListener('topRightCornerPropertyChanged', this.invalidateBorder, this);
        this.createEventListener('bottomLeftCornerPropertyChanged', this.invalidateBorder, this);
        this.createEventListener('bottomRightCornerPropertyChanged', this.invalidateBorder, this);
    };

    /**
     * @override
     */
    this.commitProperties = function () {
        this.superClass.commitProperties();
        if (this.shadowInvalid) {
            this.refreshShadow();
            this.shadowInvalid = false;
        }
        if (this.borderInvalid) {
            this.refreshBorder();
            this.borderInvalid = false;
        }

        if (this.backgroundInvalid) {
            this.refreshBackground();
            this.backgroundInvalid = false;
        }
    };

    /**
     * @private
     * @type {Boolean}
     */
    this.shadowInvalid = true;

    /**
     * Invalidates shadow
     * @protected
     */
    this.invalidateShadow = function () {
        this.shadowInvalid = true;
        this.invalidateProperties();
    };

    /**
     * Redraw component shadow
     * @protected
     */
    this.refreshShadow = function () {
        //Apply shadow
        var shadow, rgb;
        if (!this.shadow) {
            this.domElement.style[Modernizr.prefixed('boxShadow')] = 'none';
        } else {
            if (!this.shadowInset) {
                shadow = "";
            } else {
                shadow = "inset ";
            }
            shadow = shadow + this.shadowOffsetX.toString() + "px " + this.shadowOffsetY.toString() + "px " + this.shadowBlur.toString() + "px " + this.shadowSpread + "px rgba(";
            rgb = Rokkstar.hexToRgb(this.shadowColor);
            shadow = shadow + rgb.r + "," + rgb.g + "," + rgb.b + "," + this.shadowAlpha.toString() + ")";
            this.domElement.style[Modernizr.prefixed('boxShadow')] = shadow;
        }

    };

    /**
     * @private
     * @type {Boolean}
     */
    this.backgroundInvalid = true;

    /**
     * @protected
     */
    this.invalidateBackground = function () {
        this.backgroundInvalid = true;
        this.invalidateProperties();
    };

    /**
     * Refresh background color.
     * @protected
     */
    this.refreshBackground = function () {
        var opacity, color1, color2, colorRgb, colorRgb2, startStr, endStr, rgb;
        if (this.gradientMode) {
            colorRgb = Rokkstar.hexToRgb(this.gradientStart);
            startStr = "rgba(" + colorRgb.r + "," + colorRgb.g + "," + colorRgb.b + "," + this.gradientAlphaStart.toString() + ")";
            colorRgb2 = Rokkstar.hexToRgb(this.gradientEnd);
            endStr = "rgba(" + colorRgb2.r + "," + colorRgb2.g + "," + colorRgb2.b + "," + this.gradientAlphaEnd.toString() + ")";
            if (BrowserDetect.browser === "Firefox") {
                this.domElement.style.background = "-moz-linear-gradient(top,  " + startStr + ",  " + endStr + ")";
            } else if (BrowserDetect.browser === "Opera") {
                this.domElement.style.background = "-o-linear-gradient(top,  " + startStr + ",  " + endStr + ")";
            } else if (BrowserDetect.browser === "Explorer") {
                //Convert to ARGB
                colorRgb = Rokkstar.hexToRgb(this.gradientEnd);
                opacity = this.gradientAlphaStart * 100;
                color1 = '#' + colorRgb.r.toString(16) + colorRgb.g.toString(16) + colorRgb.b.toString(16) + opacity.toString(16);
                colorRgb = Rokkstar.hexToRgb(this.gradientEnd);
                opacity = this.gradientAlphaEnd * 100;
                color2 = '#' + colorRgb.r.toString(16) + colorRgb.g.toString(16) + colorRgb.b.toString(16) + opacity.toString(16);
                this.domElement.style[Modernizr.prefixed('filter')] = "progid:DXImageTransform.Microsoft.gradient(startColorstr=" + color1 + ", endColorstr=" + color2 + ")";
            } else {
                this.domElement.style.background = "-webkit-gradient(linear, left top, left bottom,  from(" + startStr + "),  to(" + endStr + "))";
            }
        } else if (this.backgroundAlpha === 0.0) {
            this.domElement.style.background = 'none';
        } else {
            rgb = Rokkstar.hexToRgb(this.backgroundColor);
            this.domElement.style.background = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + this.backgroundAlpha.toString() + ")";
        }
    };

    /**
     * @private
     * @type {Boolean}
     */
    this.borderInvalid = true;

    /**
     * @protected
     */
    this.invalidateBorder = function () {
        this.borderInvalid = true;
        this.invalidateProperties();
    };

    /**
     * Refresh border color and type.
     * @protected
     */
    this.refreshBorder = function () {

        //Corner roundness
        var corner = this.corner,
            topLeftCorner = this.topLeftCorner,
            topRightCorner = this.topRightCorner,
            bottomLeftCorner = this.bottomLeftCorner,
            bottomRightCorner = this.bottomRightCorner,
            rgb;
        if (topLeftCorner < 0) { topLeftCorner = corner; }
        if (topRightCorner < 0) { topRightCorner = corner; }
        if (bottomLeftCorner < 0) { bottomLeftCorner = corner; }
        if (bottomRightCorner < 0) { bottomRightCorner = corner; }

        if (this.borderAlpha === 0.0) {
            this.domElement.style.border = 'none';
        } else {
            rgb = Rokkstar.hexToRgb(this.borderColor);
            this.domElement.style[Modernizr.prefixed('backgroundClip')] = 'border-box';
            this.domElement.style.borderColor = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + this.borderAlpha.toString() + ")";
            this.domElement.style.borderWidth = this.borderWidth + "px";
            this.domElement.style.borderStyle = "solid";
        }
        this.domElement.style[Modernizr.prefixed('borderBottomLeftRadius')] = bottomLeftCorner.toString() + "px";
        this.domElement.style[Modernizr.prefixed('borderBottomRightRadius')] = bottomRightCorner.toString() + "px";
        this.domElement.style[Modernizr.prefixed('borderTopLeftRadius')] = topLeftCorner.toString() + "px";
        this.domElement.style[Modernizr.prefixed('borderTopRightRadius')] = topRightCorner.toString() + "px";
    };

    /**
     * Enables drop shadow. Default is false.
     * @bindable
     * @type {Boolean}
     */
    this.shadow = false;

    /**
     * Horizontal shadow offset. Default is 2.
     * @bindable
     * @type {Number}
     */
    this.shadowOffsetX = 2;

    /**
     * Vertical shadow offset. Default is 2.
     * @bindable
     * @type {Number}
     */
    this.shadowOffsetY = 2;

    /**
     * Sets shadow blurring rate. Default is 2.0.
     * @bindable
     * @type {Number}
     */
    this.shadowBlur = 2.0;

    /**
     * Hexadecimal representation of shadow color. Default is #000000.
     * @bindable
     * @type {String}
     */
    this.shadowColor = "#000000";

    /**
     * Sets shadow opacity. Default is 0.5.
     * @bindable
     * @type {Number}
     */
    this.shadowAlpha = 0.5;

    /**
     * Shadow inset. Default is false.
     * @bindable
     * @type {Boolean}
     */
    this.shadowInset = false;

    /**
     * Shadow spread value. Default is 0.
     * @bindable
     * @type {Number}
     */
    this.shadowSpread = 0;

    /**
     * Border alpha value. Default is 1.0.
     * @bindable
     * @type {Number}
     */
    this.borderAlpha = 1.0;

    /**
     * Border color. Default is #000000.
     * @bindable
     * @type {String}
     */
    this.borderColor = '#000000';

    /**
     * Border width. Default is 1.
     * @bindable
     * @type {Number}
     */
    this.borderWidth = 1;

    /**
     * Box background color in hexadecimal representation. Default is #FFFFFF.
     * @bindable
     * @type {String}
     */
    this.backgroundColor = "#FFFFFF";

    /**
     * Background alpha. Default is 1.0.
     * @bindable
     * @type {Number}
     */
    this.backgroundAlpha = 1.0;

    /**
     * Enables background gradient. Default is false.
     * @bindable
     * @type {Boolean}
     */
    this.gradientMode = false;

    /**
     * Gradient start color in hexadecimal format. Default is #FFFFFF.
     * @bindable
     * @type {String}
     */
    this.gradientStart = "#FFFFFF";

    /**
     * Gradient end color in hexadecimal format. Default is #000000.
     * @bindable
     * @type {String}
     */
    this.gradientEnd = "#000000";

    /**
     * Gradient start alpha value. Default is 1.0.
     * @bindable
     * @type {Number}
     */
    this.gradientAlphaStart = 1.0;

    /**
     * Gradient end alpha value. Default is 1.0.
     * @bindable
     * @type {Number}
     */
    this.gradientAlphaEnd = 1.0;

    /**
     * Corner radius. Default is 0.
     * @bindable
     * @type {Number}
     */
    this.corner = 0;

    /**
     * Top left radius. Default is -1.
     * @bindable
     * @type {Number}
     */
    this.topLeftCorner = -1;

    /**
     * Top right radius. Default is -1.
     * @bindable
     * @type {Number}
     */
    this.topRightCorner = -1;

    /**
     * Bottom left radius. Default is -1.
     * @bindable
     * @type {Number}
     */
    this.bottomLeftCorner = -1;

    /**
     * Bottom right radius. Default is -1.
     * @bindable
     * @type {Number}
     */
    this.bottomRightCorner = -1;
};