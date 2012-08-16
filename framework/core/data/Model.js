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

    this.currentClass = null;

    this.fieldNames = [];

    this.fields = [];

    this.init = function () {
        this.callSuper('init');
        this.createEventListener('fieldsPropertyChanged', this.invalidateClass, this);
        this.createEventListener('fieldsChanged', this.invalidateClass, this);
    }

    this.regenerateClass = function () {
        var attributes = [];
        this.fieldNames = [];
        var fields = this.fields;
        var i = fields.length;
        while (--i >= 0) {
            var field = fields[i];
            if (!field.getIsArray()) {
                attributes.push(new Attr(field.getPropertyName(), null, field.getType()));
            } else {
                attributes.push(new Attr(field.getPropertyName(), null, 'array'));
            }

            this.fieldNames.push(field.getName());
        }
        var idField = this.getIdField();
        var entityId = core.data.IDGenerator.generateModelId();
        this.currentClass = Rokkstar.createClass('core.data._generatedClasses.' + entityId, this.getEntityClass(), function () {
            this.idField = "";
            this.setIdField = function (id) {
                this.idField = id;
            }

            this.id = function () {
                if (this[this.idField] == undefined) {
                    this[this.idField] = core.data.IDGenerator.generateEntityId();
                }
                return this[this.idField];
            }
            this.construct = function () {
                this.callSuper('construct');
                this.setIdField(idField)
            };
        }, attributes, [], ['core.data.IEntity']);
        core.data._generatedClasses[entityId] = this.currentClass;
        this.classInvalid = false;
    }

    this.createEntity = function (data) {
        if (this.classInvalid) this.regenerateClass();
        if (data != undefined) {
            var entry = new this.currentClass;
            var fields = this.fields;
            var i = fields.length;
            while (--i >= 0) {
                var dataItem = data[fields[i].getName()];
                var factory = fields[i].getFactory();
                if (!fields[i].getIsArray()) {
                    if (factory) {
                        entry.set(fields[i].getPropertyName(), factory.createObject(data[fields[i].getName()]));
                    } else {
                        entry.set(fields[i].getPropertyName(), data[fields[i].getName()]);
                    }
                } else {
                    if (dataItem instanceof Array) {
                        var value = [];
                        for (var j in dataItem) {
                            if (factory) {
                                value.push(fields[i].getPropertyName(), factory.createObject(dataItem[j]));
                            } else {
                                value.push(fields[i].getPropertyName(), dataItem[j]);
                            }
                        }
                        entry.set(fields[i].getPropertyName(), value);
                    } else {
                        if (factory) {
                            entry.set(fields[i].getPropertyName(), [factory.createObject(dataItem)]);
                        } else {
                            entry.set(fields[i].getPropertyName(), [dataItem]);
                        }
                    }
                }

            }
            return entry;
        } else {
            return undefined;
        }


    }

    this.createObject = function (data) {
        return this.createEntity(data);
    }


    this.classInvalid = true;

    this.invalidateClass = function () {
        this.classInvalid = true;
    }

    this.addElement = function (field) {
        if (!Rokkstar.instanceOf(field, 'core.data.Field')) throw new TypeError('Model elements have to be core.data.Field instance.');
        this.fields.push(field);
        this.triggerEvent('fieldsChanged');
    }

}, [new Attr('entityClass', 'core.Component', 'string'), new Attr('idField', 'id', 'string')], [], ['core.IFactory']);