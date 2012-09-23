/**
 * @namespace
 */
var core={};
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @class
 * @classdesc
 * Base object for Rokkstar objects
 */
core.RokkObject = function () {
    "use strict";
    /**
     * Get XML attribute
     * @description
     * Returns <code>fallback</code> value when attribute is not set or the component is not initialized in layout xml.
     * If the <code>data</code> attribute is set it will returns its value.
     * @param {String} data XML attribute name
     * @param {*} fallback Default value when attribute is not set or the component is not initialized in layout xml
     * @return {String}
     */
    this.toString = function () {
        return "[object " + this.__classType + "]";
    };
};