core.RedCyan3DRenderer = function () {
    extend(this, 'core.FilterRenderer');
    this.applyOperation = "source-over";
    this.dx = 1;
    this.render = function () {
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(this.currentComp.canvas, 0, 0);
        var imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var imageData2 = ctx.createImageData(this.canvas.width, this.canvas.height);
        var pixels = imgData.data;
        for (var i = 0; i < imageData2.data.length; i += 4) {
            imageData2.data[i] = 255;
            imageData2.data[i + 1] = 255;
            imageData2.data[i + 2] = 255;
            imageData2.data[i + 3] = 255;
        }
        var M1 = $M([
            [0.299, 0.587, 0.114],
            [0, 0, 0],
            [0, 0, 0]
        ]);

        var M2 = $M([
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]);
        var colorCache = {};
        for (var i = this.dx * 4; i < pixels.length - this.dx * 4; i += 4) {
            //Left shifted image
            var r1 = pixels[i + this.dx * 4];
            var g1 = pixels[i + this.dx * 4 + 1];
            var b1 = pixels[i + this.dx * 4 + 2];
            //Right shifted image
            var r2 = pixels[i - this.dx * 4];
            var g2 = pixels[i - this.dx * 4 + 1];
            var b2 = pixels[i - this.dx * 4 + 2];
            var cacheStr = "a" + r1 + "a" + g1 + "a" + b1 + "a" + r2 + "a" + g2 + "a" + b2;

            if (colorCache[cacheStr] == undefined) {

                var V1 = $V([r1, g1, b1]);

                var V2 = $V([r2, g2, b2]);


                var V1R = M1.multiply(V1);
                var V2R = M2.multiply(V2);

                var VA = V1R.add(V2R);
                colorCache[cacheStr] = VA;
            } else {
                VA = colorCache[cacheStr];
            }

            imageData2.data[i] = VA.e(1);
            imageData2.data[i + 1] = VA.e(2);
            imageData2.data[i + 2] = VA.e(3);

            //fix alpha values
            if (imageData2.data[i] + imageData2.data[i + 1] + imageData2.data[i + 2] == 255 * 3) {
                imageData2.data[i + 3] = 0;
            }
        }

        ctx.putImageData(imageData2, 0, 0);
        this.currentComp.canvas.getContext('2d').clearRect(0, 0, this.currentComp.canvas.width, this.currentComp.canvas.height);
        this.apply();
    }
}
