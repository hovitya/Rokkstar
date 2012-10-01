/**
 * Interface for event dispatcher objects.
 * @interface
 */
core.IEventDispatcher = function () {
    "use strict";

    /**
     * Triggers new event.
     * @description
     * Triggers the named event. Every event handler which is registered to the named event will be called.
     * <code>
     *      myEventDispatcher.triggerEvent('layoutChanged');
     * </code>
     * @param {String|core.Event} event Event name.
     */
    this.triggerEvent = function (event) {};

    /**
     * Register new event handler.
     * @description
     * When the EventDispatcher object triggers this <code>event</code> the given function will be called within the
     * given scope. The function will be called every time when the event is triggered until the event won't be removed.
     * <code>
     *      myEventDispatcher.createEventListener('layoutChange',this.onLayoutChange,this);
     * </code>
     * @see core.EventDispatcher#removeEventListener
     * @see core.EventDispatcher#triggerEvent
     * @param {String} event Event name
     * @param {Function} listenerF Function to call
     * @param {Object} scope Scope for callback function
     * @param {Boolean} once Optional. Dismiss the event listener after the first trigger. The default value is false.
     * @param {Boolean} useCapture Optional. Determines whether the listener works in the capture phase or the target and bubbling phases. If useCapture is set to true, the listener processes the event only during the capture phase and not in the target or bubbling phase. If useCapture is false, the listener processes the event only during the target or bubbling phase. To listen for the event in all three phases, call addEventListener twice, once with useCapture set to true, then again with useCapture set to false. The default value is false.
     */
    this.createEventListener = function (event, listenerF, scope, once, useCapture) {};

    /**
     * @description
     * The specified handler will be removed and never will be called again.
     * @param event
     * @param listener
     * @param scope
     */
    this.deleteEventListener = function (event, listener, scope) {};


};