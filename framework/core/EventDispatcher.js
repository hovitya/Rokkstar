/**
 * Creates new event dispatcher instance.
 * @class Super class for event handlers.
 * @author Horváth Viktor
 * @augments core.JQueryProxy
 * @constructor
 */
core.EventDispatcher=Rokkstar.createClass('core.EventDispatcher','core.JQueryProxy',function(){

    /**
     * @private
     * @type {Object}
     */
    this.handlers={};

    this.registeredDOMEvents=[];

    this.construct=function(){}


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
     * @param {Boolean} once Optional. Dismiss event listener after the first trigger if it is true
     */
    this.createEventListener=function(event,listenerF,scope,once){
        if(once==undefined){
            once=false;
        }
        if(Rokkstar.globals.DOMEvents.indexOf(event)!=-1){
            this.registerDOMEvent(event);
        }
        if(this.domElement==null) this.createDomElement();
        if(this.handlers[event]==undefined){
            this.handlers[event]=[];
        }
        this.handlers[event].push({func:listenerF,scope:scope,once:once});
    }

    this.registerDOMEvent=function(event){
        if(this.registeredDOMEvents.indexOf(event)==-1){
            this.domElement.addEventListener(event, $.proxy(this.triggerDOMEvent,this));
            this.registeredDOMEvents.push(event);
        }
    }

    /**
     *
     * @param {Event} event
     */
    this.triggerDOMEvent=function(event){
        this.triggerEvent(event);
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
        if(typeof event === "string"){
            event=new core.Event(event);
        }
        var handlers=this.handlers[event.type];
        var remove=[];
        if(handlers!=undefined){
            var i=handlers.length;
            while(--i>=0){
                handlers[i].func.apply(handlers[i].scope,[event]);
                if(handlers[i].once) remove.push(handlers[i]);
            }
            i=remove.length;
            while(--i>=0){
                this.handlers[event.type].splice(this.handlers[event.type].indexOf(remove[i]),1);
            }
        }
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
                    this.handlers=this.handlers.splice(i,1);
                }
            }
        }
    }

    this.domElement=null;

    this.createDomElement=function(){
        this.domElement=document.createElement('div');
        this.domElement.style[Modernizr.prefixed('boxSizing')]='border-box';
        this.domElement.style.position='absolute';
    }


});