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
 * @augments core.graphics.ClosedGraphicsElement
 */
core.graphics.Rectangle = Rokkstar.createClass('core.graphics.Rectangle', 'core.graphics.ClosedGraphicsElement', function () {
    /**
     *
     * @param {CanvasRenderingContext2D} graphics
     */
    this.drawPath = function (graphics, x, y, w, h) {
        var corner = this.getCorner();
        var topLeftCorner = this.getTopLeftCorner();
        var topRightCorner = this.getTopRightCorner();
        var bottomLeftCorner = this.getBottomLeftCorner();
        var bottomRightCorner = this.getBottomRightCorner();
        if (topLeftCorner === undefined) topLeftCorner = corner;
        if (topRightCorner === undefined) topRightCorner = corner;
        if (bottomLeftCorner === undefined) bottomLeftCorner = corner;
        if (bottomRightCorner === undefined) bottomRightCorner = corner;

        if (topLeftCorner == 0 && topRightCorner == 0 && bottomLeftCorner == 0 && bottomLeftCorner == 0) {
            graphics.beginPath();
            graphics.rect(x, y, w, h);
            graphics.closePath();
        } else {
            graphics.beginPath();
            graphics.moveTo(x + topLeftCorner, y);
            graphics.lineTo(x + w - topRightCorner, y);
            if (topRightCorner != 0) {
                graphics.quadraticCurveTo(x + w, y, x + w, y + topRightCorner);
            }
            graphics.lineTo(x + w, y + h - bottomRightCorner);
            if (bottomRightCorner != 0) {
                graphics.quadraticCurveTo(x + w, y + h, x + w - bottomRightCorner, y + h);
            }
            graphics.lineTo(x + bottomLeftCorner, y + h);
            if (bottomLeftCorner != 0) {
                graphics.quadraticCurveTo(x, y + h, x, y + h - bottomLeftCorner);
            }
            graphics.lineTo(x, y + topLeftCorner);
            if (topLeftCorner != 0) {
                graphics.quadraticCurveTo(x, y, x + topLeftCorner, y);
            }
            graphics.closePath();
        }
    }
}, [new Attr('corner', 0, 'integer'), new Attr('topLeftCorner', undefined, 'integer'), new Attr('topRightCorner', undefined, 'integer'), new Attr('bottomLeftCorner', undefined, 'integer'), new Attr('bottomRightCorner', undefined, 'integer')]);
