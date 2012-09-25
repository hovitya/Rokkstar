/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Create new Component instance
 * @class
 * @author Horváth Viktor
 * @extends core.EventDispatcher
 * @attribute {String} id
 */
core.Component =  function () {
    "use strict";

    this.init = function () {
        //Doing nothing here
    };


    this.Component = function () {
        this.init();
        this.triggerEvent('initialized');
    };

};
