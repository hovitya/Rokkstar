core.exceptions.Exception = Rokkstar.createClass('core.exceptions.Exception', undefined, function () {
    this.type = "core.exceptions.Exception";
    this.message;
    this.code;
    this.toString = function () {
        return this.type + ": " + this.message;
    }
});