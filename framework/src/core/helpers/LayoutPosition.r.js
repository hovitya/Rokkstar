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
 * Helper class for layout positioning.
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @version 1.0
 */
core.helpers.LayoutPosition =  function () {
    "use strict";

    this.left = undefined;
    this.right = undefined;
    this.top = undefined;
    this.bottom = undefined;
    this.width = undefined;
    this.height = undefined;

    this.parentWidth = 0;
    this.parentHeight = 0;
    this.parentPaddingLeft = 0;
    this.parentPaddingRight = 0;
    this.parentPaddingTop = 0;
    this.parentPaddingBottom = 0;

    this.minWidth = NaN;
    this.minHeight = NaN;
    this.maxWidth = NaN;
    this.maxHeight = NaN;


    this.clear = function () {
        this.left = undefined;
        this.right = undefined;
        this.top = undefined;
        this.bottom = undefined;
        this.width = undefined;
        this.height = undefined;
        this.minWidth = NaN;
        this.minHeight = NaN;
        this.maxWidth = NaN;
        this.maxHeight = NaN;
    };

    this.construct = function (parentWidth, parentHeight, parentPaddingLeft, parentPaddingRight, parentPaddingTop, parentPaddingBottom) {
        this.parentWidth = parentWidth;
        this.parentHeight = parentHeight;

        this.parentPaddingLeft = parentPaddingLeft;
        this.parentPaddingRight = parentPaddingRight;
        this.parentPaddingTop = parentPaddingTop;
        this.parentPaddingBottom = parentPaddingBottom;
    };


    this.getPredictedWidth = function () {
        var w = this.width, val, pW;
        if (w !== undefined && w !== null) {
            if (Rokkstar.globals.regex.pixelFormat.test(w)) {
                pW = parseInt(w.replace('px', ''), 10);
            } else if (Rokkstar.globals.regex.percentFormat.test(w)) {
                val = parseFloat(w.replace('%', '')) / 100.0;
                pW = Math.round((this.parentWidth) * val);
            } else {
                return 0;
            }
        } else {
            pW = (this.parentWidth - this.parentPaddingLeft - this.parentPaddingRight - this.left - this.right);
        }

        if (!isNaN(this.minWidth)) {
            pW = Math.max(this.minWidth, pW);
        }

        if (!isNaN(this.maxWidth)) {
            pW = Math.min(this.maxWidth, pW);
        }

        return pW;
    };

    this.getPredictedHeight = function () {
        var h = this.height, val, pH;
        if (h !== undefined && h !== null) {
            if (Rokkstar.globals.regex.pixelFormat.test(h)) {
                pH = parseInt(h.replace('px', ''), 10);
            } else if (Rokkstar.globals.regex.percentFormat.test(h)) {
                val = parseFloat(h.replace('%', '')) / 100.0;
                pH = Math.round((this.parentHeight) * val);
            } else {
                return 0;
            }
        } else {
            pH = (this.parentHeight - this.parentPaddingTop - this.parentPaddingBottom - this.top - this.bottom);
        }

        if (!isNaN(this.minHeight)) {
            pH = Math.max(this.minWidth, pH);
        }

        if (!isNaN(this.maxHeight)) {
            pH = Math.min(this.maxWidth, pH);
        }

        return pH;

    };

    /**
     *
     * @param {core.VisualComponent} element
     */
    this.apply = function (element) {
        if (this.width !== undefined && this.width !== null) {
            element.domElement.style.width = this.getPredictedWidth() + "px";
        } else {
            element.domElement.style.width = '';
        }

        if (this.height !== undefined && this.height !== null) {
            element.domElement.style.height = this.getPredictedHeight() + "px";
        } else {
            element.domElement.style.height = '';
        }

        if (this.top !== undefined) {
            element.domElement.style.top = this.top + "px";
        } else {
            element.domElement.style.top = '';
        }

        if (this.bottom !== undefined) {
            element.domElement.style.bottom = this.bottom + "px";
        } else {
            element.domElement.style.bottom = '';
        }

        if (this.left !== undefined) {
            element.domElement.style.left = this.left + "px";
        } else {
            element.domElement.style.left = '';
        }

        if (this.right !== undefined) {
            element.domElement.style.right = this.right + "px";
        } else {
            element.domElement.style.right = '';
        }
    };

};