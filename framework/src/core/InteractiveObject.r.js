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
 * @classdesc
 * The InteractiveObject class is the abstract base class for all display objects with which the user can interact, using the mouse, keyboard, or other user input device.
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @extends core.EventDispatcher
 * @version 1.0
 */
core.InteractiveObject = function () {
    "use strict";

    /**
     * @private
     * @param {Event} event
     */
    this.triggerDOMEvent = function (event) {
        event.stopImmediatePropagation();
        var rokkEvent = new core.Event(event.type, true, true);
        this.triggerEvent(rokkEvent);
    };

    /**
     * @private
     * @type {Object}
     */
    this.registeredDOMEvents = [];

    /**
     * @private
     * @param {String} event
     */
    this.registerDOMEvent = function (event) {
        if (this.registeredDOMEvents.indexOf(event) === -1) {
            this.domElement.addEventListener(event, $.proxy(this.triggerDOMEvent, this));
            this.registeredDOMEvents.push(event);
        }
    };

    this.domElement = null;

    /**
     * @protected
     */
    this.createDomElement = function () {
        this.domElement = document.createElement('div');
        this.domElement.style[Modernizr.prefixed('boxSizing')] = 'border-box';
        this.domElement.style.position = 'absolute';
        this.domElement.className = "noSelect";
    };

    /**
     * @description
     * Overrides createEventListener.
     * @see core.EventDispatcher#createEventListener
     * @override
     * @param {String} event Event name
     * @param {Function} listenerF Function to call
     * @param {Object} scope Scope for callback function
     * @param {Boolean} once Optional. Dismiss the event listener after the first trigger. The default value is false.
     * @param {Boolean} useCapture Optional. Determines whether the listener works in the capture phase or the target and bubbling phases. If useCapture is set to true, the listener processes the event only during the capture phase and not in the target or bubbling phase. If useCapture is false, the listener processes the event only during the target or bubbling phase. To listen for the event in all three phases, call addEventListener twice, once with useCapture set to true, then again with useCapture set to false. The default value is false.
     */
    this.createEventListener = function (event, listenerF, scope, once, useCapture) {
        if (this.domElement === null) { this.createDomElement(); }


        if (Rokkstar.globals.DOMEvents.indexOf(event) !== -1) {
            this.registerDOMEvent(event);
        }
        this.superClass.createEventListener(event, listenerF, scope, once, useCapture);
    };
};