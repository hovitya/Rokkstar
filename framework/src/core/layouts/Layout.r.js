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
 * Base class for layout manager objects.
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @extends core.Component
 * @version 1.0
 */
core.layouts.Layout = function () {
    "use strict";
    this.lastDiv = null;

    /**
     * Left padding
     * @bindable
     * @type {Number}
     */
    this.paddingLeft = 0;

    /**
     * Right padding
     * @bindable
     * @type {Number}
     */
    this.paddingRight = 0;

    /**
     * Top padding
     * @bindable
     * @type {Number}
     */
    this.paddingTop = 0;

    /**
     * Bottom padding
     * @bindable
     * @type {Number}
     */
    this.paddingBottom = 0;

    this.init = function () {
        this.superClass.init();
        //this.createEventListener('paddingLeftPropertyChanged',this.);
        this.createEventListener('paddingLeftPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('paddingRightPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('paddingTopPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('paddingBottomPropertyChanged', this.selfRefreshLayout, this);
    };

    /**
     * Refresh layout listener
     * @param {core.Event} event Event object
     * @private
     */
    this.selfRefreshLayout = function (event) {
        //event.stopPropagation();
        if (this.lastDiv !== null) {
            //TODO: Replace this with event handling (one layout - multiple group case)
            //this.doLayout(this.lastDiv);
            this.lastDiv.invalidateLayout();
        }
    };

    /**
     * Applies layout to given div.
     * @param {core.VisualContainer} div The layout object applies layout format to this div.
     */
    this.doLayout = function (div) {
        this.lastDiv = div;
    };

    /**
     * Convert width and height data to css string
     * @param {String} data
     * @param {Number} referenceValue
     * @param {Number} paddingA
     * @param {Number} paddingB
     * @return {String}
     */
    this.stringToPixel = function (data, referenceValue, paddingA, paddingB) {
        var percentRegexp = /^[0-9]+%$/,
            pxRegexp = /^[0-9]+px$/,
            p,
            padding;
        if (data === 'auto') {
            return 'auto';
        } else if (percentRegexp.test(data)) {
            p = parseInt(data.replace('%', ''), 10);
            padding = Math.round((((parseFloat(paddingA) + parseFloat(paddingB)) / parseFloat(referenceValue))) * 100);
            return (p - padding) + '%';
        } else if (pxRegexp.test(data)) {
            //return parseInt(data.replace('px',''));
            return data;
        } else {
            return parseInt(data, 10);
        }

    };


};