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
 * @name PropertyChangeEvent
 * @augments core.Event
 * @package core.events
 */
core.events.PropertyChangeEvent = Rokkstar.createClass('core.events.PropertyChangeEvent', 'core.Event', function () {
    this.oldValue = null;
    this.newValue = null;
    this.propertyName = null;

    this.construct = function (type, oldValue, newValue, propName) {
        this.callSuper('construct', type);
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.propertyName = propName;
    }
});