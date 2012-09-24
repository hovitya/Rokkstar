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
 * Super class for event handlers.
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @version 1.0
 */
core.events.EventPhase = function () {
    "use strict";

    /**
     * Capture phase.
     * @static
     * @type {Number}
     */
    this.CAPTURE_PHASE = 0;

    /**
     * Target phase.
     * @static
     * @type {Number}
     */
    this.AT_TARGET = 1;

    /**
     * Bubbling phase.
     * @static
     * @type {Number}
     */
    this.BUBBLING_PHASE = 2;
};