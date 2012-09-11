/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 *
 * @constructor
 */
core.layouts.ParallaxLayout = Rokkstar.createClass('core.layouts.ParallaxLayout', 'core.layouts.Layout', function () {
    "use strict";

    this.init = function () {
        this.callSuper('init');
        this.createEventListener('positionXPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('positionYPropertyChanged', this.selfRefreshLayout, this);
    };

    /**
     *
     * @param {core.VisualContainer} div
     */
    this.doLayout = function (div) {
        var elem, xMod, yMod, x, y, distance, distanceX, distanceY, i, position = new core.helpers.LayoutPosition(div.measuredWidth, div.measuredHeight, 0, 0, 0, 0);
        this.callSuper('doLayout', div);
        for (i in div.elements) {
            if (div.elements.hasOwnProperty(i)) {
                elem = div.elements[i];
                position.clear();
                position.width = elem.getWidth();
                position.height = elem.getHeight();
                position.minWidth = elem.getMinWidth();
                position.minHeight = elem.getMinHeight();
                position.maxWidth = elem.getMaxWidth();
                position.maxHeight = elem.getMaxHeight();
                position.apply(elem);
                distance = elem.getDistance();
                distanceX = elem.getDistanceX();
                distanceY = elem.getDistanceY();
                if (distanceX === undefined || distanceX === null || isNaN(distanceX)) { distanceX = distance; }
                if (distanceY === undefined || distanceY === null || isNaN(distanceY)) { distanceY = distance; }
                xMod = (100 - distanceX) / 100.0;
                yMod = (100 - distanceY) / 100.0;
                if (elem.getX() !== undefined && elem.getX() !== null && !isNaN(elem.getX())) {
                    x = elem.getX() + this.getPositionX() * xMod;
                } else { x = this.getPositionX() * xMod; }
                if (elem.getY() !== undefined && elem.getY() !== null && !isNaN(elem.getY())) {
                    y = elem.getY() + this.getPositionY() * yMod;
                } else { y = this.getPositionY() * xMod; }
                elem.domElement.style.left = Math.round(x) + 'px';
                elem.domElement.style.top = Math.round(y) + 'px';
                elem.domElement.style.position = 'absolute';
                elem.measure();
            }
        }
    };
}, [new Attr('positionX', 0, 'integer'), new Attr('positionY', 0, 'integer')]);