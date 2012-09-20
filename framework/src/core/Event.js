/**
 *
 * @class
 * @name Event
 * @package core
 */
core.Event = Rokkstar.createClass('core.Event', undefined, function () {
    "use strict";
    this.type = null;
    this.currentTarget = null;

    this.construct = function (type) {
        this.type = type;
    };

    this.stopPropagation = function () {

    };
});