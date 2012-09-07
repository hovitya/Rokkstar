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
 * Encapsulates the positional aspects of a cursor in an ICollectionView. Bookmarks are used to return a cursor to an
 * absolute position within the ICollectionView.
 */
core.data.CursorBookmark = Rokkstar.createClass('core.data.CursorBookmark', undefined, function () {
    "use strict";

    this.pos = -1;

    this.construct = function (pos) {
        this.pos = pos;
    };
});

/**
 * @static
 * @type {Number}
 * A bookmark for the first item in an ICollectionView.
 */
core.data.CursorBookmark.FIRST = -1;

/**
 * A bookmark for the last item in an ICollectionView.
 * @static
 * @type {Number}
 */
core.data.CursorBookmark.LAST = -2;

/**
 * A bookmark for the before first position in an ICollectionView.
 * @type {Number}
 * @static
 */
core.data.CursorBookmark.BEFORE_FIRST = -3;

/**
 * A bookmark for the after last position in an ICollectionView.
 * @type {Number}
 * @static
 */
core.data.CursorBookmark.AFTER_LAST = -4;