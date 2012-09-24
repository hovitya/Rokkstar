/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /**
 * @classdesc
 * The Event class is used as the base class for the creation of Event objects, which are passed as parameters to
 * event listeners when an event occurs.
 * @class
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @version 1.0
 */
core.Event = function () {
    "use strict";

    /**
     * Event type
     * @type {String}
     */
    this.type = null;

    /**
     *
     * @type {Number}
     */
    this.eventPhase = 0;

    /**
     * The current phase in the event flow.
     * @type {*}
     */
    this.target = null;

    /**
     * The object that is actively processing the Event object with an event listener.
     * @type {*}
     */
    this.currentTarget = null;

    /**
     * Indicates whether an event is a bubbling event.
     * @type {Boolean}
     */
    this.bubbles = true;

    /**
     * Indicates whether the behavior associated with the event can be prevented.
     * @type {Boolean}
     */
    this.cancelable = true;

    /**
     * Original event target
     * @type {*}
     */
    this.target = null;

    /**
     * Propagating enabled or disabled
     * @type {Boolean}
     */
    this.isPropagating = true;

    /**
     * Immediate propagating enabled or disabled
     * @type {Boolean}
     */
    this.isImmediatePropagating = true;

    /**
     * Is default behaviour cancelled
     * @private
     * @type {Boolean}
     */
    this.isCancelled = true;

    /**
     * Creates new Event instance .
     * @param {String} type The type of the event, accessible as Event.type.
     * @param {Boolean} bubbles Optional. Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
     * @param {Boolean} cancelable Optional Determines whether the Event object can be canceled. The default value is false.
     */
    this.Event = function (type, bubbles, cancelable) {
        this.type = type;

        if (bubbles === undefined) {
            this.bubbles = false;
        } else {
            this.bubbles = bubbles;
        }

        if (cancelable === undefined) {
            this.cancelable = false;
        } else {
            this.cancelable = cancelable;
        }
    };

    /**
     *  Prevents processing of any event listeners in nodes subsequent to the current node in the event flow.
     */
    this.stopPropagation = function () {
        this.isPropagating = false;
    };

    /**
     *  Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
     */
    this.stopImmediatePropagation = function () {
        this.isImmediatePropagating = false;
    };

    /**
     *  Cancels an event's default behavior if that behavior can be canceled.
     */
    this.preventDefault = function () {
        if (this.cancelable) {
            this.isCancelled = true;
        }
    };

    /**
     * Checks whether the preventDefault() method has been called on the event.
     * @return {Boolean}
     */
    this.isDefaultPrevented = function () {
        if (!this.cancelable) {
            return false;
        }
        return this.isCancelled;
    };
};