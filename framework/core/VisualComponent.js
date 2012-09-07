/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Creates new VisualComponent instance.
 * @class Base class for visible components. Add view state functionality.
 * @author Horváth Viktor
 * @augments core.Component
 * @constructor
 */
core.VisualComponent = Rokkstar.createClass('core.VisualComponent', 'core.Component', function () {
    "use strict";

    /**
     *
     * @type {core.Container}
     */
    this.parent = null;

    this.transitions = [];

    this.stateGroups = {};

    this.states = {};

    this.hasState = function (stateName) {
        var i;
        for (i in this.states) {
            if (this.states.hasOwnProperty(i)) {
                if (this.states[i].name === stateName) { return true; }
            }
        }
        return false;
    };

    /**
     * DOM builder hook
     */
    this.buildDOM = function () {

    };


    /**
     *
     * @private
     */
    this._buildDOM = function () {
        this.buildDOM();
    };


    /**
     * Removes all child element
     */
    this.empty = function () {
        $(this).empty();
    };

    this.xmlContentArray = [];

    //this.states={};

    this.init = function () {
        var i;
        if (this.domElement === null) { this.createDomElement(); }
        this.callSuper('init');
        this._buildDOM();


        //Registering event listeners
        this.createEventListener('widthPropertyChanged', this.widthChanged, this);
        this.createEventListener('heightPropertyChanged', this.heightChanged, this);
        this.createEventListener('xPropertyChanged', this.xChanged, this);
        this.createEventListener('yPropertyChanged', this.yChanged, this);
        this.createEventListener('leftPropertyChanged', this.leftChanged, this);
        this.createEventListener('rightPropertyChanged', this.rightChanged, this);
        this.createEventListener('topPropertyChanged', this.topChanged, this);
        this.createEventListener('bottomPropertyChanged', this.bottomChanged, this);
        this.createEventListener('positionPropertyChanged', this.positionChanged, this);
        this.createEventListener('classPropertyChanged', this.classChanged, this);
        this.createEventListener('matrixPropertyChanged', this._matrixChanged, this);
        this.createEventListener('rotationPropertyChanged', this._createMatrix, this);
        this.createEventListener('scaleXPropertyChanged', this._createMatrix, this);
        this.createEventListener('scaleYPropertyChanged', this._createMatrix, this);
        this.createEventListener('skewXPropertyChanged', this._createMatrix, this);
        this.createEventListener('skewYPropertyChanged', this._createMatrix, this);
        this.createEventListener('translateXPropertyChanged', this._createMatrix, this);
        this.createEventListener('translateYPropertyChanged', this._createMatrix, this);
        this.createEventListener('visiblePropertyChanged', this._visibilityChanged, this);
        this.createEventListener('gridRowPropertyChanged', this.__gridChanged, this);
        this.createEventListener('gridColumnPropertyChanged', this.__gridChanged, this);
        this.createEventListener('gridRowSpanPropertyChanged', this.__gridChanged, this);
        this.createEventListener('gridColumnSpanPropertyChanged', this.__gridChanged, this);
        this.createEventListener('gridVerticalAlignPropertyChanged', this.__gridChanged, this);
        this.createEventListener('gridHorizontalAlignPropertyChanged', this.__gridChanged, this);
        this.createEventListener('alphaPropertyChanged', this._styleChanged, this);

        //Find state properties

        for (i in this.states) {
            if (this.states.hasOwnProperty(i)) {
                this.setCurrentState(this.states[i].name);
                this.states[i].activate();
                break;
            }
        }

        this.createEventListener('currentStatePropertyChanged', this.stateChanged, this);
    };


    this.measuredWidth = 0;
    this.measuredHeight = 0;


    this.measure = function (predictedWidth, predictedHeight) {
        var mW = this.measuredWidth, mH = this.measuredHeight;

        if (predictedWidth !== undefined) {
            this.measuredWidth = predictedWidth;
        } else {
            this.measuredWidth = this.domElement.clientWidth;
        }

        if (predictedHeight !== undefined) {
            this.measuredHeight = predictedHeight;
        } else {
            this.measuredHeight = this.domElement.clientHeight;
        }


        if ((mH !== this.measuredHeight || mW !== this.measuredWidth || this.autoWidth || this.autoHeight) && this.parent !== null) {
            this.parent.invalidateLayout();
        }

    };


    this.componentInvalid = true;

    this.propertiesInvalid = true;
    this.sizeInvalid = true;

    this.invalidateSize = function () {
        this.sizeInvalid = true;
        this.invalidateDisplayList();
    };

    this.invalidateDisplayList = function () {
        this.componentInvalid = true;
        if (this.parent !== null) {
            this.parent.invalidateDisplayList();
        }
    };


    this.invalidateProperties = function () {
        this.invalidateDisplayList();
        this.propertiesInvalid = true;
    };

    this.commitProperties = function () {
        if (this._matrixInvalid) {
            this._matrixInvalid = false;
            this.domElement.style[Modernizr.prefixed('transform')] = this.getMatrix().toString();
        }
        if (this._styleInvalid) {
            this._styleInvalid = false;
            this._commitStyle();
        }
        if (this._visibilityInvalid) {
            this._visibilityInvalid = false;
            if (this.getVisible()) {
                this.domElement.style.display = 'block';
            } else {
                this.domElement.style.display = 'none';
            }
        }
    };

    this.tack = function () {
        if (this.componentInvalid) {
            this.componentInvalid = false;

            if (this.propertiesInvalid) {
                this.commitProperties();
                this.propertiesInvalid = false;
            }
            if (this.sizeInvalid) {
                this.measure();
                this.sizeInvalid = false;
            }

        }
    };

    /**
     * Width change handler
     * @private
     * @param {core.Event} event
     */
    this.widthChanged = function (event) {
        event.stopPropagation();
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * Height change handler
     * @private
     * @param {core.Event} event
     */
    this.heightChanged = function (event) {
        event.stopPropagation();
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * X change handler
     * @private
     * @param {core.Event} event
     */
    this.xChanged = function (event) {
        event.stopPropagation();
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * Y change handler
     * @private
     * @param {core.Event} event
     */
    this.yChanged = function (event) {
        event.stopPropagation();
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * Left change handler
     * @private
     * @param {core.Event} event
     */
    this.leftChanged = function (event) {
        event.stopPropagation();
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * Right change handler
     * @private
     * @param {core.Event} event
     */
    this.rightChanged = function (event) {
        event.stopPropagation();
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * Top change handler
     * @private
     * @param {core.Event} event
     */
    this.topChanged = function (event) {
        event.stopPropagation();
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * Bottom change handler
     * @private
     * @param {core.Event} event
     */
    this.bottomChanged = function (event) {
        event.stopPropagation();
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    this.positionChanged = function (event) {
        event.stopPropagation();
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    this.classChanged = function (event) {
        event.stopPropagation();
        this.domElement.className = this.getClass();
    };

    /**
     * Grid change handler
     * @private
     * @param {core.Event} event
     */
    this.__gridChanged = function (event) {
        event.stopPropagation();
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    this._runningTransitions = [];

    this.addStateProperty = function (target, property, value, stateName) {
        var stateNames = stateName.split("."), i;
        if (this.stateGroups[stateNames[0].trim()] !== undefined) {
            for (i in this.stateGroups[stateNames[0].trim()]) {
                if (this.stateGroups[stateNames[0].trim()].hasOwnProperty(i)) { this.stateGroups[stateNames[0].trim()][i].addProperty(target, property, value, stateNames.slice(1)); }
            }
        } else {
            Rokkstar.console.warning("State is missing: " + stateNames[0].trim());
        }
    };

    this.stateChanged = function (event) {
        var i, from, to, trans, state, prevState, that, self;
        if (event.oldValue !== event.newValue) {
            for (i in this._runningTransitions) {
                if (this._runningTransitions.hasOwnProperty(i)) { this._runningTransitions[i].interrupt(); }
            }
            event.stopPropagation();
            if (this.states[this.getCurrentState()] !== undefined) {
                from = event.oldValue;
                to = event.newValue;
                i = this.transitions.length;
                trans = null;

                //Searching for applicable transition
                while (i--) {
                    if ((this.transitions[i].getFrom() === from || this.transitions[i].getFrom() === '*') && (this.transitions[i].getTo() === to || this.transitions[i].getTo() === '*')) {
                        trans = this.transitions[i];
                        i = 0;
                    }
                }
                if (trans === null) {
                    //Apply state without transition
                    if (this.states[from]) {
                        this.states[from].deactivate();
                    }
                    this.states[to].activate();
                } else {
                    //Apply state after transition
                    state = this.states[to];
                    prevState = this.states[from];
                    that = this;
                    self = trans;
                    trans.createEventListener('animationEnded', function () {
                        if (prevState) {
                            prevState.deactivate();
                        }
                        state.activate();
                        that._runningTransitions.slice(that._runningTransitions.indexOf(self), 1);
                    }, this, true);
                    this._runningTransitions.push(trans);
                    trans.playTransition(this.states[from], this.states[to]);
                }

            } else {
                throw new core.exceptions.Exception('Requested state is missing.');
            }
        }
    };

    this._styleInvalid = false;

    this._styleChanged = function (event) {
        event.stopPropagation();
        this._styleInvalid = true;
        this.invalidateProperties();
    };

    this._commitStyle = function () {
        this.domElement.style.opacity = this.getAlpha();
    };

    this._matrixInvalid = false;


    this._matrixChanged = function (event) {
        this._matrixInvalid = true;
        this.invalidateProperties();
    };

    this._createMatrix = function () {
        var m = new core.Matrix();
        m.translate(this.getTranslateX(), this.getTranslateY());
        m.shear(this.getSkewX() / 100.0, this.getSkewY() / 100.0);
        m.scale(this.getScaleX(), this.getScaleY());
        m.rotate(this.getRotation());
        this.setMatrix(m);
    };

    this._visibilityInvalid = false;

    this._visibilityChanged = function (event) {
        this._visibilityInvalid = true;
        this.invalidateProperties();
    };


    //Getters

    this.getGridRow = function () {
        if (isNaN(this.___gridRow) || this.___gridRow === undefined || this.___gridRow === null) {
            return 1;
        }
        return this.___gridRow;
    };

    this.getGridColumn = function () {
        if (isNaN(this.___gridColumn) || this.___gridColumn === undefined || this.___gridColumn === null) {
            return 1;
        }
        return this.___gridColumn;
    };

    this.getGridRowSpan = function () {
        if (isNaN(this.___gridRowSpan) || this.___gridRowSpan === undefined || this.___gridRowSpan === null) {
            return 1;
        }
        return this.___gridRowSpan;
    };

    this.getGridColumnSpan = function () {
        if (isNaN(this.___gridColumnSpan) || this.___gridColumnSpan === undefined || this.___gridColumnSpan === null) {
            return 1;
        }
        return this.___gridColumnSpan;
    };

    this.getGridVerticalAlign = function () {
        var correctValues = ["top", "middle", "bottom", "justify"];
        if (correctValues.indexOf(this.___gridVerticalAlign) === -1) {
            return correctValues[0];
        }
        return this.___gridVerticalAlign;
    };

    this.getGridHorizontalAlign = function () {
        var correctValues = ["left", "center", "right", "justify"];
        if (correctValues.indexOf(this.___gridHorizontalAlign) === -1) {
            return correctValues[0];
        }
        return this.___gridHorizontalAlign;
    };

    this.autoWidth = true;

    this.autoHeight = true;

    this.setWidth = function (value) {
        if (value === "auto") {
            this.autoWidth = true;
        } else {
            this.autoWidth = false;

        }
        this.___width = value;
    };

    this.setHeight = function (value) {
        if (value === "auto") {
            this.autoHeight = true;
        } else {
            this.autoHeight = false;
        }
        this.___height = value;
    };

    this.getContentWidth = function () {
        return "0px";
    };

    this.getContentHeight = function () {
        return "0px";
    };

    this.getWidth = function () {
        if (this.___width === "auto") {
            return this.getContentWidth();
        } else {
            return this.___width;
        }
    };

    this.getHeight = function () {
        if (this.___height === "auto") {
            return this.getContentHeight();
        } else {
            return this.___height;
        }
    };

}, [new Attr('currentState', undefined), new Attr('class'), new Attr('x', undefined, 'integer'), new Attr('y', undefined, 'integer'), new Attr('left', undefined, 'integer'), new Attr('right', undefined, 'integer'), new Attr('top', undefined, 'integer'), new Attr('bottom', undefined, 'integer'), new Attr('position', 'center', 'string'), new Attr('height', "auto", 'string'),
    new Attr('width', "auto", "string"), new Attr('distance', 0, 'integer'), new Attr('distanceX', undefined, 'integer'), new Attr('distanceY', undefined, 'integer'), new Attr('matrix', undefined), new Attr('rotation', 0, 'float'), new Attr('scaleX', 1.0, 'float'), new Attr('scaleY', 1.0, 'float'), new Attr('skewX', 0, 'float'), new Attr('skewY', 0, 'float'), new Attr('translateX', 0, 'integer'), new Attr('translateY', 0, 'integer'), new Attr('alpha', 1.0, 'float'),
    new Attr('visible', true, 'boolean'), new Attr('minWidth', NaN, 'integer'), new Attr('minHeight', NaN, 'integer'),
    new Attr('maxWidth', NaN, 'integer'), new Attr('maxHeight', NaN, 'integer'), new Attr('gridColumn', 1, 'integer'),
    new Attr('gridRow', 1, 'integer'), new Attr('gridColumnSpan', NaN, 'integer'),
    new Attr('gridRowSpan', NaN, 'integer'), new Attr('gridVerticalAlign', 'left', 'string'),
    new Attr('gridHorizontalAlign', 'top', 'string')]);

