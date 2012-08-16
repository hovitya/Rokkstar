/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Creates new SkinnableComponent instance
 * @class Ancestor class for components which are using skin system.
 * @augments core.VisualComponent
 * @borrows core.behaviours.SkinnableBehaviour#declareSkinPart
 * @constructor
 */
core.SkinnableComponent = Rokkstar.createClass('core.SkinnableComponent', 'core.VisualComponent', function () {


    this.init = function () {
        this.callSuper('init');
        this.skinnableInit();
    }

    this.tack = function () {
        this.callSuper('tack');
        this.skinnableTack();
    }

    this.measure = function () {
        var mW = this.measuredWidth;
        var mH = this.measuredHeight;
        this.skinnableMeasure();
        if ((mH != this.measuredHeight || mW != this.measuredWidth) && this.parent != null) {
            this.parent.invalidateLayout();
        }
    }

    this.commitProperties = function () {
        this.callSuper('commitProperties');
        this.skinnableCommitProperties();
    }


}, [new Attr('skinClass', undefined), new Attr('skin', undefined, 'core.Skin')], ['core.behaviours.SkinnableBehaviour']);