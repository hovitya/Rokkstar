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
 * @name ValidationResult
 * @package core.form.validators
 */
core.form.validators.ValidationResult = Rokkstar.createClass('core.form.validators.ValidationResult', undefined, function () {
    "use strict";

    this.isError = false;
    this.errorMessage = "";
    this.errorCode = "";
    this.subField = "";

    this.construct = function (isError, subField, errorMessage, errorCode) {
        this.isError = isError;
        this.subField = subField;
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
    };
});