/**
 * Creates new event dispatcher instance.
 * @class Super class for event handlers.
 * @author Horváth Viktor
 * @augments core.JQueryProxy
 * @constructor
 */
core.EventDispatcher=Rokkstar.class('core.EventDispatcher','core.JQueryProxy',function(){

    /**
     * @private
     * @type {Object}
     */
    this.handlers={};

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
     * @param {Function} listener Function to call
     * @param {Object} scope Scope for callback function
     */
    this.createEventListener=function(event,listenerF,scope){
        if(this.domElement==null) this.createDomElement();
        var listener=null;
        if(this.handlers[event]==undefined){
            this.handlers[event]=[];
        }else{
            for(var i in this.handlers[event]){
                if(this.handlers[event][i].func===listenerF && this.handlers[event][i].scope===scope){
                    listener=this.handlers[event][i].alteredFunc;
                    break;
                }
            }
        }
        if(listener==null){
            listener=$.proxy(listenerF,scope);
            this.handlers[event].push(new core.EventFunction(event,listenerF,scope,listener));
        }

        this.domElement.addEventListener(event,listener,false);
    }

    /**
     * Triggers new event.
     * @description
     * Triggers the named event. Every event handler which is registered to the named event will be called.
     * <code>
     *      myEventDispatcher.triggerEvent('layoutChanged');
     * </code>
     * @param {String} event Event name.
     */
    this.triggerEvent=function(event,bubbling,cancellable){
        if(this.domElement==null) this.createDomElement();
        if(bubbling==undefined) bubbling=false;
        if(cancellable==undefined) cancellable=true;
        var evt = document.createEvent('Event');
        evt.initEvent(event,bubbling,cancellable);
        this.domElement.dispatchEvent(evt);
    }

    /**
     * Destroys previously created event listener.
     * @description
     * The specified handler will be removed and never will be called again.
     * @param event
     * @param listener
     * @param scope
     */
    this.deleteEventListener=function(event,listener,scope){
        if(this.domElement==null) this.createDomElement();
        if(this.handlers[event]!=undefined){
            for(var i in this.handlers[event]){
                if(this.handlers[event][i].func===listener && this.handlers[event][i].scope===scope){
                    this.domElement.removeEventListener(event,this.handlers[event][i].alteredFunc,false);
                }
            }
        }
    }

    this.domElement=null;

    this.createDomElement=function(){
        this.domElement=document.createElement('div');
    }


});

core.EventFunction=function(event,func,scope,af){
    this.event=event;
    this.func=func;
    this.scope=scope;
    this.alteredFunc=af;
}

