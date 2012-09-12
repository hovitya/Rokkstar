/* Rokkstar JavaScript Framework
 * 
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @class
 * @name Animation
 * @package core
 */
core.Animation = Rokkstar.createClass('core.Animation', 'core.helpers.AnimationBase', function () {
    "use strict";

    this.tween = null;
    this.startValue = 0;
    this.endValue = 0;
    this.propertyName = '';

    this.play = function (reversed) {
        if (this.isPlaying()) { this.fastForward(); }
        if (reversed === undefined) {
            reversed = false;
        }
        this.setUp(reversed);

        this.tween.start();

    };

    this.fastForward = function () {
        this.tween.fforward();
    };

    this.init = function () {
        this.callSuper('init');
        this.createTween();
        this.createEventListener('targetPropertyChanged', this.updateTween, this);
        this.createEventListener('typePropertyChanged', this.updateTween, this);
        this.createEventListener('suffixPropertyChanged', this.updateTween, this);
        this.createEventListener('durationPropertyChanged', this.updateTween, this);
        this.createEventListener('easingPropertyChanged', this.updateTween, this);
    };


    this.createTween = function () {
        var scope, a;
        this.tween = new Tween([], '', '', 0, 0, this.getDuration(), this.getSuffix());
        scope = this;
        a = {};
        a.onMotionFinished = function () {
            scope.triggerEvent('animationEnded');
        };
        a.onMotionStarted = function () {
            scope.triggerEvent('animationStarted');
        };
        this.tween.addListener(a);
    };

    this.updateTween = function () {
        this.tween.prop = this.propertyName;
        this.tween.type = this.getType();
        this.tween.setDuration(this.getDuration());
        this.tween.func = this.getEasing();
        this.tween.suffixe = this.getSuffix();
        this.tween.obj = [this.getTarget()];
        this.tween.begin = this.startValue;
        this.tween.setFinish(this.endValue);
    };


}, [new Attr('target', null, 'object'), new Attr('type', 'integer', 'string'), new Attr('suffix', '', 'string'),
    new Attr('duration', 0.5, 'float'), new Attr('easing', Tween.regularEaseInOut, 'function')],
    ['core.behaviours.ContainerBehaviour']);