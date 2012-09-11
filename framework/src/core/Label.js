/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.VisualComponent
 * @constructor
 */
core.Label = Rokkstar.createClass('core.Label', 'core.VisualComponent', function () {
    "use strict";
    this.init = function () {
        this.callSuper('init');
        this.createEventListener('textPropertyChanged', this._updateText, this);
        this.createEventListener('fontColorPropertyChanged', this.invalidateFont, this);
        this.createEventListener('fontSizePropertyChanged', this.invalidateFontSize, this);
        this.createEventListener('fontFamilyPropertyChanged', this.invalidateFont, this);
        this.createEventListener('fontWeightsPropertyChanged', this.invalidateFont, this);
        this.measuredContentHeight = 12;
        this.setWidth('auto');
        this.setHeight('auto');
        this.domElement.innerHTML = this.getText();
    };
    /**
     * @private
     *
     */
    this._updateText = function () {
        this.domElement.innerHTML = this.getText();
        if (this.getWidth() === 'auto' || this.getHeight() === 'auto') {
            this.invalidateSize();
        }
    };

    this.invalidateFontSize = function () {
        this.invalidateFont();
        this.measuredContentHeight = this.getFontSize();
        this.invalidateSize();
    };

    this.measure = function (pw, ph) {
        this.callSuper('measure', pw, ph);
        this.domElement.style.lineHeight = this.measuredHeight + "px";
    };

    this.fontInvalid = true;

    this.invalidateFont = function () {
        this.fontInvalid = true;
        this.invalidateProperties();
    };

    this.commitProperties = function () {
        this.callSuper('commitProperties');
        if (this.fontInvalid) {
            this.domElement.style.fontFamily = this.getFontFamily();
            this.domElement.style.fontSize = this.getFontSize().toString() + "px";
            this.domElement.style.color = this.getFontColor();
            this.domElement.style.textAlign = this.getTextAlign();
            this.domElement.style.fontWeight = this.getFontWeight();
        }
    };
}, [
    new Attr('text', '', 'string'),
    new Attr('fontFamily', 'PTSansRegular', 'string'),
    new Attr('fontColor', '#000000', 'string'),
    new Attr('fontSize', 12, 'integer'),
    new Attr('textAlign', 'left', 'string'),
    new Attr('fontWeight', 'normal', 'string')]);