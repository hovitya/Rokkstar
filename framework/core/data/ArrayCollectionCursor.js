/**
 *
 * @class
 * @name ArrayCollectionCursor
 * @package core.data
 */
core.data.ArrayCollectionCursor = Rokkstar.createClass('core.data.ArrayCollectionCursor', 'core.EventDispatcher', function () {
    "use strict";
    /**
     *
     * @type {core.data.ArrayCollection}
     */
    this.collection = null;

    this.construct = function (collection) {
        this.callSuper('construct');
        this.collection = collection;
    };

    this.position = -1;

    this.isBeforeFirst = function () {
        return this.position <= -1;
    };

    this.isAfterLast = function () {
        return this.collection.view.length <= this.position;
    };

    this.moveNext = function () {
        this.position += 1;
        this.triggerEvent(new core.data.events.CursorEvent('cursorUpdated', this.position, this.position - 1));
        return !this.isAfterLast();
    };

    this.movePrevious = function () {
        this.position -= 1;
        this.triggerEvent(new core.data.events.CursorEvent('cursorUpdated', this.position, this.position + 1));
        return !this.isBeforeFirst();
    };

    this.current = function () {
        if (this.isAfterLast() || this.isBeforeFirst()) throw new Error('Index is out of bounds.');
        return this.collection.view[this.position];
    };

    this.getBookmark = function () {
        return new core.data.CursorBookmark(this.position);
    };

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

    this.findLast = function (selector) {
        var i = this.collection.view.length;
        while (--i) {
            if (this._matchSelector(this.collection.view[i], selector)) {
                return this.collection.view[i];
            }
        }
    };

    this.findFirst = function (selector) {
        var i = 0;
        while (i < this.collection.view.length) {
            if (this._matchSelector(this.collection.view[i], selector)) {
                return this.collection.view[i];
            }
            i += 1;
        }
    };

    this.findAny = function (selector) {
        var i = this.collection.view.length;
        while (--i) {
            if (this._matchSelector(this.collection.view[i], selector)) {
                return this.collection.view[i];
            }
        }
    };


    this._matchSelector = function (object, selector) {
        var i;
        for (i in selector) {
            if (selector.hasOwnProperty(i) && (object.hasOwnProperty(i) || object[i] !== selector[i])) return false;
        }
        return true;
    };

    this.insert = function (item) {
        this.collection.addItemAt(item, this.position);
    };

    this.remove = function () {
        this.collection.removeItemAt(this.position);
    };


}, [], [], ['core.data.IViewCursor']);