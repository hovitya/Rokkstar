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
 * Displays bitmap image.
 * @name Bitmap
 * @augments core.VisualComponent
 * @package core
 * @component basic
 * @xml
 * The <code><rx:Bitmap></code> tag inherits all the attributes of its superclass,
 * and adds the following attributes:
 * <pre>
 * <rx:Bitmap
 * <b>Properties</b>
 * source=""
 * <b>Events</b>
 * on:onload=""
 * />
 * </pre>
 *
 */
core.Bitmap = Rokkstar.createClass('core.Bitmap', 'core.VisualComponent', function () {
    "use strict";

    this.setSource = function (src) {
        this.domElement.src = src;
    };

    this.getSource = function () {
        return this.domElement.src;
    };

    this.getOriginalWidth = function () {
        return this.domElement.naturalWidth;
    };

    this.getOriginalHeight = function () {
        return this.domElement.naturalHeight;
    };

    this.createDomElement = function () {
        this.domElement = document.createElement('img');
        this.domElement.style[Modernizr.prefixed('boxSizing')] = 'border-box';
        this.domElement.style.position = 'absolute';
        this.domElement.className = "noSelect";
    };

    this.getDrawableSource = function () {
        return this.domElement;
    };

}, [
    new Attr('source', "", "string")
], [], ['core.graphics.IDrawable']);