/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.layouts.AlignmentLayout
 * @constructor
 */
core.layouts.HorizontalLayout = Rokkstar.createClass('core.layouts.HorizontalLayout', 'core.layouts.AlignmentLayout', function () {
    "use strict";
    /**
     *
     * @param {core.VisualComponent} div Parent component
     */
    this.doLayout = function (div) {
        this.callSuper('doLayout', div);

        var containerWidth = div.measuredWidth,
            containerHeight = div.measuredHeight,
            layout = this,
            elements = div.elements,
            verticalAlign = this.getVerticalAlign(),
            horizontalAlign = this.getHorizontalAlign(),
            gap = this.getGap(),
            currentLeft = this.getPaddingLeft(),
            paddingLeft = parseInt(this.getPaddingLeft(), 10),
            paddingRight = parseInt(this.getPaddingRight(), 10),
            paddingTop = parseInt(this.getPaddingTop(), 10),
            paddingBottom = parseInt(this.getPaddingBottom(), 10),
            position = new core.helpers.LayoutPosition(containerWidth,
                containerHeight,
                paddingLeft,
                paddingRight,
                paddingTop,
                paddingBottom),
            element,
            i,
            widthString,
            heightString,
            width,
            height,
            space,
            currentRight,
            correction;

        div.measuredContentWidth = paddingLeft + paddingRight + (elements.length - 1) * gap;
        div.measuredContentHeight = 0;

        if (horizontalAlign === 'left' || horizontalAlign === 'center') {
            for (i = elements.length - 1; i >= 0; i--) {

                element = div.elements[i];
                widthString = element.getWidth();
                heightString = element.getHeight();
                position.clear();
                position.width = widthString;
                position.height = heightString;
                position.minWidth = element.getMinWidth();
                position.minHeight = element.getMinHeight();
                position.maxWidth = element.getMaxWidth();
                position.maxHeight = element.getMaxHeight();


                width = position.getPredictedWidth();
                height = position.getPredictedHeight();

                if (verticalAlign === 'top') {
                    position.top = this.getPaddingTop();
                    position.left = currentLeft;
                } else if (verticalAlign === 'bottom') {
                    position.bottom = this.getPaddingBottom();
                    position.left = currentLeft;
                } else {
                    space = Math.round((parseInt(containerHeight, 10) - parseInt(this.getPaddingTop(), 10) - parseInt(this.getPaddingBottom(), 10) - parseInt(height, 10)) / 2);
                    position.top = space;
                    position.left = currentLeft;
                }
                currentLeft = parseInt(currentLeft, 10) + parseInt(width, 10) + parseInt(gap, 10);
                position.apply(element);
                element.measure(width, height);
                div.measuredContentHeight = Math.max(div.measuredContentHeight, element.measuredHeight + paddingBottom + paddingTop);
                div.measuredContentWidth += element.measuredWidth;

            }
        } else if (horizontalAlign === 'right') {
            currentRight = this.getPaddingRight();
            for (i = elements.length - 1; i >= 0; i--) {
                element = div.elements[i];
                widthString = element.getWidth();
                heightString = element.getHeight();
                position.clear();
                position.width = widthString;
                position.height = heightString;
                position.minWidth = element.getMinWidth();
                position.minHeight = element.getMinHeight();
                position.maxWidth = element.getMaxWidth();
                position.maxHeight = element.getMaxHeight();
                width = position.getPredictedWidth();
                height = position.getPredictedHeight();
                if (verticalAlign === 'top') {
                    position.top = this.getPaddingTop();
                    position.right = currentRight;
                } else if (verticalAlign === 'bottom') {
                    position.bottom = this.getPaddingBottom();
                    position.right = currentRight;
                } else {
                    space = Math.round((parseInt(containerHeight, 10) - parseInt(this.getPaddingTop(), 10) - parseInt(this.getPaddingBottom(), 10) - parseInt(height, 10)) / 2);
                    position.top = space;
                    position.right = currentRight;
                }
                currentRight = parseInt(currentRight, 10) + parseInt(width, 10) + parseInt(gap, 10);
                position.apply(element);
                element.measure(width, height);
                div.measuredContentHeight = Math.max(div.measuredContentHeight, element.measuredHeight + paddingBottom + paddingTop);
                div.measuredContentWidth += element.measuredWidth;
            }
        }

        if (horizontalAlign === 'center') {
            //Fixing positions
            currentLeft -= parseInt(gap, 10);
            correction = containerWidth - currentLeft;
            correction = Math.round(correction / 2);
            for (i in elements) {
                if (elements.hasOwnProperty(i)) { elements[i].domElement.style.left = (parseInt(elements[i].domElement.style.left, 10) + correction) + "px"; }
            }

        }
    };
});