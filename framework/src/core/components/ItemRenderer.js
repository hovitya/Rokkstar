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
 * @name ItemRenderer
 * @package core.components
 */
core.components.ItemRenderer = Rokkstar.createClass('core.components.ItemRenderer', 'core.Group', function () {
    "use strict";

    this.init = function () {
        this.callSuper('init');
        this.createEventListener("mouseover", this.buttonMouseEnter, this);
        this.createEventListener("mouseout", this.buttonMouseLeave, this);
        this.createEventListener("blur", this.buttonMouseLeave, this);
        this.createEventListener("mouseup", this.buttonMouseUp, this);
        this.createEventListener("mousedown", this.buttonMouseDown, this);
        this.createEventListener("touchend", this.buttonMouseUp, this);
        this.createEventListener("touchstart", this.buttonMouseDown, this);
    };

    this.rendererStateInvalid = false;
    this.mouseOver = false;
    this.mouseDown = false;

    this.invalidateRendererState = function () {
        this.rendererStateInvalid = true;
        this.invalidateProperties();
    };

    this.buttonMouseEnter = function (event) {
        this.mouseOver = true;
        this.invalidateRendererState();
    };

    this.buttonMouseLeave = function (event) {
        this.mouseOver = false;
        this.mouseDown = false;
        this.invalidateRendererState();
    };

    this.buttonMouseDown = function (event) {
        this.mouseDown = true;
        this.invalidateRendererState();
    };

    this.buttonMouseUp = function (event) {
        this.mouseDown = false;
        this.invalidateRendererState();
        this.triggerEvent('click');
    };

    this.commitProperties = function () {
        this.callSuper('commitProperties');
        if (this.rendererStateInvalid) {
            var postfix = "",
                state = "up";
            this.rendererStateInvalid = false;
            if (this.getSelected()) {
                postfix = "AndSelected";
            }
            if (this.mouseDown) {
                state = "down";
            } else if (this.mouseOver) {
                state = "over";
            }
            //Trying postfixed version
            if (this.hasState(state + postfix)) {
                this.setCurrentState(state + postfix);
            } else if (this.hasState(state)) {
                this.setCurrentState(state);
            }
        }
    };

}, [
    new Attr('data', null, 'object'),
    new Attr('selected', false, 'boolean')
]);