/**
 *  @class
 *  @classdesc
 *  Rokkstar base object
 *  @extends Object
 */
core.Object = function () {
    "use strict";

    this.Object = function () {
        this.superClass();
        console.log("core.Object created");
    };

    /**
     * Static instanceOf method
     * @static
     * @param {*} obj
     * @param {*} type
     */
    this.instanceOf = function (obj, type) {
        return obj.instanceOf(type);
    };
};