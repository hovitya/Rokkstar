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
 * @name CursorEvent
 * @package core.data.events
 */
core.data.events.CursorEvent = Rokkstar.createClass('core.data.events.CursorEvent', 'core.Event', function () {
    this.oldLocation = -1;
    this.newLocation = -1;
    this.construct = function (type, newLocation, oldLocation) {
        this.callSuper('construct', type);
        this.newLocation = newLocation;
        this.oldLocation = oldLocation;
    }
});