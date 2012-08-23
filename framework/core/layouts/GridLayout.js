/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @classdef Grid layout for responsive layout
 * @class
 * @name GridLayout
 * @package core.layouts
 * @augments core.layouts.Layout
 */
core.layouts.GridLayout = Rokkstar.createClass('core.layouts.GridLayout', 'core.layouts.Layout', function () {
    "use strict";

    this.parsedColumns = [];
    this.parsedRows = [];

    this.init = function () {
        this.callSuper('init');
        this.createEventListener('columnsPropertyChanged', this.__parseAttributes, this);
        this.createEventListener('rowsPropertyChanged', this.__parseAttributes, this);
    };

    /**
     * Parse columns and rows string.
     * @param {core.events.PropertyChangeEvent} event
     * @private
     */
    this.__parseAttributes = function (event) {
        var parsedData, i;
        event.newValue.replace(/\s+/g, " ");
        parsedData = event.newValue.split(' ');
        i = parsedData.length - 1;
        while (i >= 0) {
            parsedData[i] = parsedData[i].trim();
            i = i - 1;
        }
        if (event.propertyName === 'columns') {
            this.parsedColumns = parsedData;
        } else {
            this.parsedRows = parsedData;
        }
        this.selfRefreshLayout();
    };


    /**
     *
     * @param {core.VisualContainer} container
     */
    this.doLayout = function (container) {
        var parsedCols = core.layouts.GridLayout.ParseCharacteristicArray(this.parsedColumns, container.measuredWidth - this.getPaddingLeft() - this.getPaddingRight()),
            parsedRows = core.layouts.GridLayout.ParseCharacteristicArray(this.parsedRows, container.measuredHeight - this.getPaddingTop() - this.getPaddingBottom()),
            i = container.elements.length - 1,
            element,
            position,
            itemNum,
            span,
            gridArea,
            left,
            right,
            top,
            bottom,
            x,
            y,
            width,
            height,
            paddingLeft,
            paddingRight,
            paddingTop,
            paddingBottom,
            horizontallyPositioned = false,
            verticallyPositioned = false,
            align;

        while (i >= 0) {
            element = container.elements[i];

            //Determining grid area
            gridArea = {start: {x: 0, y: 0}, end: {x: 0, y: 0} };

            //-------------------------
            //Set column start position
            //-------------------------

            if (element.getGridColumn() === 1) {
                gridArea.start.x = this.getPaddingLeft();
            } else {
                itemNum = element.getGridColumn() - 2;
                if (itemNum >= 0 && itemNum < parsedCols.length) {
                    gridArea.start.x = parsedCols[itemNum] + this.getPaddingLeft();
                } else {
                    throw new Error("Referenced column is not exits in the grid.");
                }
            }

            //-------------------------
            //Set column end position
            //-------------------------

            span = element.getGridColumnSpan();
            if (isNaN(span) || span === undefined || span === null) {
                //Default span is 1
                itemNum = element.getGridColumn() - 1;
            } else {
                //Using span value
                itemNum = element.getGridColumn() - 2 + span;
            }

            if (itemNum >= 0 && itemNum < parsedCols.length - 1) {
                gridArea.end.x = parsedCols[itemNum] + this.getPaddingLeft();
            } else if (itemNum === parsedCols.length - 1) {
                gridArea.end.x = container.measuredWidth - this.getPaddingRight();
            } else {
                throw new Error("Grid column span out of bounds.");
            }

            //-------------------------
            //Set row start position
            //-------------------------

            if (element.getGridRow() === 1) {
                gridArea.start.y = this.getPaddingTop();
            } else {
                itemNum = element.getGridRow() - 2;
                if (itemNum >= 0 && itemNum < parsedRows.length) {
                    gridArea.start.y = parsedRows[itemNum] + this.getPaddingTop();
                } else {
                    throw new Error("Referenced row is not exits in the grid.");
                }
            }

            //-------------------------
            //Set row end position
            //-------------------------

            span = element.getGridRowSpan();
            if (isNaN(span) || span === undefined || span === null) {
                //Default span is 1
                itemNum = element.getGridRow() - 1;
            } else {
                //Using span value
                itemNum = element.getGridRow() - 2 + span;
            }

            if (itemNum >= 0 && itemNum < parsedRows.length - 1) {
                gridArea.end.y = parsedRows[itemNum] + this.getPaddingTop();
            } else if (itemNum === parsedRows.length - 1) {
                gridArea.end.y = container.measuredHeight - this.getPaddingBottom();
            } else {
                throw new Error("Grid row span out of bounds.");
            }

            //---------------------------------------------
            //Positioning element inside the grid area
            //---------------------------------------------

            position = new core.helpers.LayoutPosition(gridArea.end.x - gridArea.start.x, gridArea.end.y - gridArea.start.y, 0, 0, 0, 0);
            left = element.getLeft();
            right = element.getRight();
            top = element.getTop();
            bottom = element.getBottom();
            x = element.getX();
            y = element.getY();
            width = element.getWidth();
            height = element.getHeight();
            paddingTop = gridArea.start.y;
            paddingBottom = container.measuredHeight - gridArea.end.y;
            paddingLeft = gridArea.start.x;
            paddingRight = container.measuredWidth - gridArea.end.x;
            verticallyPositioned = false;
            horizontallyPositioned = false;

            //SECTION FROM ConstraintLayout.js
            //Positioning inside grid area like a constraint layout
            //Modified with horizontally and vertically positioned flags

            if ((left === undefined || left === null || isNaN(left)) || (right === undefined || right === null || isNaN(right))) {
                if (width !== undefined && width !== null) { position.width = width; }
            }
            if ((top === undefined || top === null || isNaN(top)) || (bottom === undefined || bottom === null || isNaN(bottom))) {
                if (height !== undefined && height !== null) { position.height = height; }
            }
            if (x !== undefined && x !== null && !isNaN(x)) { position.left = x + paddingLeft; horizontallyPositioned = true; }
            if (y !== undefined && y !== null && !isNaN(y)) { position.top = y + paddingTop; verticallyPositioned = true; }

            if (left !== undefined && left !== null && !isNaN(left)) { position.left = left + paddingLeft; horizontallyPositioned = true; }
            if (right !== undefined && right !== null && !isNaN(right)) { position.right = right + paddingRight; horizontallyPositioned = true; }
            if (top !== undefined && top !== null && !isNaN(top)) { position.top = top + paddingTop; verticallyPositioned = true; }
            if (bottom !== undefined && bottom !== null && !isNaN(bottom)) { position.bottom = bottom + paddingBottom; verticallyPositioned = true; }

            position.minWidth = element.getMinWidth();
            position.minHeight = element.getMinHeight();
            position.maxWidth = element.getMaxWidth();
            position.maxHeight = element.getMaxWidth();

            //SECTION END

            if (!horizontallyPositioned) {
                //This element is not horizontally positioned so we use gridHorizontalAlign rule
                align = element.getGridHorizontalAlign();
                switch (align) {
                case 'justify':
                    //Stretching
                    position.left = paddingLeft;
                    position.right = paddingRight;
                    position.width = undefined;
                    break;
                case 'left':
                    position.left = paddingLeft;
                    break;
                case 'right':
                    position.right = paddingRight;
                    break;
                case 'center':
                    width = position.getPredictedWidth();
                    position.left = Math.round((position.parentWidth - width) / 2) + paddingLeft;
                    break;
                }
            }

            if (!verticallyPositioned) {
                //This element is not horizontally positioned so we use gridHorizontalAlign rule
                align = element.getGridVerticalAlign();
                switch (align) {
                case 'justify':
                    //Stretching
                    position.top = paddingTop;
                    position.bottom = paddingBottom;
                    position.height = undefined;
                    break;
                case 'top':
                    position.top = paddingTop;
                    break;
                case 'bottom':
                    position.bottom = paddingBottom;
                    break;
                case 'middle':
                    height = position.getPredictedHeight();
                    position.top = Math.round((position.parentHeight - height) / 2) + paddingTop;
                    break;
                }
            }

            position.apply(element);
            element.measure();
            i = i - 1;
        }

    };



}, [new Attr('columns', '', 'string'), new Attr('rows', '', 'string')]);

