/**
 *
 * @class
 * @name Parallel
 * @package core
 */
core.Parallel = Rokkstar.createClass('core.Parallel', 'core.Sequence', function () {
    "use strict";

    this.createTween = function () {
        this.tween = new Parallel();
        var scope = this, a = {};
        a.onMotionFinished = function () {
            scope.triggerEvent('animationEnded');
        };
        a.onMotionStarted = function () {
            scope.triggerEvent('animationStarted');
        };
        this.tween.addListener(a);
    };
});