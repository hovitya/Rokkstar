/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Create base layout object.
 * @author Horváth Viktor
 * @classdef All Layout classes have to extend this class.
 * @augments core.Component
 * @constructor
 */
core.layouts.Layout = Rokkstar.createClass('core.layouts.Layout', 'core.Component', function () {
    "use strict";
    this.lastDiv = null;


    this.init = function () {


        this.callSuper('init');
        //this.createEventListener('paddingLeftPropertyChanged',this.);
        this.createEventListener('paddingLeftPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('paddingRightPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('paddingTopPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('paddingBottomPropertyChanged', this.selfRefreshLayout, this);
    };

    /**
     * Refresh layout listener
     * @event
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
     * Applies layout to div.
     * @param {core.VisualContainer} div The layout object applies layout format to this div.
     */
    this.doLayout = function (div) {
        this.lastDiv = div;

    };


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


}, [new Attr('paddingLeft', 0, 'integer'), new Attr('paddingRight', 0, 'integer'), new Attr('paddingTop', 0, 'integer'), new Attr('paddingBottom', 0, 'integer')]);