/**
 *
 * @param {Array} array
 * @param {int} referenceValue
 * @return {Array} Parsed values. Actual sizes in pixel.
 * @static
 */
core.layouts.GridLayout.ParseCharacteristicArray = function (array, referenceValue) {
    "use strict";
    var returnArray = [],
        i = array.length - 1,
        element,
        currentValue = referenceValue,
        maxFragments = 0,
        fragmentSize = 0;
    //Parsing pixels
    while (i >= 0) {
        element = array[i];
        if (Rokkstar.globals.regex.pixelFormat.test(element) || Rokkstar.globals.regex.integerFormat.test(element)) {
            returnArray[i] = parseInt(element.replace('px', ''), 10);
            currentValue -= returnArray[i];
        } else if (Rokkstar.globals.regex.fragmentFormat.test(element)) {
            maxFragments += parseInt(element.replace('fr', ''), 10);
        }
        i = i - 1;
    }
    referenceValue = currentValue;

    //Parsing percents
    i = array.length - 1;
    while (i >= 0) {
        element = array[i];
        if (Rokkstar.globals.regex.percentFormat.test(element)) {
            returnArray[i] = Math.round(parseFloat(element.replace('%', '')) / 100.0 * referenceValue);
            currentValue -= returnArray[i];
        }
        i = i - 1;
    }
    referenceValue = currentValue;

    //Parsing fragments
    if (maxFragments > 0) {
        fragmentSize = referenceValue / maxFragments;
        i = array.length - 1;
        while (i >= 0) {
            element = array[i];
            if (Rokkstar.globals.regex.fragmentFormat.test(element)) {
                returnArray[i] = Math.round(parseInt(element.replace('fr', ''), 10) * fragmentSize);
            }
            i = i - 1;
        }
    }
    for (i = 1; i < returnArray.length; i++) {
        returnArray[i] = returnArray[i - 1] + returnArray[i];
    }
    return returnArray;
};