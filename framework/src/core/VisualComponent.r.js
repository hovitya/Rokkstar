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
 * @classdesc
 * The VisualComponent class is the base class for all display objects.
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @extends core.InteractiveObject
 * @version 1.0
 */
core.VisualComponent = function () {
    "use strict";

    /**
     *
     * @type {core.VisualContainer}
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




    this.init = function () {
        var i;
        if (this.domElement === null) { this.createDomElement(); }
        this.superClass.init();
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

    /**
     *
     * @type {Number}
     */
    this.measuredWidth = 0;

    /**
     *
     * @type {Number}
     */
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

    /**
     * @protected
     * @type {Boolean}
     */
    this.componentInvalid = true;

    /**
     * @protected
     * @type {Boolean}
     */
    this.propertiesInvalid = true;

    /**
     * @protected
     * @type {Boolean}
     */
    this.sizeInvalid = true;

    /**
     * Force layout manager to recalculate component size.
     */
    this.invalidateSize = function () {
        this.sizeInvalid = true;
        this.invalidateDisplayList();
    };

    /**
     * Invalidates whole display list.
     */
    this.invalidateDisplayList = function () {
        this.componentInvalid = true;
        if (this.parent !== null) {
            this.parent.invalidateDisplayList();
        }
    };

    /**
     * Force application manager to call commitProperties during the next screen update.
     */
    this.invalidateProperties = function () {
        this.invalidateDisplayList();
        this.propertiesInvalid = true;
    };

    /**
     * Override this to set changed properties. Always call super method!
     */
    this.commitProperties = function () {
        if (this._matrixInvalid) {
            this._matrixInvalid = false;
            this.domElement.style[Modernizr.prefixed('transform')] = this.matrix.toString();
        }
        if (this._styleInvalid) {
            this._styleInvalid = false;
            this._commitStyle();
        }
        if (this._visibilityInvalid) {
            this._visibilityInvalid = false;
            if (this.visible) {
                this.domElement.style.display = 'block';
            } else {
                this.domElement.style.display = 'none';
            }
        }
    };

    /**
     * @protected
     * @internal
     */
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
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * Height change handler
     * @private
     * @param {core.Event} event
     */
    this.heightChanged = function (event) {
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * X change handler
     * @private
     * @param {core.Event} event
     */
    this.xChanged = function (event) {
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * Y change handler
     * @private
     * @param {core.Event} event
     */
    this.yChanged = function (event) {
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * Left change handler
     * @private
     * @param {core.Event} event
     */
    this.leftChanged = function (event) {
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * Right change handler
     * @private
     * @param {core.Event} event
     */
    this.rightChanged = function (event) {
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * Top change handler
     * @private
     * @param {core.Event} event
     */
    this.topChanged = function (event) {
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    /**
     * Bottom change handler
     * @private
     * @param {core.Event} event
     */
    this.bottomChanged = function (event) {
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };

    this.positionChanged = function (event) {
        if (this.parent !== null) { this.parent.invalidateLayout(); }
    };


    /**
     * Grid change handler
     * @private
     * @param {core.Event} event
     */
    this.__gridChanged = function (event) {
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
            if (this.states[this.currentState] !== undefined) {
                from = event.oldValue;
                to = event.newValue;
                i = this.transitions.length;
                trans = null;

                //Searching for applicable transition
                while (i--) {
                    if ((this.transitions[i].from === from || this.transitions[i].from === '*') && (this.transitions[i].to === to || this.transitions[i].to === '*')) {
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
        this.domElement.style.opacity = this.alpha;
    };

    this._matrixInvalid = false;


    this._matrixChanged = function (event) {
        this._matrixInvalid = true;
        this.invalidateProperties();
    };

    this._createMatrix = function () {
        var m = new core.Matrix();
        m.translate(this.translateX, this.translateY);
        m.shear(this.skewX / 100.0, this.skewY / 100.0);
        m.scale(this.scaleX, this.scaleY);
        m.rotate(this.rotation);
        this.matrix = m;
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

    this.measuredContentWidth = 0;
    this.measuredContentHeight = 0;

    this.getGridHorizontalAlign = function () {
        var correctValues = ["left", "center", "right", "justify"];
        if (correctValues.indexOf(this.___gridHorizontalAlign) === -1) {
            return correctValues[0];
        }
        return this.___gridHorizontalAlign;
    };

    this.autoWidth = false;

    this.autoHeight = false;

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
        return this.measuredContentWidth.toString() + "px";
    };

    this.getContentHeight = function () {
        return this.measuredContentHeight.toString() + "px";
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

    /**
     * Current state
     * @bindable
     * @type {String}
     */
    this.currentState = undefined;

    /**
     * X position in pixels
     * @bindable
     * @type {Number}
     */
    this.x = undefined;

    /**
     * Y position in pixels
     * @bindable
     * @type {Number}
     */
    this.y = undefined;

    /**
     * Left position in pixels
     * @bindable
     * @type {Number}
     */
    this.left = undefined;

    /**
     * Right position in pixels
     * @bindable
     * @type {Number}
     */
    this.right = undefined;

    /**
     * Top position in pixels
     * @bindable
     * @type {Number}
     */
    this.left = undefined;

    /**
     * Bottom position in pixels
     * @bindable
     * @type {Number}
     */
    this.right = undefined;

    /**
     * Position in a border container. Default is center.
     * Correct values are left,right,top,bottom,center.
     * @bindable
     * @type {String}
     */
    this.position = 'center';

    /**
     * Component height in pixel (120px) or percent (80%) representation or auto.
     * @bindable
     * @setter setHeight
     * @getter getHeight
     * @type {String}
     */
    this.height = undefined;

    /**
     * Component width in pixel (120px) or percent (80%) representation or auto.
     * @bindable
     * @setter setWidth
     * @getter getWidth
     * @type {String}
     */
    this.width = undefined;

    /**
     * Set both distanceX and distanceY value for parallax layout.
     * @bindable
     * @type {Number}
     */
    this.distance = 0;

    /**
     * Horizontal distance for parallax layout.
     * @bindable
     * @type {Number}
     */
    this.distanceX = 0;

    /**
     * Vertical distance for parallax layout.
     * @bindable
     * @type {Number}
     */
    this.distanceY = 0;

    /**
     * Current tansformation matrix
     * @bindable
     * @type {core.Matrix}
     */
    this.matrix = undefined;

    /**
     * Component rotation. Default is 0.0.
     * @bindable
     * @type {Number}
     */
    this.rotation = 0.0;

    /**
     * Horizontal scale
     * @bindable
     * @type {Number}
     */
    this.scaleX = 1.0;

    /**
     * Vertical scale
     * @bindable
     * @type {Number}
     */
    this.scaleY = 1.0;


    /**
     * Horizontal skew. Default is 0.
     * @bindable
     * @type {Number}
     */
    this.skewX = 0;

    /**
     * Vertical skew. Default is 0.
     * @bindable
     * @type {Number}
     */
    this.skewY = 0;

    /**
     * Translates component along x axis. It does not modify the layout.
     * @bindable
     * @type {Number}
     */
    this.translateX = 0;

    /**
     * Translates component along y axis. It does not modify the layout.
     * @bindable
     * @type {Number}
     */
    this.translateY = 0;

    /**
     * Sets component opacity. Default is 1.0.
     * @bindable
     * @type {Number}
     */
    this.alpha = 1.0;

    /**
     * Sets component visibility. Default is true.
     * @bindable
     * @type {Boolean}
     */
    this.visible = true;

    /**
     * Component minimum height in pixel.
     * @bindable
     * @type {Number}
     */
    this.minHeight = undefined;

    /**
     * Component minimum width in pixel.
     * @bindable
     * @type {Number}
     */
    this.minWidth = undefined;

    /**
     * Component maximum height in pixel.
     * @bindable
     * @type {Number}
     */
    this.maxHeight = undefined;

    /**
     * Component maximum width in pixel.
     * @bindable
     * @type {Number}
     */
    this.maxWidth = undefined;

    /**
     * Column number for grid layout. Default is 1.
     * @bindable
     * @type {Number}
     */
    this.gridColumn = 1;

    /**
     * Row number for grid layout. Default is 1.
     * @bindable
     * @type {Number}
     */
    this.gridRow = 1;

    /**
     * Column span for grid layout. Default is 1.
     * @bindable
     * @getter getGridColumnSpan
     * @type {Number}
     */
    this.gridColumnSpan = 1;

    /**
     * Row span for grid layout. Default is 1.
     * @bindable
     * @getter getGridRowSpan
     * @type {Number}
     */
    this.gridRowSpan = 1;

    /**
     * Verical align in a grid column. Default is left.
     * Correct values are left,right,center.
     * @bindable
     * @getter getGridVerticalAlign
     * @type {String}
     */
    this.gridVerticalAlign = 'left';

    /**
     * Horizontal align in a grid column. Default is top.
     * Correct values are top,bottom,middle.
     * @bindable
     * @getter getGridHorizontalAlign
     * @type {String}
     */
    this.gridHorizontalAlign = 'top';

};
