/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.Group
 * @constructor
 */
core.Skin = Rokkstar.createClass('core.Skin', 'core.Group', function () {
    extend(this, 'core.Group');
    /**
     * Host component
     * @type {*}
     */
    this.hostComponent = null;

    this.invalidateDisplayList = function () {
        this.componentInvalid = true;
        if (this.hostComponent != undefined && this.hostComponent != null) this.hostComponent.invalidateDisplayList();
    }

    this.init = function () {
        this.callSuper('init');
        //Set properties to fill the component item
        this.setLeft(0);
        this.setRight(0);
        this.setTop(0);
        this.setBottom(0);
    }
});
