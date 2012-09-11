core.exceptions.SkinException = function (message, code) {
    extend(this, 'core.exceptions.Exception');
    this.message = message;
    this.code = code;
    this.type = "core.exceptions.SkinException";
}