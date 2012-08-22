/**
 * @augments core.layouts.Layout
 * @construct
 */
core.layouts.ConstraintLayout = Rokkstar.createClass('core.layouts.ConstraintLayout', 'core.layouts.Layout', function () {
    "use strict";

    /**
     *
     * @param {core.VisualComponent} div Target component
     */
    this.doLayout = function (div) {
        this.callSuper('doLayout', div);
        var layout = this,
            i = div.elements.length,
            containerWidth = parseInt(div.measuredWidth, 10),
            containerHeight = parseInt(div.measuredHeight, 10),
            paddingLeft = parseInt(this.getPaddingLeft(), 10),
            paddingRight = parseInt(this.getPaddingRight(), 10),
            paddingTop = parseInt(this.getPaddingTop(), 10),
            paddingBottom = parseInt(this.getPaddingBottom(), 10),
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
            left = element.getLeft();
            right = element.getRight();
            top = element.getTop();
            bottom = element.getBottom();
            x = element.getX();
            y = element.getY();
            width = element.getWidth();
            height = element.getHeight();
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

            position.minWidth = element.getMinWidth();
            position.minHeight = element.getMinHeight();
            position.maxWidth = element.getMaxWidth();
            position.maxHeight = element.getMaxWidth();

            position.apply(element);
            element.measure(position.getPredictedWidth(), position.getPredictedHeight());

        }
    };
});