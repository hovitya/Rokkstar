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
 * Super class for event handlers.
 * @implements core.IEventDispatcher
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @version 1.0
 */
core.EventDispatcher = function () {
    "use strict";

    /**
     * @private
     * @type {Object}
     */
    this.handlers = {};



    /**
     * Create new EventDispatcher instance.
     */
    this.EventDispatcher = function () {
    };


    /**
     * Register new event handler.
     * @description
     * When the EventDispatcher object triggers this <code>event</code> the given function will be called within the
     * given scope. The function will be called every time when the event is triggered until the event won't be removed.
     * <code>
     *      myEventDispatcher.createEventListener('layoutChange',this.onLayoutChange,this);
     * </code>
     * @param {String} event Event name
     * @param {Function} listenerF Function to call
     * @param {Object} scope Scope for callback function
     * @param {Boolean} once Optional. Dismiss the event listener after the first trigger. The default value is false.
     * @param {Boolean} useCapture Optional. Determines whether the listener works in the capture phase or the target and bubbling phases. If useCapture is set to true, the listener processes the event only during the capture phase and not in the target or bubbling phase. If useCapture is false, the listener processes the event only during the target or bubbling phase. To listen for the event in all three phases, call addEventListener twice, once with useCapture set to true, then again with useCapture set to false. The default value is false.
     */
    this.createEventListener = function (event, listenerF, scope, once, useCapture) {
        if (once === undefined) {
            once = false;
        }
        if (useCapture === undefined) {
            useCapture = false;
        }

        if (this.handlers[event] === undefined) {
            this.handlers[event] = [];
        }
        this.handlers[event].push({func: listenerF, scope: scope, once: once, useCapture: useCapture});
    };

    /**
     * Alias for createEvent listener
     * @param {String} event Event name
     * @param {Function} listenerF Function to call
     * @param {Object} scope Scope for callback function
     * @param {Boolean} once Optional. Dismiss the event listener after the first trigger. The default value is false.
     * @param {Boolean} useCapture Optional. Determines whether the listener works in the capture phase or the target and bubbling phases. If useCapture is set to true, the listener processes the event only during the capture phase and not in the target or bubbling phase. If useCapture is false, the listener processes the event only during the target or bubbling phase. To listen for the event in all three phases, call addEventListener twice, once with useCapture set to true, then again with useCapture set to false. The default value is false.
     */
    this.addEventListener  = function (event, listenerF, scope, once, useCapture) {
        this.createEventListener(event, listenerF, scope, once, useCapture);
    };



    /**
     * Alias for trigger event.
     * @param {core.Event} event
     */
    this.dispatchEvent = function (event) {
        this.triggerEvent(event);
    };



    /**
     * Triggers new event.
     * @description
     * Triggers the named event. Every event handler which is registered to the named event will be called.
     * <code>
     *      myEventDispatcher.triggerEvent('layoutChanged');
     * </code>
     * @param {String|core.Event} event Event name.
     */
    this.triggerEvent = function (event) {
        if (typeof event === "string") {
            event = new core.Event(event, false, false);
        }
        event.target = this;

        //Collect activation list
        var lastParent = this.getPropagationParent(),
            activationList = [],
            j = 0;
        while (lastParent !== null && lastParent !== undefined) {
            activationList.push(lastParent);
            lastParent = lastParent.getPropagationParent();
        }

        //Capture phase
        event.eventPhase = core.events.EventPhase.CAPTURE_PHASE;
        j = activationList.length;
        while (j > 0) {
            j = j - 1;
            activationList[j].executeHandlers(event);
            if (!event.isImmediatePropagating || !event.isPropagating) {
                break;
            }
        }

        //At target
        if (event.isImmediatePropagating && event.isPropagating) {
            event.eventPhase = core.events.EventPhase.AT_TARGET;
            this.executeHandlers(event);
        }

        //Bubble phase
        if (event.bubbles && event.isImmediatePropagating && event.isPropagating) {
            event.eventPhase = core.events.EventPhase.BUBBLING_PHASE;
            j = 0;
            while (j < activationList.length) {
                activationList[j].executeHandlers(event);
                if (!event.isImmediatePropagating || !event.isPropagating) {
                    break;
                }
                j = j + 1;
            }
        }
    };

    /**
     * Override this method if you want to create propagation list.
     * @protected
     * @return {core.EventDispatcher}
     */
    this.getPropagationParent = function () {
        return null;
    };

    /**
     * Executes handlers assigned to this event.
     * @param {core.Event} event
     */
    this.executeHandlers = function (event) {
        var handlers = this.handlers[event.type],
            remove = [],
            i;
        event.currentTarget = this;
        if (handlers !== undefined && handlers !== null) {
            i = handlers.length;
            while (--i >= 0) {
                if (event.eventPhase === core.events.EventPhase.CAPTURE_PHASE && handlers[i].useCapture) {
                    handlers[i].func.apply(handlers[i].scope, [event]);
                } else if (!handlers[i].useCapture && (event.eventPhase === core.events.EventPhase.BUBBLING_PHASE || event.eventPhase === core.events.EventPhase.AT_TARGET)) {
                    handlers[i].func.apply(handlers[i].scope, [event]);
                }
                if (handlers[i].once) {
                    remove.push(handlers[i]);
                }
                if (!event.isImmediatePropagating) {
                    break;
                }
            }
            i = remove.length;
            while (--i >= 0) {
                this.handlers[event.type].splice(this.handlers[event.type].indexOf(remove[i]), 1);
            }
        }
    };


    /**
     * @description
     * The specified handler will be removed and never will be called again.
     * @param event
     * @param listener
     * @param scope
     */
    this.deleteEventListener = function (event, listener, scope) {
        var eventsToRemove = [],
            i;
        if (this.handlers[event] !== undefined && this.handlers[event] !== null) {
            //Search events to delete
            for (i in this.handlers[event]) {
                if (this.handlers[event].hasOwnProperty(i)) {
                    if (this.handlers[event][i].func === listener && this.handlers[event][i].scope === scope) {
                        eventsToRemove.push(this.handlers[event][i]);
                    }
                }
            }
            //Delete events from array
            for (i in eventsToRemove) {
                if (eventsToRemove.hasOwnProperty(i)) {
                    this.handlers[event].splice(this.handlers[event].indexOf(eventsToRemove[i]), 1);
                }
            }
        }
    };




    this.toString = function () {
        return this.__staticType;
    };


};