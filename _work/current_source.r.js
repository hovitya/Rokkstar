/**
 * @namespace
 */
var core={};
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Create new Component instance
 * @class
 * @author Horváth Viktor
 * @augments core.EventDispatcher
 * @attribute {String} id
 */
core.Component =  function () {
    "use strict";

    /**
     * Get XML attribute
     * @description
     * Returns <code>fallback</code> value when attribute is not set or the component is not initialized in layout xml.
     * If the <code>data</code> attribute is set it will returns its value.
     * @param {String} data XML attribute name
     * @param {*} fallback Default value when attribute is not set or the component is not initialized in layout xml
     * @return {String}
     */
    this.getXMLData = function (data, fallback) {
        var val = $(this).attr('data-' + data);
        if (val === null) {
            return fallback;
        }
        return val;
    };

    this.getAttr = function (attribute) {
        return this["get" + attribute.capitalize()].apply(this, []);
    };

    this.hasAttr = function (attribute) {
        if ((this._attributeTypes === undefined) || (this._attributeTypes[attribute] === undefined)) { return false; }
        return true;
    };


    /**
     * Master component
     * This component defines this instance
     * @type {core.VisualComponent}
     */
    this.master = null;

    /**
     * @private
     * @param {String} name
     * @param {*} data
     */
    this.setXMLData = function (property, val) {
        if (this.getXMLData(name, null) === null) {
            $(this).attr('data-' + property, val);
        }
    };

    this.propertyRedirections = {};

    this.redirectProperty = function (property, component, selfValue) {
        component.set(property, this.get(property));
        this.set(property, selfValue);
        this.propertyRedirections[property] = component;
    };

    this.clearPropertyRedirection = function (property) {
        this.propertyRedirections[property] = null;
    };

    this.createAttributes = function () {
    };

    this.postAttributeCreation = function () {

    };

    this._attributes = [];
    this._attributeTypes = {};


    this.extractValue = function (val, typeForcing) {
        return Rokkstar.parseAttribute(val, typeForcing);
    };

    this._buildDOM = function () {
    };

    this.init = function () {
        Rokkstar.profiling.initCount++;
        //if($(this).attr('id')==undefined){
        $(this).attr('id', 'dynid' + Rokkstar.uniqueIds);
        Rokkstar.uniqueIds++;
        //}
        this.postAttributeCreation();
        this.createAttributes();
    };

    /**
     * Produce a component instance
     * @param {String} name Component class
     * @return {*} Component instance
     */
    this.createComponent = Rokkstar.createComponent;

    /**
     * Make the given class name unique for this object instance
     * @description
     * Use this method when you want to create a class name which is available only in the current object scope.
     * @example
     * <pre><code>
     *     var class=this.getInstanceClass('moveHandler'); //Will return id4321moveHandler
     *     $(this).find('.'+class); //This will prevent selecting moveHandlers from child components
     * </code></pre>
     * @param {String} className Requested class name
     * @return {String}
     */
    this.getInstanceClass = function (className) {
        return $(this).attr('id') + className;
    };

    this.construct = function () {
        this.init();
        this.triggerEvent('initialized');
    };

};
