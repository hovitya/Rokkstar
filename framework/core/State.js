/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.Component
 * @constructor
 */
core.State=Rokkstar.class('core.State','core.Component',function(){

    this.createAttributes=function(){
        this.createAttribute("stateName");
    }

    this.properties=[];

    this.addProperty=function(target,property,value){
        var val=Rokkstar.parseAttribute(value,target._attributeTypes[property]);
        this.properties.push({target:target,value:val,property:property});
    }

    this.activate=function(){
        for(var i in this.properties){
            var target=this.properties[i].target;
            target["set"+this.properties[i].property.capitalize()].apply(target,[this.properties[i].value]);
        }
    }
});