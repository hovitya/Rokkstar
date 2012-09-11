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
 * @component data
 * @classdesc
 * The ArrayCollection class is a wrapper class that exposes an Array as a collection that can be accessed and
 * manipulated using the methods and properties of the ICollectionView or IList interfaces. Operations on a
 * ArrayCollection instance modify the data source; for example, if you use the removeItemAt() method on an
 * ArrayCollection, you remove the item from the underlying Array.
 * @xml
 * The <code><rx:ArrayCollection></code> tag inherits all the attributes of its superclass,
 * and adds the following attributes:
 * <pre>
 * <rx:ArrayCollection
 * <b>Properties</b>
 * source="null"
 * />
 * </pre>
 * @name ArrayCollection
 * @augments core.Component
 * @package core.data
 * @attribute {Array} source
 * @attribute {Function} sort
 * @attribute {Function} filter
 * @param {Array} source
 * @implements core.data.ICollectionView
 * @implements core.data.IList
 */
core.data.ArrayCollection = Rokkstar.createClass('core.data.ArrayCollection', 'core.Component',
    function () {
        "use strict";

        this.init = function () {
            this.callSuper('init');
            this.createEventListener('sourcePropertyChanged', this._refresh, this);
            this.createEventListener('sortPropertyChanged', this._refresh, this);
            this.createEventListener('filterPropertyChanged', this._refresh, this);
        };

        this.construct = function (source) {
            this.callSuper('construct');
            if (source !== undefined) {
                this.setSource(source);
            } else {
                this.setSource([]);
            }
        };

        /**
         * Creates a new IViewCursor that works with this view.
         * @return {core.data.ArrayCollectionCursor}
         */
        this.createCursor = function () {
            return new core.data.ArrayCollectionCursor(this);
        };

        /**
         * The current view. Do not modify it directly.
         * @type {Array}
         */
        this.view = [];

        /**
         * Manual refresh the view.
         */
        this.refresh = function () {
            this._refresh(undefined);
        };

        /**
         * @private
         * @param {core.events.PropertyChangeEvent} event
         */
        this._refresh = function (event) {
            this.view = [];
            var i, source;
            source = this.getSource();
            for (i in source) {
                if (source.hasOwnProperty(i)) {
                    if (this.filter === undefined || this.filter.apply(this, [source[i]])) {
                        this.view.push(source[i]);
                    }
                }
            }
            if (this.sort !== undefined) {
                this.view.sort(this.sort);
            }
            if (event === undefined || event.propertyName === 'source') {
                this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged', 'reset'));
            } else {
                this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged', 'refresh'));
            }

        };

        /**
         * Returns whether the view contains the specified object.
         * @param value
         * @return {Boolean}
         */
        this.contains = function (value) {
            return (this.view.indexOf(value) !== -1);
        };

        /**
         * The number of items in this view.
         * @return {int}
         */
        this.length = function () {
            return this.view.length;
        };
        /**
         * Adds the specified item to the end of the list.
         * @param {*} item
         */
        this.addItem = function (item) {
            var source = this.getSource(),
                oldIndex;
            if (this.view.indexOf(item) === -1) {
                //Add new item
                source.push(item);
                this.view.push(item);
                this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged',
                    'add',
                    this.view.length - 1,
                    -1,
                    [item]));
            } else {
                //Moves item to end
                oldIndex = this.view.indexOf(item);
                source.splice(source.indexOf(item), 1);
                source.push(item);
                this.view.splice(oldIndex, 1);
                this.view.push(item);
                this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged',
                    'move',
                    this.view.length - 1,
                    oldIndex,
                    [item]));
            }
        };

        /**
         *
         * @param index
         * @private
         */
        this._checkIndex = function (index) {
            if (index < 0 || index >= this.length()) {
                throw new RangeError('Index out of bounds.');
            }

        };

        /**
         * Adds the item at the specified index.
         * @param  {*} item
         * @param {int} index
         */
        this.addItemAt = function (item, index) {
            var source, oldIndex;
            this._checkIndex(index);
            source = this.getSource();
            if (this.view.indexOf(item) === -1) {
                source.splice(source.indexOf(this.view[index]), 0, item);
                this.view.splice(index, 0, item);
                this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged', 'add', index, -1, [item]));
            } else {
                source.splice(source.indexOf(item), 1);
                source.splice(source.indexOf(this.view[index]), 0, item);
                oldIndex = this.view.indexOf(item);
                this.view.splice(oldIndex, 1);
                this.view.splice(index, 0, item);
                this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged',
                    'move',
                    index,
                    oldIndex,
                    [item]));
            }
        };

        /**
         * Removes the item at the specified index and returns it.
         * @param {int} index
         * @returns {*}
         */
        this.removeItemAt = function (index) {
            var source, item;
            this._checkIndex(index);
            source = this.getSource();
            item = this.view[index];
            source.splice(source.indexOf(item), 1);
            this.view.splice(index, 1);
            this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged', 'remove', index, -1, [item]));
            return item;
        };

        /**
         * Gets the item at the specified index.
         * @param index
         * @return {*}
         */
        this.getItemAt = function (index) {
            this._checkIndex(index);
            return this.view[index];
        };

        /**
         * Returns the index of the item if it is in the list such that getItemAt(index) == item.
         * @param item
         * @return {*}
         */
        this.getItemIndex = function (item) {
            return this.view.indexOf(item);
        };

        /**
         * Remove all items from the list.
         */
        this.removesAll = function () {
            this.setSource([]);
        };

        /**
         * Places the item at the specified index.
         * @param {int} index
         * @param {*} item
         */
        this.setItemAt = function (index, item) {
            var source, oldItem;
            this._checkIndex(index);
            oldItem = this.view[index];
            source = this.getSource();
            source.splice(source.indexOf(oldItem), 1, item);
            this.view.splice(index, 1, item);
            this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged',
                'replace',
                index,
                -1,
                [oldItem, item]));
        };

        /**
         * Returns an Array that is populated in the same order as the IList implementation.
         * @return {Array}
         */
        this.toArray = function () {
            var i, array;
            array = [];
            for (i in this.view) {
                if (this.view.hasOwnProperty(i)) { array.push(this.view[i]); }
            }
            return array;
        };


    }, [new Attr('source', [], 'array'),
        new Attr('sort', undefined, 'function'),
        new Attr('filter', undefined, 'function')],
    [], ['core.data.ICollectionView', 'core.data.IList']);