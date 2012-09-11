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
 * @name RendererExistenceEvent
 * @package core.events
 */
core.events.RendererExistenceEvent = Rokkstar.createClass('core.events.RendererExistenceEvent', 'core.Event', function () {
    "use strict";
    this.data = null;
    this.index = -1;
    this.renderer = null;
    this.construct = function (type, data, index, renderer) {
        this.callSuper('construct', type);
        this.data = data;
        this.index = index;
        this.renderer = renderer;
    };
});