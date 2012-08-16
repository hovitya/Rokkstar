core.FilterRenderer = function () {
    extend(this, 'core.DrawableComponent');
    this.currentComp;
    this.bcolor = '#FFFFFF';
    this.renderTo = function (drawableComponent) {
        this.canvas.getContext('2d').restore();
        this.currentComp = drawableComponent;
        this.canvas.width = this.currentComp.canvas.width;
        this.canvas.height = this.currentComp.canvas.height;
        this.render();
    }
    this.alpha = 1.0;

    this.canvas.getContext('2d').save();
    this.applyOperation = "destination-over";
    this.applyNum = 1;

    this.render = function () {
    }

    this.reapply = function (comp) {
        this.currentComp = comp;
        for (var i = 0; i < this.applyNum; i++) {
            this.apply();
        }
    }

    this.apply = function () {
        var ctx = this.currentComp.canvas.getContext('2d');
        var oldOperation = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = this.applyOperation;
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.canvas, 0, 0);
        ctx.globalAlpha = oldA;
        ctx.globalCompositeOperation = oldOperation;
    }

    this.rate = 1;

}