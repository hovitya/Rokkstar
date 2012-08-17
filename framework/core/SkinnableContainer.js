/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Creates new Skinnable Container instance.
 * @classdesc Super class for Skinnable Container instances.
 * @augments core.VisualContainer
 * @borrows core.behaviours.SkinnableBehaviour#addSkin as addSkin
 * @borrows core.behaviours.SkinnableBehaviour#attachSkin as attachSKin
 * @borrows core.behaviours.SkinnableBehaviour#createFocusRectangle as createFocusRectangle
 * @borrows core.behaviours.SkinnableBehaviour#declareSkinPart as declareSkinPart
 * @borrows core.behaviours.SkinnableBehaviour#definedSkinParts as definedSkinParts
 * @borrows core.behaviours.SkinnableBehaviour#detachSkin as detachSkin
 * @borrows core.behaviours.SkinnableBehaviour#getHeight as getHeight
 * @borrows core.behaviours.SkinnableBehaviour#getSkin as getSkin
 * @borrows core.behaviours.SkinnableBehaviour#getSkinPart as getSkinPart
 * @borrows core.behaviours.SkinnableBehaviour#getSkinState as getSkinState
 * @borrows core.behaviours.SkinnableBehaviour#getWidth as getWidth
 * @borrows core.behaviours.SkinnableBehaviour#hasSkinPart as hasSkinPart
 * @borrows core.behaviours.SkinnableBehaviour#invalidateSize as invalidateSize
 * @borrows core.behaviours.SkinnableBehaviour#invalidateSkin as invalidateSkin
 * @borrows core.behaviours.SkinnableBehaviour#invalidateSkinState as invalidateSkinState
 * @borrows core.behaviours.SkinnableBehaviour#partAdded as partAdded
 * @borrows core.behaviours.SkinnableBehaviour#partRemoved as partRemoved
 * @borrows core.behaviours.SkinnableBehaviour#removeFocusRectangle as removeFocusRectangle
 * @borrows core.behaviours.SkinnableBehaviour#removeSkin as removeSkin
 * @borrows core.behaviours.SkinnableBehaviour#skin as skin
 * @borrows core.behaviours.SkinnableBehaviour#skinInvalid as skinInvalid
 * @borrows core.behaviours.SkinnableBehaviour#skinnableCommitProperties as skinnableCommitProperties
 * @borrows core.behaviours.SkinnableBehaviour#skinnableCreateAttributes as skinnableCreateAttributes
 * @borrows core.behaviours.SkinnableBehaviour#skinnableInit as skinnableInit
 * @borrows core.behaviours.SkinnableBehaviour#skinnableMeasure as skinnableMeasure
 * @borrows core.behaviours.SkinnableBehaviour#skinnableTack as skinnableTack
 * @borrows core.behaviours.SkinnableBehaviour#skinParts as skinParts
 * @borrows core.behaviours.SkinnableBehaviour#skinStateInvalid as skinStateInvalid
 * @borrows core.behaviours.SkinnableBehaviour#_changeSkin as _changeSkin
 * @constructor
 */
core.SkinnableContainer = Rokkstar.createClass('core.SkinnableContainer', 'core.VisualContainer', function () {
    "use strict";
    /**
     * @protected
     * @type {core.layouts.ConstraintLayout}
     */
    this.constraintLayout = null;

    /**
     * @protected
     * @type {Array}
     */
    this.pendingElements = [];

    /**
     * @override
     * @param {core.VisualComponent} element
     */
    this.addElement = function (element) {
        try {
            this.getSkinPart('content').addElement(element);
        } catch (ex) {
            this.pendingElements.push(element);
        }
    };

    /**
     * @override
     * @param {core.VisualComponent} element
     * @param {int} position
     */
    this.addElementAt = function (element, position) {
        try {
            this.getSkinPart('content').addElementAt(element, position);
        } catch (ex) {
            //if(ex['type']!=undefined && ex['type']=="core.exceptions.SkinException"){
            this.pendingElements.splice(position, 0, element);
            //}else{
            //    throw ex;
            //}

        }

    };

    /**
     * @override
     * @param {core.VisualComponent} element
     */
    this.removeElement = function (element) {
        this.getSkinPart('content').removeElement(element);
    };


    this.removeElementAt = function (position) {
        this.getSkinPart('content').removeElementAt(position);
    };

    this.removeAllElements = function () {
        this.getSkinPart('content').removeAllElements();
    };

    this.getElementsNum = function () {
        return this.getSkinPart('content').getElementsNum();
    };

    this.getElementAt = function (position) {
        return this.getSkinPart('content').getElementAt(position);
    };

    this.getElementIndex = function (element) {
        return this.getSkinPart('content').getElementIndex(element);
    };


    this.partAdded = function (name, instance) {
        var i;
        if (name === 'content') {
            if (this.constraintLayout === null) { this.constraintLayout = this.createComponent('core.layouts.ConstraintLayout'); }
            this.redirectProperty('layout', instance, this.constraintLayout);
            for (i in this.pendingElements) {
                if (this.pendingElements.hasOwnProperty(i)) { instance.addElement(this.pendingElements[i]); }
            }
            this.pendingElements = [];
        }
    };

    this.partRemoved = function (name, instance) {
        var i;
        if (name === 'content') {
            this.clearPropertyRedirection('layout');
            for (i = 0; i < instance.getElementsNum(); i++) {
                this.pendingElements.push(instance.getElementAt(i));
            }
            instance.removeAllElements();
        }
    };


    this.removeSkin = function (skin) {
        this.callSuper('removeElement', skin);
    };

    this.addSkin = function (skin) {
        this.callSuper('addElement', skin);
    };

    this.createAttributes = function () {
        this.callSuper('createAttributes');
        this.declareSkinPart('content', true, 'core.Container');
    };

    this.init = function () {
        this.callSuper('init');
        this.skinnableInit();
        for (var i in this.xmlContentArray) {
            this.addElement(this.xmlContentArray[i]);
        }
    };

    this.tack = function () {
        this.callSuper('tack');
        this.skinnableTack();
    };

    this.measure = function () {
        var mW = this.measuredWidth;
        var mH = this.measuredHeight;
        this.skinnableMeasure();
        if ((mH !== this.measuredHeight || mW !== this.measuredWidth) && this.parent != null) {
            this.parent.invalidateLayout();
        }
    };


    this.commitProperties = function () {
        this.callSuper('commitProperties');
        this.skinnableCommitProperties();
    };


}, [new Attr('skinClass', undefined, 'string'),
    new Attr('skin', undefined, 'core.Skin')],
    ['core.behaviours.SkinnableBehaviour']);