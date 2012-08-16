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
 */
core.Sequence = Rokkstar.createClass('core.Sequence', 'core.helpers.AnimationBase', function () {
    this.tween = null;
    this.init = function () {
        this.callSuper('init');
        this.createTween();
        //this.createEventListener('elementsPropertyChanged',this.elementsChanged,this);
    }

    this.setUp = function (reversed) {
        this.tween.children = [];
        this.tween.numChildren = 0;

        if (!reversed) {
            for (var i = 0; i < this.getElementsNum(); i++) {
                this.getElementAt(i).transitionMode = this.transitionMode;
                this.getElementAt(i).startState = this.startState;
                this.getElementAt(i).endState = this.endState;
                this.getElementAt(i).setUp(reversed);
                this.tween.addChild(this.getElementAt(i).tween);
            }
        } else {
            for (var i = this.getElementsNum() - 1; i >= 0; i--) {
                this.getElementAt(i).transitionMode = this.transitionMode;
                this.getElementAt(i).startState = this.startState;
                this.getElementAt(i).endState = this.endState;
                this.getElementAt(i).setUp(reversed);
                this.tween.addChild(this.getElementAt(i).tween);
            }
        }

    }

    this.createTween = function () {
        this.tween = new Sequence();
        var scope = this;
        var a = {};
        a.onMotionFinished = function () {
            scope.triggerEvent('animationEnded');
        }
        a.onMotionStarted = function () {
            scope.triggerEvent('animationStarted');
        }
        this.tween.addListener(a);
    }

    this.elementsChanged = function (event) {
        this.tween.children = [];
        this.tween.numChildren = 0;

    }

    this.play = function (reversed) {
        if (this.isPlaying()) this.fastForward();
        this.setUp(reversed);
        this.tween.start();
    }

    this.stop = function () {
        this.tween.stop();
    }

    this.elements = [];

    this.getElementsNum = function () {
        return this.elements.length;
    }

    /**
     *
     * @param position
     * @return {core.VisualComponent}
     */
    this.getElementAt = function (position) {
        return this.elements[position];
    }

    this.getElementIndex = function (element) {
        return this.elements.indexOf(element);
    }

    this.removeElement = function (element) {
        if (this.getElementIndex(element) != -1) {
            this.elements.splice(this.elements.indexOf(element), 1);
            element.parent = null;
            element.triggerEvent("parentChanged");
            this.triggerEvent('elementsPropertyChanged');
        }
    }

    this.removeElementAt = function (position) {
        if (position >= 0 && position <= this.elements.length) {
            this.elements[position].parent = null;
            this.elements[position].triggerEvent("parentChanged");
            this.elements.splice(position, 1);
            this.triggerEvent('elementsPropertyChanged');
        }
    }

    this.removeAllElements = function () {
        for (var i in this.elements) {
            this.elements[i].parent = null;
            this.elements[i].triggerEvent("parentChanged");
        }
        this.elements = [];
        this.triggerEvent('elementsPropertyChanged');
    }


    this.addElement = function (element) {
        if (this.elements.indexOf(element) == -1) {
            if (element.parent != null) {
                element.parent.removeElement(element);
            }
            this.elements.push(element);
            element.parent = this;
            element.triggerEvent("parentChanged");
        } else {
            this.elements.splice(this.getElementIndex(element), 1);
            this.elements.push(element);

        }
        this.triggerEvent('elementsPropertyChanged');
    }

    this.addElementAt = function (element, position) {
        if (this.elements.indexOf(element) == -1) {
            if (element.parent != null) {
                element.parent.removeElement(element);
            }
            this.elements.splice(position, 0, element);
            element.parent = this;
            element.triggerEvent("parentChanged");
        } else {
            this.elements.splice(this.getElementIndex(element), 1);
            this.elements.splice(position, 0, element);
        }
        this.triggerEvent('elementsPropertyChanged');
    }

    this.fastForward = function () {
        for (var i = this.getElementsNum() - 1; i >= 0; i--) {
            this.getElementAt(i).fastForward();
        }
    }

    this.isPlaying = function () {
        for (var i = this.getElementsNum() - 1; i >= 0; i--) {
            if (this.getElementAt(i).isPlaying()) return true;
        }
        return false;
    }
}, [], []);