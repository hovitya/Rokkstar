/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.Component
 * @class
 */
core.State=Rokkstar.createClass('core.State','core.Component',function(){

    /**
     * @type {core.VisualComponent}
     */
    this.host=undefined;

    /**
     *
     * @param {core.VisualComponent} host
     */
    this.construct=function(host){
        this.callSuper('construct');
        this.host=host;
        this.createEventListener('stateGroupsPropertyChanged',this.__stateGroupsChanged,this);
        this.createEventListener('stateNamePropertyChanged',this.__stateNameChanged,this);
    }

    /**
     *
     * @param {core.events.PropertyChangeEvent} event
     * @private
     */
    this.__stateGroupsChanged=function(event){
        var oldGroups=event.oldValue.split(',');
        for(var i in oldGroups){
            var groupName=oldGroups[i].trim();
            if(groupName!="" && this.host.stateGroups[groupName] && this.host.stateGroups[groupName].indexOf(this)!=-1){
                this.host.stateGroups[groupName].splice();
            }
        }
        var newGroups=event.newValue.split(',');
        for(var i in newGroups){
            var groupName=newGroups[i].trim();
            if(groupName!=""){
                if(this.host.stateGroups[groupName]==undefined) this.host.stateGroups[groupName]=[];
                this.host.stateGroups[groupName].push(this);
            }
        }
    }


    this.properties=[];

    this.addProperty=function(target,property,value){
        var val=Rokkstar.parseAttribute(value,target._attributeTypes[property]);
        this.properties.push({target:target,value:val,property:property,_prev:null});
    }

    this.activate=function(){
        for(var i in this.properties){
            var target=this.properties[i].target;
            //Saving previous value
            this.properties[i]._prev=target["get"+this.properties[i].property.capitalize()].apply(target,[]);
            target["set"+this.properties[i].property.capitalize()].apply(target,[this.properties[i].value]);
        }
    }

    this.deactivate=function(){
        for(var i in this.properties){
            var target=this.properties[i].target;
            target["set"+this.properties[i].property.capitalize()].apply(target,[this.properties[i]._prev]);
        }
    }
},[new Attr("stateName","undefined","string"),new Attr("stateGroups","","string")]);