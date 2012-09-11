/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 *
 * @class
 * @classdesc
 * Fade the target component in or out by modifying the alpha property.
 * @name Fade
 * @augments core.PropertyAnimation
 * @package core.animations
 * @component animation
 * @xml
 * The <code><rx:Fade></code> tag inherits all the attributes of its superclass,
 * and adds the following attributes:
 * <pre>
 * <rx:Fade
 * <b>Properties</b>
 * <b>Events</b>
 * />
 * </pre>
 *
 */
core.animations.Fade = Rokkstar.createClass('core.animations.Fade', 'core.PropertyAnimation', function () {
    "use strict";

    this.construct = function () {
        this.callSuper('construct', 'alpha');
    };
});