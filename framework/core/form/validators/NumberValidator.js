/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @classdesc <p>The NumberValidator class ensures that a String represents a valid number. It can ensure that the input
 * falls within a given range (specified by minValue and maxValue), is an integer (specified by domain), is non-negative
 * (specified by allowNegative), and does not exceed the specified precision. The validator correctly validates
 * formatted numbers (e.g., "12,345.67") and you can customize the thousandsSeparator and decimalSeparator properties
 * for internationalization.</p>
 *
 * @xml
 * <p>The <code><rx:NumberValidator></code> tag inherits all of the tag attributes of its superclass, and adds the following tag attributes:</p>
 * <pre>
 * <rx:NumberValidator
 *      allowNegative="true|false"
 *      decimalPointCountError="The decimal separator can only occur once."
 *      decimalSeparator="."
 *      domain="real|int"
 *      exceedsMaxError="The number entered is too large."
 *      integerError="The number must be an integer."
 *      invalidCharError="The input contains invalid characters."
 *      invalidFormatCharsError="One of the formatting parameters is invalid."
 *      lowerThanMinError="The amount entered is too small."
 *      maxValue="NaN"
 *      minValue="NaN"
 *      negativeError="The amount may not be negative."
 *      precision="-1"
 *      precisionError="The amount entered has too many digits beyond the decimal point."
 *      separationError="The thousands separator must be followed by three digits."
 *      thousandsSeparator=","
 * />
 * </pre>
 * @class
 * @name NumberValidator
 * @package core.form.validators
 * @augments core.form.validators.Validator
 */
core.form.validators.NumberValidator = Rokkstar.createClass('core.form.validators.NumberValidator', 'core.form.validators.Validator', function () {
    "use strict";

    this.doValidation = function (value) {
        var errors = this.callSuper('doValidation', value);
        if (errors.length > 0) { return errors; }
        if (this.isRealValue(value)) {
            return core.form.validators.NumberValidator.validateNumber(this, value, null);
        } else { return []; }
    };


}, [new Attr('allowNegative', true, 'boolean'),
    new Attr('decimalPointCountError', "The decimal separator can only occur once.", 'string'),
    new Attr('decimalSeparator', '.', 'string'),
    new Attr('domain', 'real', 'string'),
    new Attr('exceedsMaxError', 'The number entered is too large.', 'string'),
    new Attr('integerError', "The number must be an integer.", 'string'),
    new Attr('invalidCharError', "The input contains invalid characters.", 'string'),
    new Attr('invalidFormatCharsError', "One of the formatting parameters is invalid.", 'string'),
    new Attr('lowerThanMinError', "The amount entered is too small.", 'string'),
    new Attr('maxValue', NaN, 'float'),
    new Attr('minValue', NaN, 'float'),
    new Attr('negativeError', "The amount may not be negative.", 'string'),
    new Attr('precision', -1, 'integer'),
    new Attr('precisionError', "The amount entered has too many digits beyond the decimal point.", 'string'),
    new Attr('separationError', "The thousands separator must be followed by {0} digits.", 'string'),
    new Attr('thousandsSeparator', ',', 'string')]);

/**
 * Convenience method for calling a validator from within a custom validation function.
 * @static
 * @param {core.form.validators.NumberValidator} validator
 * @param {object} value
 * @param {string} baseField
 */
