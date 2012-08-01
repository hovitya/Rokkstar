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
 */
core.data.Model = Rokkstar.createClass('core.data.Model', 'core.Component', function () {

    this.currentClass=null;

    this.fieldNames=[];

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('fieldsPropertyChanged',this.regenerateClass,this);
        this.createEventListener('extendsPropertyChanged',this.regenerateClass,this);
    }

    this.regenerateClass=function(event){
        var attributes=[];
        this.fieldNames=[];
        var fields=this.getFields();
        var i=fields.length;
        while(--i){
            var field=fields[i];
            attributes.push(new Attr(field.name,field.defaultValue,field.type));
            this.fieldNames.push(field.name);
        }
        var idField=this.getIdField();
        this.currentClass=Rokkstar.createClass(core.data.IDGenerator.generateModelId(),this.getExtends(),function(){this.construct=function(){this.callSuper('construct');this.setIdField(idField)};},attributes);
    }

    this.createEntity=function(){
        return new this.currentClass;
    }

    this.hasField=function(fieldName){
        return this.fieldNames.indexOf(fieldName)!=-1;
    }

},[new Attr('fields',[],'array'),new Attr('extends','core.data.Entity','string'),new Attr('idField','id','string')]);