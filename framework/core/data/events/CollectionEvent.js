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
 * @name CollectionEvent
 * @package core.data.events
 */
core.data.events.CollectionEvent = Rokkstar.createClass('core.data.events.CollectionEvent', 'core.Event', function () {
    this.kind = undefined;
    this.location = -1;
    this.oldLocation = -1;
    this.items = null;

    /**
     * @constructor
     * @param type
     * @param kind
     * @param location
     * @param oldLocation
     * @param items
     */
    this.construct = function (type, kind, location, oldLocation, items) {
        this.callSuper('construct', type);
        this.kind = kind;
        if (location != undefined) this.location = location;
        if (location != undefined) this.oldLocation = oldLocation;
        if (location != undefined) this.items = items;
    }
});
