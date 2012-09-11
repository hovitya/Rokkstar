/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
 * @augments core.VisualComponent
 * @constructor
 */
core.InputBase = Rokkstar.createClass('core.InputBase', 'core.VisualComponent', function () {
    "use strict";

    this.init = function () {
        this.callSuper('init');
        this.createEventListener('keyup', this._inputChanged, this);
        this.createEventListener('disabledPropertyChanged', this._disabledChanged, this);
        this.createEventListener('valuePropertyChanged', this._valueChanged, this);
        this.createEventListener('fontColorPropertyChanged', this.invalidateFont, this);
        this.createEventListener('fontSizePropertyChanged', this.invalidateFont, this);
        this.createEventListener('fontFamilyPropertyChanged', this.invalidateFont, this);
    };

    this.createDomElement = function () {
        this.domElement = document.createElement('input');
        this.domElement.style[Modernizr.prefixed('boxSizing')] = 'border-box';
        this.domElement.style.position = 'absolute';
    };

    this._valueChanged = function () {
        this.domElement.value = this.getValue();
    };

    this._inputChanged = function () {
        this.setValue(this.domElement.value);
    };

    this._disabledChanged = function () {
        this.domElement.disabled = this.getDisabled();
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
        }
    };

}, [new Attr('value', "", 'string'), new Attr('disabled', false, 'boolean'), new Attr('fontFamily', 'PTSansRegular', 'string'), new Attr('fontColor', '#000000', 'string'), new Attr('fontSize', 12, 'integer'), new Attr('textAlign', 'left', 'string')]);
