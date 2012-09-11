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
 * @classdesc
 * The DataGroup class is the base container class for data items. The DataGroup class converts data items to visual
 * elements for display. While this container can hold visual elements, it is often used only to hold data items as
 * children.
 * @xml
 * The <code><s:DataGroup></code> tag inherits all of the tag attributes of its superclass and adds the following tag
 * attributes:
 * <pre>
 * <rx:DataGroup
 *     <b>Properties</b>
 *     dataProvider="null"
 *     itemRenderer="null"
 *     itemRendererFunction="null"
 *     typicalItemWidth="NaN"
 *     typicalItemHeight="NaN"
 *
 *     <b>Events</b>
 *     rendererAdd="No default"
 *     rendererRemove="No default"
 *     />
 * </pre>
 * @name DataGroup
 * @triggers {core.events.RendererExistenceEvent} rendererAdd
 * @triggers {core.events.RendererExistenceEvent} rendererRemove
 * @package core.components
 */
core.components.DataGroup = Rokkstar.createClass('core.components.DataGroup', 'core.Group', function () {
    "use strict";
    this.setDataProvider = function (value) {
        if (this.___dataProvider !== null && this.___dataProvider !== undefined) {
            this.___dataProvider.deleteEventListener('collectionChanged', this.updateGroup, this);
        }
        var oldValue = this.___dataProvider;
        this.___dataProvider = value;
        this.___dataProvider.createEventListener('collectionChanged', this.updateGroup, this);
        this.triggerEvent(new core.events.PropertyChangeEvent('dataProviderPropertyChanged', oldValue, value, 'dataProvider'));
        this.reloadGroup();
    };
    /**
     * @protected
     * @param {core.data.events.CollectionEvent} event
     */
    this.updateGroup = function (event) {
        var item;
        if (event.kind === "remove") {
            this.removeRenderer(event.location, event.items[0]);
        } else if (event.kind === "add") {
            this.addRenderer(event.location, event.items[0]);
        } else if (event.kind === "move") {
            item = this.getElementAt(event.oldLocation);
            this.addElementAt(item, event.location);
        } else if (event.kind === "replace") {
            this.removeRenderer(event.location, event.items[0]);
            this.addRenderer(event.location, event.items[1]);
        } else {
            this.reloadGroup();
        }
    };

    /**
     * Reloads the whole content
     * @protected
     */
    this.reloadGroup = function () {
        var i = this.getElementsNum() - 1,
            dataList,
            max;
        while (i >= 0) {
            this.removeRenderer(i);
            i = i - 1;
        }
        dataList = this.getDataProvider().toArray();
        i = 0;
        max = dataList.length;
        while (i < max) {
            this.addRenderer(i, dataList[i]);
            i = i + 1;
        }
    };

    this.removeRenderer = function (index, data) {
        var renderer = this.getElementAt(index);
        if (data === undefined) {
            data = renderer.getData();
        }
        this.removeElementAt(index);
        this.triggerEvent(new core.events.RendererExistenceEvent('rendererRemove', data, index, renderer));
    };

    this.addRenderer = function (index, data) {
        var item = this.createRenderer(data);
        this.addElementAt(item, index);
        this.triggerEvent(new core.events.RendererExistenceEvent('rendererAdd', data, index, item));
    };

    this.createRenderer = function (data) {
        var itemRenderer = null,
            itemRendererString = this.getItemRenderer(),
            rendererClass = null;
        if (this.getItemRendererFunction() !== null && this.getItemRendererFunction() !== undefined) {
            itemRenderer = this.getItemRendererFunction().apply(null, [data]);
        }
        if (itemRenderer === null) {
            rendererClass = getClass(itemRendererString);
            itemRenderer = new rendererClass;
        }
        itemRenderer.setData(data);
        return itemRenderer;
    };
}, [
    new Attr('dataProvider', null, 'core.data.IList'),
    new Attr('itemRenderer', null, 'string'),
    new Attr('itemRendererFunction', null, 'function'),
    new Attr('typicalItemWidth', NaN, 'integer'),
    new Attr('typicalItemHeight', NaN, 'integer')
]);