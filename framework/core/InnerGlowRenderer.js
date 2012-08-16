core.InnerGlowRenderer = function () {
    extend(this, 'core.DropshadowRenderer');
    this.color = "red";
    this.dx = 0;
    this.rate = 10;
    this.dy = 0;
    this.alpha = 1.0;
    this.applyOperation = "source-atop";
    this.shadowOperation = "xor";
    this.applyNum = 1;
}