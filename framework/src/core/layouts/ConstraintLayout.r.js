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
 * @component layout
 * @classdesc
 * Default layout. Elements can be aligned by x, y, width, height or left, right, top, bottom, width, height properties.
 * @override
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @extends core.layouts.Layout
 * @version 1.0
 */
core.layouts.ConstraintLayout = function () {
    "use strict";

    /**
     * @override
     * @param {core.VisualComponent} div Target component
     */
    this.doLayout = function (div) {
        this.superClass.doLayout(div);
        var layout = this,
            i = div.elements.length,
            containerWidth = parseInt(div.measuredWidth, 10),
            containerHeight = parseInt(div.measuredHeight, 10),
            paddingLeft = parseInt(this.paddingLeft, 10),
            paddingRight = parseInt(this.paddingRight, 10),
            paddingTop = parseInt(this.paddingTop, 10),
            paddingBottom = parseInt(this.paddingBottom, 10),
            position = new core.helpers.LayoutPosition(containerWidth, containerHeight, paddingLeft, paddingRight,
                paddingTop, paddingBottom),
            element,
            left,
            right,
            top,
            bottom,
            x,
            y,
            width,
            height;

        while (--i >= 0) {
            element = div.elements[i];
            left = element.left;
            right = element.right;
            top = element.top;
            bottom = element.bottom;
            x = element.x;
            y = element.y;
            width = element.width;
            height = element.height;
            position.clear();
            if ((left === undefined || left === null || isNaN(left)) || (right === undefined || right === null || isNaN(right))) {
                if (width !== undefined && width !== null) { position.width = layout.stringToPixel(width, containerWidth,
                    paddingLeft, paddingRight); }
            }
            if ((top === undefined || top === null || isNaN(top)) || (bottom === undefined || bottom === null || isNaN(bottom))) {
                if (height !== undefined && height !== null) { position.height = layout.stringToPixel(height,
                    containerHeight, paddingTop, paddingBottom); }
            }
            if (x !== undefined && x !== null && !isNaN(x)) { position.left = x + paddingLeft; }
            if (y !== undefined && y !== null && !isNaN(y)) { position.top = y + paddingTop; }

            if (left !== undefined && left !== null && !isNaN(left)) { position.left = left + paddingLeft; }
            if (right !== undefined && right !== null && !isNaN(right)) { position.right = right + paddingRight; }
            if (top !== undefined && top !== null && !isNaN(top)) { position.top = top + paddingTop; }
            if (bottom !== undefined && bottom !== null && !isNaN(bottom)) { position.bottom = bottom + paddingBottom; }

            position.minWidth = element.minWidth;
            position.minHeight = element.minHeight;
            position.maxWidth = element.maxWidth;
            position.maxHeight = element.maxWidth;

            position.apply(element);
            element.measure(position.getPredictedWidth(), position.getPredictedHeight());

        }
    };
};