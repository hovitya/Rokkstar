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
 * @name ResponseEvent
 * @package core.network.events
 */
core.network.events.ResponseEvent = Rokkstar.createClass('core.network.events.ResponseEvent', 'core.Event', function () {
    this.jqXHR = null;
    this.textStatus = null;
});