core.form.validators.NumberValidator.validateNumber = function (validator, value, baseField) {
    "use strict";
    var allowNegative = validator.getAllowNegative(), decimalSeparator = validator.getDecimalSeparator(),
        domain = validator.getDomain(), maxValue = validator.getMaxValue(), minValue = validator.getMinValue(),
        precision = validator.getPrecision(), thousandsSeparator = validator.getThousandsSeparator(),
        input = String(value), len = input.length, isNegative = false, i = 0, c = "",
        invalidFormChars = "0123456789-", errors = [], validChars = invalidFormChars + thousandsSeparator + decimalSeparator,
        decimalSeparatorIndex, end, numDigitsAfterDecimal, left, right, dIndex, dLeft, dRight, x;

    if (decimalSeparator === thousandsSeparator || invalidFormChars.indexOf(decimalSeparator) !== -1 || invalidFormChars.indexOf(thousandsSeparator) !== -1 || decimalSeparator.length !== 1 || thousandsSeparator.length !== 1) {
        errors.push(new core.form.validators.ValidationResult(true, baseField, validator.getInvalidFormatCharsError(), "INVALID_FORMAT_CHARS_ERROR"));
        return errors;
    }

    for (i = 0; i < len; i++) {
        c = input.charAt(i);
        if (validChars.indexOf(c) === -1) {
            errors.push(new core.form.validators.ValidationResult(true, baseField, "INVALID_CHAR_ERROR", validator.getInvalidCharError()));
            return errors;
        }
    }

    // Check if the input is negative.
    if (input.charAt(0) === "-") {
        if (len === 1) {
            errors.push(new core.form.validators.ValidationResult(true, baseField, "INVALID_CHAR_ERROR", validator.getInvalidCharError()));
            return errors;
        } else if (len === 2 && input.charAt(1) === '.') {
            errors.push(new core.form.validators.ValidationResult(true, baseField, "INVALID_CHAR_ERROR", validator.getInvalidCharError()));
            return errors;
        }

        if (!allowNegative) {
            errors.push(new core.form.validators.ValidationResult(true, baseField, "NEGATIVE_ERROR", validator.getNegativeError()));
            return errors;
        }

        input = input.substring(1);
        len--;
        isNegative = true;
    }

    if (input.indexOf(decimalSeparator) !== input.lastIndexOf(decimalSeparator)) {
        errors.push(new core.form.validators.ValidationResult(true, baseField, "DECIMAL_POINT_COUNT_ERROR", validator.getDecimalPointCountError()));
        return errors;
    }

    // Make sure every character after the decimal is a digit,
    // and that there aren't too many digits after the decimal point:
    // if domain is int there should be none,
    // otherwise there should be no more than specified by precision.
    decimalSeparatorIndex = input.indexOf(decimalSeparator);
    if (decimalSeparatorIndex !== -1) {
        numDigitsAfterDecimal = 0;

        if (i === 1 && i === len) {
            errors.push(new core.form.validators.ValidationResult(true, baseField, "INVALID_CHAR_ERROR", validator.getInvalidCharError()));
            return errors;
        }

        for (i = decimalSeparatorIndex + 1; i < len; i++) {
            // This character must be a digit.
            if ("0123456789".indexOf(input.charAt(i)) === -1) {
                errors.push(new core.form.validators.ValidationResult(true, baseField, "INVALID_CHAR_ERROR", validator.getInvalidCharError()));
                return errors;
            }

            ++numDigitsAfterDecimal;

            // There may not be any non-zero digits after the decimal
            // if domain is int.
            if (domain === "int" && input.charAt(i) !== "0") {
                errors.push(new core.form.validators.ValidationResult(true, baseField, "INTEGER_ERROR", validator.getIntegerError()));
                return errors;
            }

            // Make sure precision is not exceeded.
            if (precision !== -1 && numDigitsAfterDecimal > precision) {
                errors.push(new core.form.validators.ValidationResult(true, baseField, "PRECISION_ERROR", validator.getPrecisionError()));
                return errors;
            }
        }
    }

    // Make sure the input begins with a digit or a decimal point.
    if ("0123456789".indexOf(input.charAt(0)) === -1 && input.charAt(0) !== decimalSeparator) {
        errors.push(new core.form.validators.ValidationResult(true, baseField, "INVALID_CHAR_ERROR", validator.getInvalidCharError()));
        return errors;
    }

    // Make sure that every character before the decimal point
    // is a digit or is a thousands separator.
    // If it's a thousands separator,
    // make sure it's followed by three consecutive digits.
    end = decimalSeparatorIndex === -1 ? len : decimalSeparatorIndex;
    for (i = 1; i < end; i++) {
        c = input.charAt(i);
        if (c === thousandsSeparator) {
            if (c === thousandsSeparator) {
                if ((end - i !== 4 && input.charAt(i + 4) !== thousandsSeparator) || "0123456789".indexOf(input.charAt(i + 1)) === -1 || "0123456789".indexOf(input.charAt(i + 2)) === -1 || "0123456789".indexOf(input.charAt(i + 3)) === -1) {
                    errors.push(new core.form.validators.ValidationResult(true, baseField, "SEPARATION_ERROR", validator.getSeparationError()));
                    return errors;
                }
            }
        } else if ("0123456789".indexOf(c) === -1) {
            errors.push(new core.form.validators.ValidationResult(true, baseField, "INVALID_CHAR_ERROR", validator.getInvalidCharError()));
            return errors;
        }
    }

    // Make sure the input is within the specified range.
    if (!isNaN(minValue) || !isNaN(maxValue)) {
        // First strip off the thousands separators.
        for (i = 0; i < end; i++) {
            if (input.charAt(i) === thousandsSeparator) {
                left = input.substring(0, i);
                right = input.substring(i + 1);
                input = left + right;
            }
        }

        // Translate the value back into standard english
        // If the decimalSeperator is not '.' we need to change it to '.'
        // so that the number casting will work properly
        if (validator.decimalSeparator !== '.') {
            dIndex = input.indexOf(validator.getDecimalSeparator());
            if (dIndex !== -1) {
                dLeft = input.substring(0, dIndex);
                dRight = input.substring(dIndex + 1);
                input = dLeft + '.' + dRight;
            }
        }

        x = Number(input);

        if (isNegative) {
            x = -x;
        }

        if (!isNaN(minValue) && x < minValue) {
            errors.push(new core.form.validators.ValidationResult(true, baseField, "LOWER_THAN_MIN_ERROR", validator.getLowerThanMinError()));
            return errors;
        }

        if (!isNaN(maxValue) && x > maxValue) {
            errors.push(new core.form.validators.ValidationResult(true, baseField, "EXCEEDS_MAX_ERROR", validator.getExceedsMaxError()));
            return errors;
        }
    }

    return errors;
};