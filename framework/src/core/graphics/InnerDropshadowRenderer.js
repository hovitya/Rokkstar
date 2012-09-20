/**
 *
 * @class
 */
core.InnerDropshadowRenderer = function () {
    extend(this, 'core.DropshadowRenderer');

    this.dx = 4;
    this.dy = 4;
    this.rate = 2;
    this.alpha = 1.0;
    this.applyOperation = "source-atop";
    this.shadowOperation = "xor";
    this.applyNum = 1;

}