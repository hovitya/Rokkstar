/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Creates new JQueryProxy object.
 * @constructor
 */
core.RokkObject = Rokkstar.createClass('core.RokkObject', undefined, function () {
    "use strict";

    this.toString = function () {
        return "[object " + this.__classType + "]";
    };
});