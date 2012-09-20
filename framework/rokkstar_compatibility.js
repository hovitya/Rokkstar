//Compatibility test
(function () {
    "use strict";
    if (!Object.create || !Object.defineProperty) {
        throw new Error("This browser is not compatible with Rokkstar!");
    }
}());

/*
 * Creating an instanceOf function which is compatible both Rokkstar objects and standard js objects too.
 */
Object.defineProperty(Object.prototype, "instanceOf", {
    writeable: false,
    enumerable: false,
    configurable: false,
    value: function (type) {
        "use strict";

        //workaround for primitive types
        if (type === String  && typeof this === "string") { return true; }
        if (type === Number  && typeof this === "number") { return true; }
        if (type === Boolean  && typeof this === "boolean") { return true; }

        if (type instanceof Function) {
            if (this instanceof type) { return true; }
            if (type.prototype.__staticType && this.__dynamicTypes && this.__dynamicTypes.indexOf(type.prototype.__staticType) !== -1) { return true; }
        } else if (type instanceof Object) {
            if (type.__staticType && this.__dynamicTypes && this.__dynamicTypes.indexOf(type.__staticType) !== -1) { return true; }
        }
        return false;
    }
});

/**
 *
 * @namespace
 */
var Rokkstar = {};

Rokkstar.globals = {};

Rokkstar.globals.regex = {};

Rokkstar.globals.regex.pixelFormat = /^[0-9]+px$/;

Rokkstar.globals.regex.integerFormat = /^[0-9]+px$/;

Rokkstar.globals.regex.fragmentFormat = /^[0-9]+fr$/;

Rokkstar.globals.regex.percentFormat = /^[0-9]+%$/;

Rokkstar.requestAnimationFrame = Modernizr.prefixed('requestAnimationFrame', window) || function (callback) { window.setTimeout(callback, 1000 / 60); };

Rokkstar.toDegree = function (radians) {
    "use strict";
    var pi = Math.PI,
        deg = (radians) * (180 / pi);
    return Number(deg);
};

Rokkstar.toRadians = function (degree) {
    "use strict";
    var pi = Math.PI,
        rad = degree * (pi / 180);
    return Number(rad);
};

Rokkstar.hexToRgb = function (hex) {
    "use strict";
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

Rokkstar.globals.DOMEvents = ['mouseover',
    'mouseout',
    'mousemove',
    'blur',
    'mouseup',
    'mousedown',
    'touchend',
    'touchstart',
    'keyup',
    'keydown',
    'focus',
    'onload'];