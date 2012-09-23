/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /**
 * @classdesc
 * The Event class is used as the base class for the creation of Event objects, which are passed as parameters to
 * event listeners when an event occurs.
 * @class
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @version 1.0
 */
core.Event = function () {
    "use strict";

    /**
     * Event type
     * @type {String}
     */
    this.type = null;

    /**
     * Current event target
     * @type {*}
     */
    this.currentTarget = null;

    /**
     * Propagating enabled or disabled
     * @type {Boolean}
     */
    this.isPropagating = true;

    /**
     *
     * @param type
     */
    this.Event = function (type) {
        this.type = type;
    };

    /**
     *
     */
    this.stopPropagation = function () {
    };
};