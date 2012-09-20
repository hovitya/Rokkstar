/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.VisualContainer
 * @class
 * @name VisualContainer
 * @package core
 */
core.Group = Rokkstar.createClass('core.Group', 'core.VisualContainer', function () {

    this.init = function () {
        this.callSuper('init');
        this.createEventListener('clipAndEnableScrollingPropertyChanged', this.invalidateScrolling, this);
    };

    this.scrollingInvalid = true;

    this.invalidateScrolling = function () {
        this.scrollingInvalid = true;
        this.invalidateProperties();
    };

    this.commitProperties = function () {
        this.callSuper('commitProperties');
        if (this.scrollingInvalid) {
            this.scrollingInvalid = false;
            if (this.getClipAndEnableScrolling() == true) {
                $(this.domElement).css({overflow:'hidden'});
            } else {
                $(this.domElement).css({overflow:'visible'})
            }
        }
    };


}, [new Attr('clipAndEnableScrolling', false, 'boolean')]);