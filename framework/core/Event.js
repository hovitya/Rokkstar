core.Event = Rokkstar.createClass('core.Event', undefined, function () {
    this.type = null;
    this.currentTarget = null;

    this.construct = function (type) {
        this.type = type;
    };

    this.stopPropagation = function () {

    };
});