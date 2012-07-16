/**
 * @classdesc Represents transformation matrix.
 * @class
 * @name core.Matrix
 * @param a
 * @param b
 * @param c
 * @param d
 * @param e
 * @param f
 */
core.Matrix=Rokkstar.createClass('core.Matrix',undefined,function(){
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;

    this.construct=function(a, b, c, d, e, f){
        if (a != null) {
            this.a = +a;
            this.b = +b;
            this.c = +c;
            this.d = +d;
            this.e = +e;
            this.f = +f;
        }
    }

    this.add = function (a, b, c, d, e, f) {
        var out = [[], [], []],
            m = [[this.a, this.c, this.e], [this.b, this.d, this.f], [0, 0, 1]],
            matrix = [[a, c, e], [b, d, f], [0, 0, 1]],
            x, y, z, res;

        if (a && Rokkstar.instanceOf(a,"core.Matrix")) {
            matrix = [[a.a, a.c, a.e], [a.b, a.d, a.f], [0, 0, 1]];
        }

        for (x = 0; x < 3; x++) {
            for (y = 0; y < 3; y++) {
                res = 0;
                for (z = 0; z < 3; z++) {
                    res += m[x][z] * matrix[z][y];
                }
                out[x][y] = res;
            }
        }
        this.a = out[0][0];
        this.b = out[1][0];
        this.c = out[0][1];
        this.d = out[1][1];
        this.e = out[0][2];
        this.f = out[1][2];
    };

    this.invert = function () {
        var me = this,
            x = me.a * me.d - me.b * me.c;
        return new core.Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
    };

    this.clone = function () {
        return new core.Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
    };

    this.translate = function (x, y) {
        this.add(1, 0, 0, 1, x, y);
    };

    this.shear = function(x, y, cx, cy){
        y == null && (y = x);
        (cx || cy) && this.add(1, 0, 0, 1, cx, cy);
        this.add(1, x, y, 1, 0, 0);
        (cx || cy) && this.add(1, 0, 0, 1, -cx, -cy);

    }

    this.scale = function (x, y, cx, cy) {
        y == null && (y = x);
        (cx || cy) && this.add(1, 0, 0, 1, cx, cy);
        this.add(x, 0, 0, y, 0, 0);
        (cx || cy) && this.add(1, 0, 0, 1, -cx, -cy);
    };

    this.rotate = function (a, x, y) {
        a = Rokkstar.toRadians(a);
        x = x || 0;
        y = y || 0;
        var cos = +Math.cos(a).toFixed(9),
            sin = +Math.sin(a).toFixed(9);
        this.add(cos, sin, -sin, cos, x, y);
        this.add(1, 0, 0, 1, -x, -y);
    };

    this.x = function (x, y) {
        return x * this.a + y * this.c + this.e;
    };

    this.y = function (x, y) {
        return x * this.b + y * this.d + this.f;
    };

    this.toString = function () {
        return "matrix(" + [this.a, this.b, this.c, this.d, this.e, this.f].join(',') + ")";
    };

    this.toFilter = function () {
        return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.a +
            ", M12=" + this.c + ", M21=" + this.b + ", M22=" + this.d +
            ", Dx=" + this.e + ", Dy=" + this.f + ", sizingmethod='auto expand')";
    };
    this.offset = function () {
        return [this.e.toFixed(4), this.f.toFixed(4)];
    };

    this.normalize=function(a) {
        var mag = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
        a[0] && (a[0] /= mag);
        a[1] && (a[1] /= mag);
    }

    this.extract = function () {
        var out = {};
        // translation
        out.dx = this.e;
        out.dy = this.f;

        // scale and shear
        var row = [[this.a, this.c], [this.b, this.d]];
        out.scalex = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
        this.normalize(row[0]);

        out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
        row[1] = [row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear];

        out.scaley = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
        this.normalize(row[1]);
        out.shear /= out.scaley;

        // rotation
        var sin = -row[0][1],
            cos = row[1][1];
        if (cos < 0) {
            out.rotate = Rokkstar.toDegree(Math.acos(cos));
            if (sin < 0) {
                out.rotate = 360 - out.rotate;
            }
        } else {
            out.rotate = Rokkstar.toDegree(Math.asin(sin));
        }

        out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
        out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
        out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
        return out;
    };

});