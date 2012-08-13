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
 * @name ChangeWatcher
 * @package core
 */
core.ChangeWatcher = Rokkstar.createClass('core.ChangeWatcher',undefined, function () {
    this.host=null;
    this.chain=null;
    this.chainObjects=[];
    this.handler=null;
    this.wscope=null;

    this.construct=function(host,chain,handler,scope){
        if(!Rokkstar.instanceOf(host,'core.EventDispatcher')) throw new TypeError('Change watcher host object has to be instance of core.EventDispatcher.');
        this.chain=chain;
        this.host=host;
        this.handler=handler;
        this.wscope=scope;
    }

    this.reset=function(){
        this.chainObjects=[this.host];
        var i=0;
        var lastChainObj=this.chain.length-2;
        while(i<=lastChainObj && this.chainObjects[i][this.chain[i]]!=undefined && this.chainObjects[i][this.chain[i]]!=null){

            //Create chain object
            this.chainObjects.push(this.chainObjects[i][this.chain[i]]);

            //Ensuring target object is an event dispatcher
            if(!Rokkstar.instanceOf(this.chainObjects[i],'core.EventDispatcher')) throw new TypeError('Change watcher host object has to be instance of core.EventDispatcher.');

            //Register change event listener
            this.chainObjects[i].createEventListener(this.chain[i]+'PropertyChanged',this.attributeChanged,this);

            i++;
        }
        if(i==this.chain.length-1) this.chainObjects[i].createEventListener(this.chain[i]+'PropertyChanged',this.finalAttributeChanged,this);

    }

    /**
     *
     * @param {core.events.PropertyChangeEvent} event
     */
    this.attributeChanged=function(event){
        var targetIndex=this.chainObjects.indexOf(event.currentTarget);
        if(targetIndex==-1) throw new Error('Internal error.');
        var lastChainObj=this.chainObjects.length-1;
        var i=targetIndex+1;

        //Deleting affected event listeners
        while(i<=lastChainObj){
            if(i==this.chain.length-1){
                this.chainObjects[i].deleteEventListener(this.chain[i]+'PropertyChanged',this.finalAttributeChanged,this);
            }else{
                this.chainObjects[i].deleteEventListener(this.chain[i]+'PropertyChanged',this.attributeChanged,this);
            }
            i++;
        }

        //Removing objects
        this.chainObjects.splice(targetIndex+1,this.chainObjects.length-targetIndex-1);

        //Creating new event listeners
        var i=targetIndex;
        var lastChainObj=this.chain.length-2;
        while(i<=lastChainObj && this.chainObjects[i][this.chain[i]]!=undefined && this.chainObjects[i][this.chain[i]]!=null){

            //Create chain object
            this.chainObjects.push(this.chainObjects[i][this.chain[i]]);

            //Ensuring target object is an event dispatcher
            if(!Rokkstar.instanceOf(this.chainObjects[i],'core.EventDispatcher')) throw new TypeError('Change watcher host object has to be instance of core.EventDispatcher.');

            //Register change event listener
            this.chainObjects[i].createEventListener(this.chain[i]+'PropertyChanged',this.attributeChanged,this);

            i++;
        }
        if(i==this.chain.length-1) this.chainObjects[i].createEventListener(this.chain[i]+'PropertyChanged',this.finalAttributeChanged,this);
        this.handler.apply(this.wscope,[event]);

    }

    this.unwatch=function(){
        var i=0;
        var lastChainObj=this.chainObjects.length-1;
        //Deleting affected event listeners
        while(i<=lastChainObj){
            if(i==this.chain.length-1){
                this.chainObjects[i].deleteEventListener(this.chain[i]+'PropertyChanged',this.finalAttributeChanged,this);
            }else{
                this.chainObjects[i].deleteEventListener(this.chain[i]+'PropertyChanged',this.attributeChanged,this);
            }
            i++;
        }

        this.chainObjects=[];
    }


    this.getValue=function(){
        //Resolve chain
        var current=this.host;
        var i=0;
        var last=this.chain.length-1;
        while(i<=last && current!=undefined){
            current=current[this.chain[i]];
            i++;
        }
        return current;
    }

    this.finalAttributeChanged=function(event){
        this.handler.apply(this.wscope,[event]);
    }
});

core.ChangeWatcher.watch=function(host,chain,handler,scope){
    var watcher=new core.ChangeWatcher(host,chain,handler,scope);
    watcher.reset();
    return watcher;
}