/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 *
 * @class
 * @classdesc
 * IViewCursor implementation for ArrayCollection.
 * @name ArrayCollectionCursor
 * @augments core.EventDispatcher
 * @package core.data
 * @implements core.data.IViewCursor
 */
core.data.ArrayCollectionCursor = Rokkstar.createClass('core.data.ArrayCollectionCursor', 'core.EventDispatcher', function () {
    "use strict";

    /**
     * A reference to the ArrayCollection with which this cursor is associated.
     * @type {core.data.ArrayCollection}
     */
    this.collection = null;

    this.construct = function (collection) {
        this.callSuper('construct');
        this.collection = collection;
    };

    /**
     * @private
     * @type {Number}
     */
    this.position = -1;

    /**
     * If the cursor is located before the first item in the view, this property is true.
     * @return {Boolean}
     */
    this.isBeforeFirst = function () {
        return this.position <= -1;
    };

    /**
     * If the cursor is located after the last item in the view, this returns is true .
     * @return {Boolean}
     */
    this.isAfterLast = function () {
        return this.collection.view.length <= this.position;
    };

    /**
     * Moves the cursor to the next item within the collection.
     * @return {Boolean}
     */
    this.moveNext = function () {
        this.position += 1;
        this.triggerEvent(new core.data.events.CursorEvent('cursorUpdated', this.position, this.position - 1));
        return !this.isAfterLast();
    };

    /**
     * Moves the cursor to the previous item within the collection.
     * @return {Boolean}
     */
    this.movePrevious = function () {
        this.position -= 1;
        this.triggerEvent(new core.data.events.CursorEvent('cursorUpdated', this.position, this.position + 1));
        return !this.isBeforeFirst();
    };

    /**
     * Provides access the object at the location in the source collection referenced by this cursor.
     * @return {*}
     */
    this.current = function () {
        if (this.isAfterLast() || this.isBeforeFirst()) throw new Error('Index is out of bounds.');
        return this.collection.view[this.position];
    };

    /**
     * Provides access to a bookmark that corresponds to the item returned by the current property.
     * @return {core.data.CursorBookmark}
     */
    this.getBookmark = function () {
        return new core.data.CursorBookmark(this.position);
    };

    /**
     * Moves the cursor to a location at an offset from the specified bookmark.
     * @param {core.data.CursorBookmark|int} bookmark
     */
    this.seek = function (bookmark) {
        var oldPosition = this.position;
        if (bookmark === core.data.CursorBookmark.BEFORE_FIRST) {
            this.position = -1;
        } else if (bookmark === core.data.CursorBookmark.AFTER_LAST) {
            this.position = this.collection.view.length;
        } else if (bookmark === core.data.CursorBookmark.FIRST) {
            this.position = 1;
        } else if (bookmark === core.data.CursorBookmark.LAST) {
            this.position = this.collection.view.length - 1;
        } else {
            this.position = bookmark.pos;
        }
        this.triggerEvent(new core.data.events.CursorEvent('cursorUpdated', this.position, oldPosition));
    };

    /**
     * Finds the last item with the specified properties within the collection and positions the cursor on that item.
     * @param selector
     * @return {*}
     */
    this.findLast = function (selector) {
        var i = this.collection.view.length;
        while (--i) {
            if (this._matchSelector(this.collection.view[i], selector)) {
                return this.collection.view[i];
            }
        }
    };

    /**
     * Finds the first item with the specified properties within the collection and positions the cursor to that item.
     * @param selector
     * @return {*}
     */
    this.findFirst = function (selector) {
        var i = 0;
        while (i < this.collection.view.length) {
            if (this._matchSelector(this.collection.view[i], selector)) {
                return this.collection.view[i];
            }
            i += 1;
        }
    };

    /**
     * Finds an item with the specified properties within the collection and positions the cursor to that item.
     * @param selector
     * @return {*}
     */
    this.findAny = function (selector) {
        var i = this.collection.view.length;
        while (--i) {
            if (this._matchSelector(this.collection.view[i], selector)) {
                return this.collection.view[i];
            }
        }
    };

    /**
     *
     * @param object
     * @param selector
     * @return {Boolean}
     * @private
     */
    this._matchSelector = function (object, selector) {
        var i;
        for (i in selector) {
            if (selector.hasOwnProperty(i) && (object.hasOwnProperty(i) || object[i] !== selector[i])) {
                return false;
            }
        }
        return true;
    };

    /**
     * Inserts the specified item before the cursor's current position.
     * @param {*} item
     */
    this.insert = function (item) {
        this.collection.addItemAt(item, this.position);
    };

    /**
     * Removes the current item and returns it.
     * @return {*}
     */
    this.remove = function () {
        return this.collection.removeItemAt(this.position);
    };


}, [], [], ['core.data.IViewCursor']);