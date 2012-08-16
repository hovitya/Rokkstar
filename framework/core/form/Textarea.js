/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/**
 * @classdef Multiline text area component
 * @class
 * @name Textarea
 * @package core.form
 * @augments core.helpers.FormItem
 */
core.form.Textarea = Rokkstar.createClass('core.form.Textarea', 'core.helpers.FormItem', function () {
    "use strict";

    this.createAttributes = function () {
        this.callSuper('createAttributes');
        this.declareSkinPart('input', true, 'core.form.TextareaBase');
    };


    this.init = function () {
        this.callSuper('init');
        this.setSkinClass('core.skins.TextareaSkin');

        this.createEventListener('valuePropertyChanged', this._commit, this);


    };

    this.updateTabIndex = function (newIndex) {
        $(this.getSkinPart('input').domElement).attr('tabindex', newIndex);
    };

    this.partAdded = function (name, instance) {
        this.callSuper('partAdded', name, instance);
        if (name === 'input') {
            instance.createEventListener('focus', this.focused, this);
            instance.createEventListener('blur', this.blurred, this);
            instance.createEventListener('valuePropertyChanged', this._inputChanged, this);
        }
    };

    this.partRemoved = function (name, instance) {
        this.callSuper('partRemoved', name, instance);
        if (name === 'input') {
            instance.deleteEventListener('focus', this.focused, this);
            instance.deleteEventListener('blur', this.blured, this);
            instance.deleteEventListener('valuePropertyChanged', this._inputChanged, this);
        }
    };

    this.focused = function (event) {
        this.focus = true;
        this.invalidateSkinState();
    };

    this.blurred = function (event) {
        this.focus = false;
        this.invalidateSkinState();
        this.triggerEvent('valueCommit');
    };

    this._commitEnabled = true;

    /**
     *
     * @param {core.events.PropertyChangeEvent} event
     * @private
     */
    this._inputChanged = function (event) {
        this._commitEnabled = false;
        this.setValue(event.newValue);
        this._commitEnabled = true;
    };

    this._commit = function (event) {
        if (this._commitEnabled && this.hasSkinPart('input')) {
            this.getSkinPart('input').setValue(this.getValue());
        }
    };

}, [new Attr('value', "", 'string')]);