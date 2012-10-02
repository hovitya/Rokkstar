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
 * @classdesc
 * Base class for layout manager classes which has vertical and horizontal align and gap.
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @extends core.layouts.Layout
 * @version 1.0
 */
core.layouts.AlignmentLayout =  function () {
    "use strict";

    /**
     * Horizontal align.
     * Correct values are: left,right,center.
     * @bindable
     * @type {String}
     */
    this.horizontalAlign = "left";

    /**
     * Vertical align.
     * Correct values are: top,bottom,middle.
     * @bindable
     * @type {String}
     */
    this.verticalAlign = "top";

    /**
     * Gap between elements
     * @bindable
     * @type {Number}
     */
    this.gap = 0;


    this.init = function () {
        this.superClass.init();
        this.createEventListener('gapPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('verticalAlignPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('horizontalAlignPropertyChanged', this.selfRefreshLayout, this);
    };

};