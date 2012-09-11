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
 * @name Model
 * @package core.data
 * @component data
 * @augments core.Component
 * @implements core.IFactory
 * @attribute {String} entityClass The super class for generated entity class
 * @attribute {String} idField
 * @xml
 * The <code><rx:Model></code> tag inherits all the attributes of its superclass,
 * and adds the following attributes:
 * <pre>
 * <rx:Model
 * <b>Properties</b>
 * entityClass="core.Component"
 * idField = "undefined"
 * />
 * </pre>
 *
 */
core.data.Model = Rokkstar.createClass('core.data.Model', 'core.Component', function () {
    "use strict";

    this.currentClass = null;

    this.fieldNames = [];

    this.fields = [];

    this.init = function () {
        this.callSuper('init');
        this.createEventListener('fieldsPropertyChanged', this.invalidateClass, this);
        this.createEventListener('fieldsChanged', this.invalidateClass, this);
    };
    /**
     * Manually regenerates model class
     */
    this.regenerateClass = function () {
        var attributes = [],
            fields = this.fields,
            i = fields.length,
            field,
            idField = this.getIdField(),
            entityId = core.data.IDGenerator.generateModelId();
        this.fieldNames = [];
        while (--i >= 0) {
            field = fields[i];
            if (!field.getIsArray()) {
                attributes.push(new Attr(field.getPropertyName(), null, field.getType()));
            } else {
                attributes.push(new Attr(field.getPropertyName(), null, 'array'));
            }

            this.fieldNames.push(field.getName());
        }

        this.currentClass = Rokkstar.createClass('core.data._generatedClasses.' + entityId, this.getEntityClass(), function () {
            this.idField = "";
            this.setIdField = function (id) {
                this.idField = id;
            };

            this.id = function () {
                if (this[this.idField] === undefined || this[this.idField] === null) {
                    this[this.idField] = core.data.IDGenerator.generateEntityId();
                }
                return this[this.idField];
            };
            this.construct = function () {
                this.callSuper('construct');
                this.setIdField(idField);
            };
        }, attributes, [], ['core.data.IEntity']);
        core.data._generatedClasses[entityId] = this.currentClass;
        this.classInvalid = false;
    };

    /**
     * Creates new entity from the given data
     * @param {Object} data
     * @return {*}
     */
    this.createEntity = function (data) {
        if (this.classInvalid) {
            this.regenerateClass();
        }
        if (data !== undefined) {
            var entry = new this.currentClass,
                fields = this.fields,
                i = fields.length,
                dataItem,
                factory,
                j,
                value;
            while (--i >= 0) {
                dataItem = data[fields[i].getName()];
                factory = fields[i].getFactory();
                if (!fields[i].getIsArray()) {
                    if (factory) {
                        entry.set(fields[i].getPropertyName(), factory.createObject(data[fields[i].getName()]));
                    } else {
                        entry.set(fields[i].getPropertyName(), data[fields[i].getName()]);
                    }
                } else {
                    if (dataItem instanceof Array) {
                        value = [];
                        for (j in dataItem) {
                            if (dataItem.hasOwnProperty(j)) {
                                if (factory) {
                                    value.push(fields[i].getPropertyName(), factory.createObject(dataItem[j]));
                                } else {
                                    value.push(fields[i].getPropertyName(), dataItem[j]);
                                }
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


    };

    /**
     * Alias for createEntity
     * @param data
     * @return {*}
     */
    this.createObject = function (data) {
        return this.createEntity(data);
    };

    /**
     * @private
     * @type {Boolean}
     */
    this.classInvalid = true;

    /**
     * Marks current class as invalid
     * @protected
     */
    this.invalidateClass = function () {
        this.classInvalid = true;
    };

    this.addElement = function (field) {
        if (!Rokkstar.instanceOf(field, 'core.data.Field')) {
            throw new TypeError('Model elements have to be core.data.Field instance.');
        }
        this.fields.push(field);
        this.triggerEvent('fieldsChanged');
    };

}, [new Attr('entityClass', 'core.Component', 'string'),
    new Attr('idField', 'id', 'string')], [], ['core.IFactory']);