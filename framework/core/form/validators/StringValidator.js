/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /**
 * @classdef The StringValidator class validates that the length of a String is within a specified range.
 * @class
 * @name StringValidator
 * @package core.form.validators
 * @augments core.form.validators.Validator
 */
core.form.validators.StringValidator = Rokkstar.createClass('core.form.validators.StringValidator', 'core.form.validators.Validator', function () {
    "use strict";

    /**
     *
     * @param {String} value
     * @return {*}
     */
    this.doValidation = function (value) {
        var errors = this.callSuper('doValidation', value);
        if (errors.length !== 0) { return errors; }
        if (!isNaN(this.getMaxLength()) && value.length > this.getMaxLength()) {
            errors.push(core.form.validators.ValidationResult(true, this.subField, this.getTooLongError(), "TOO_LONG_ERROR"));
            return errors;
        }
        if (!isNaN(this.getMinLength()) && value.length < this.getMaxLength()) {
            errors.push(core.form.validators.ValidationResult(true, this.subField, this.getTooShortError(), "TOO_SHORT_ERROR"));
            return errors;
        }
        return errors;
    };


}, [new Attr('maxLength', NaN, 'integer'), new Attr('minLength', NaN, 'integer'), new Attr('tooLongError', 'This string is longer than the maximum allowed length. This must be less than {0} characters long.', 'string'), new Attr('tooShortError', 'This string is shorter than the minimum allowed length. This must be at least {0} characters long.', 'string')]);