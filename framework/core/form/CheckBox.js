/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @classdef CheckBox form item.
 * @class
 * @name CheckBox
 * @package core.form
 * @augments core.helpers.FormItem
 */
core.form.CheckBox = Rokkstar.createClass('core.form.CheckBox', 'core.helpers.FormItem', function () {
    "use strict";

    this.getValue = function () {
        //Value is always empty if not checked
        if (this.checked) {
            return this.___value;
        }
        return "";
    };
}, [new Attr('value', "checked", 'string'),
    new Attr('checked', false, 'boolean')]);