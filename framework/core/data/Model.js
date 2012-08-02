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
        this.createEventListener('fieldsPropertyChanged',this.invalidateClass,this);
        this.createEventListener('fieldsChanged',this.invalidateClass,this);
    }

    this.regenerateClass=function(){
        var attributes=[];
        this.fieldNames=[];
        var fields=this.getFields();
        var i=fields.length;
        while(--i){
            var field=fields[i];
            attributes.push(new Attr(field.getPropertyName(),null,field.getType()));
            this.fieldNames.push(field.getName());
        }
        var idField=this.getIdField();
        this.currentClass=Rokkstar.createClass(core.data.IDGenerator.generateModelId(),this.getEntityClass(),function(){
            this.idField="";
            this.setIdField=function(id){
                this.idField=id;
            }

            this.id=function(){
                if(this[this.idField]==undefined){
                    this[this.idField]=core.data.IDGenerator.generateEntityId();
                }
                return this[this.idField];
            }
            this.construct=function(){this.callSuper('construct');this.setIdField(idField)};
        },attributes,[],['core.data.IEntity']);
        this.classInvalid=false;
    }

    this.createEntity=function(data){
        if(this.classInvalid) this.regenerateClass();
        var entry=new this.currentClass;
        if(data!=undefined){
            var i=fields.length;
            while(--i){
                entry.set(fields[i].getPropertyName(),data[fields[i].getName()]);
            }
        }

    }

    this.hasField=function(fieldName){
        return this.fieldNames.indexOf(fieldName)!=-1;
    }

    this.classInvalid=true;

    this.invalidateClass=function(){
        this.classInvalid=true;
    }

    this.addElement=function(field){
        if(!Rokkstar.instanceOf(field,'core.data.Field')) throw new TypeError('Model fields have to be core.data.Field instance.');
        this.fields.push(field);
        this.triggerEvent('fieldsChanged');
    }

},[new Attr('entityClass','core.Component','string'),new Attr('idField','id','string')]);