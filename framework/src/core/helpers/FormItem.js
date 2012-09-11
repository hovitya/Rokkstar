/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
 * @classdesc Abstract base class for form input elements
 * @augments core.SkinnableComponent
 * @borrows core.behaviours.FormItemBehaviour#_refreshLabel
 * @borrows core.behaviours.FormItemBehaviour#doValidation
 * @borrows core.behaviours.FormItemBehaviour#validate
 * @borrows core.behaviours.FormItemBehaviour#formItemCreateAttributes
 * @borrows core.behaviours.FormItemBehaviour#formItemInit
 * @borrows core.behaviours.FormItemBehaviour#labelNode
 * @class
 */
core.helpers.FormItem = Rokkstar.createClass('core.helpers.FormItem', 'core.SkinnableComponent', function () {
        "use strict";

        this.init = function () {
            this.callSuper('init');
            this.formItemInit();
            this.createEventListener('disabledPropertyChanged', this.invalidateSkinState, this);
            this.createEventListener('invalid', this.__validationHandler, this);
            this.createEventListener('valid', this.__validationHandler, this);
            this.createEventListener('tabIndexPropertyChanged', this.tabIndexChanged, this);
            this.createEventListener('mouseover', this.__mouseEvent, this);
            this.createEventListener('mouseout', this.__mouseEvent, this);
        };

        /**
         *
         * @param event
         * @private
         */
        this.__mouseEvent = function (event) {
            if (event.type === 'mouseover') {
                this.over = true;
            } else {
                this.over = false;
            }
            this.invalidateSkinState();
        };

        this.tabIndexChanged = function () {
            if (this.hasSkinPart('input')) {
                this.updateTabIndex(this.getTabIndex());
            }
        };

        /**
         * Sets tab index to DOM element. You must override it in subclasses.
         * @param {integer} newIndex The new tab index.
         */
        this.updateTabIndex = function (newIndex) {
            $(this.domElement).attr('tabindex', newIndex);
        };

        /**
         * @protected
         * @param {core.form.validators.ValidationResultEvent} event
         */
        this.__validationHandler = function (event) {
            if (event.type === 'invalid') {
                this.setValid(false);
            } else if (event.type === 'valid') {
                this.setValid(true);
            }
        };

        this.focus = false;

        this.over = false;

        this.getSkinState = function () {
            if (this.getDisabled()) {
                return 'disabled';
            } else if (this.focus) {
                return 'active';
            } else if (!this.getValid()) {
                return 'invalid';
            } else if (this.over) {
                return 'over';
            } else {
                return 'normal';
            }
        };


    }, [new Attr('label', '', 'string'), new Attr('disabled', false, 'boolean'), new Attr('valid', true, 'boolean'), new Attr('tabIndex', 0, 'integer')],
    ['core.behaviours.FormItemBehaviour']);