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
 * Application is the base class for every Rokkstar application.
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @extends core.VisualContainer
 * @version 1.0
 */
core.components.Application = function () {
    "use strict";
    /**
     * @override
     */
    this.init = function () {
        this.superClass.init();
        $(this.domElement).css({left: '0px', right: '0px', top: '0px', bottom: '0px'});
        this.invalidateSize();
        var target = this;
        this.callTick = function () {
            target.tick();
        };
        $(window).bind('resize', $.proxy(function () {
            this.invalidateSize();
        }, this));
    };

    /**
     * @private
     * @type {Number}
     */
    this.processId = -1;

    /**
     * @public
     * Starts application.
     */
    this.start = function () {
        this.processId = setTimeout(this.callTick, Math.round(1000 / parseInt(this.fps, 10)));
    };

    this.callTick = null;


    this.tick = function () {
        var time = Rokkstar.GetMicrotime(), elapsed;

        this.tack();

        elapsed = (Rokkstar.GetMicrotime() - time) * 1000.0;
        this.processId = setTimeout(this.callTick, Math.round(1000.0 / parseFloat(this.fps, 10) - elapsed));
    };


    this.tack = function () {
        if (this.componentInvalid) {
            //console.profile();
            this.superClass.tack();
            //console.profileEnd();
        }
    };

    /**
     * Display redraw rate. Default is 24.
     * @type {Number}
     */
    this.fps = 24;

    /**
     * Current host device type.
     * Correct values are desktop,mobile.
     * @bindable
     * @type {String}
     */
    this.device = "desktop";

    /**
     * Current display orientation.
     * Correct values are portrait,landscape.
     * @bindable
     * @type {String}
     */
    this.orientation = "portrait";
};