/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Validate field against regular expression
 * @class
 * @name RegExpValidator
 * @package core.form.validators
 * @augments core.form.validators.Validator
 */
core.form.validators.RegExpValidator = Rokkstar.createClass('core.form.validators.RegExpValidator', 'core.form.validators.Validator', function () {
    "use strict";

    this.doValidation = function (value) {
        var errors = this.callSuper('doValidation', value), expression, errorEvent;
        if (errors.length !== 0) {return errors; }
        if (this.getExpression() !== '') {
            expression = new RegExp(this.getExpression(), this.getFlags());
            if (!expression.test(value)) {
                errorEvent = new core.form.validators.ValidationResult(true, this.subField, this.getNoMatchError(), "NO_MATCH_ERROR");
                errors.push(errorEvent);
            }
        } else {
            errorEvent = new core.form.validators.ValidationResult(true, this.subField, this.getNoExpressionError(), "NO_EXPRESSION_ERROR");
            errors.push(errorEvent);
        }
        return errors;
    };

}, [new Attr('expression', '', 'string'), new Attr('flags', '', 'string'), new Attr('noExpressionError', 'The expression is missing.', 'string'), new Attr('noMatchError', 'The field is invalid.', 'string')]);