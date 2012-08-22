/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.layouts.AlignmentLayout
 * @constructor
 */
core.layouts.VerticalLayout = Rokkstar.createClass('core.layouts.VerticalLayout', 'core.layouts.AlignmentLayout', function () {
    "use strict";

    /**
     *
     * @param {core.VisualContainer} div Parent div
     */
    this.doLayout = function (div) {
        //this.callSuper('doLayout',div);
        this.lastDiv = div;

        var containerWidth = parseInt(div.measuredWidth, 10), containerHeight = parseInt(div.measuredHeight, 10),
            layout = this, elements = div.elements, verticalAlign = this.getVerticalAlign(),
            gap = parseInt(this.getGap(), 10), horizontalAlign = this.getHorizontalAlign(),
            paddingLeft = parseInt(this.getPaddingLeft(), 10), paddingRight = parseInt(this.getPaddingRight(), 10),
            paddingTop = parseInt(this.getPaddingTop(), 10), paddingBottom = parseInt(this.getPaddingBottom(), 10),
            elementsLength = elements.length,
            position = new core.helpers.LayoutPosition(containerWidth,
                containerHeight,
                paddingLeft,
                paddingRight,
                paddingTop,
                paddingBottom),
            i = 0, currentTop, currentBottom, width, height, element, widthString, heightString, space, correction;

        if (verticalAlign === 'top' || verticalAlign === 'middle') {
            currentTop = paddingTop;
            i = elementsLength;
            while (--i >= 0) {
                element = div.elements[i];
                widthString = element.getWidth();
                heightString = element.getHeight();
                position.clear();
                position.width = widthString; //layout.stringToPixel(widthString, containerWidth, paddingLeft, paddingRight);
                position.height = heightString; //layout.stringToPixel(heightString, containerHeight, paddingTop, paddingBottom);
                position.minWidth = element.getMinWidth();
                position.minHeight = element.getMinHeight();
                position.maxWidth = element.getMaxWidth();
                position.maxHeight = element.getMaxHeight();


                width = position.getPredictedWidth();
                height = position.getPredictedHeight();

                if (horizontalAlign === 'left') {
                    position.top = currentTop;
                    position.left = paddingLeft;
                } else if (horizontalAlign === 'right') {
                    position.top = currentTop;
                    position.right = paddingRight;
                } else {
                    space = Math.round((containerWidth - paddingLeft - paddingRight - width) / 2);
                    position.top = currentTop;
                    position.left = space;
                }
                currentTop = currentTop + height + gap;
                position.apply(element);
                element.measure(width, height);
            }
        } else if (verticalAlign === 'bottom') {
            currentBottom = paddingBottom;
            i = elementsLength;
            while (--i >= 0) {
                element = div.elements[i];
                widthString = element.getWidth();
                heightString = element.getHeight();
                position.clear();
                position.width = widthString; //layout.stringToPixel(widthString, containerWidth, paddingLeft, paddingRight);
                position.height = heightString; //layout.stringToPixel(heightString, containerHeight, paddingTop, paddingBottom);
                position.minWidth = element.getMinWidth();
                position.minHeight = element.getMinHeight();
                position.maxWidth = element.getMaxWidth();
                position.maxHeight = element.getMaxHeight();

                position.width = layout.stringToPixel(widthString, containerWidth, paddingLeft, paddingRight);
                position.height = layout.stringToPixel(heightString, containerHeight, paddingTop, paddingBottom);

                width = position.getPredictedWidth();
                height = position.getPredictedWidth();

                if (horizontalAlign === 'left') {
                    position.bottom = currentBottom;
                    position.left = paddingLeft;
                } else if (this.getHorizontalAlign() === 'right') {
                    position.bottom = currentBottom;
                    position.right = paddingRight;
                } else {
                    space = Math.round((containerWidth - paddingLeft - paddingRight - width) / 2);
                    position.bottom = currentBottom;
                    position.left = space;
                }
                currentBottom = currentBottom + height + gap;
                position.apply(element);
                element.measure(width, height);
            }
        }

        if (verticalAlign === 'middle') {
            //Fixing positions
            currentTop -= parseInt(gap, 10);
            correction = containerHeight - currentTop;
            correction = Math.round(correction / 2);
            i = elementsLength;
            while (--i >= 0) {
                element = elements[i];
                element.domElement.style.top = (parseInt(elements[i].domElement.style.top, 10) + correction) + "px";
            }

        }
    };
});