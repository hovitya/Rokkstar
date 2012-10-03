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
 * Base class for container type visual components. Supports layout managers.
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @extends core.VisualComponent
 * @implements core.IContainer
 * @defproperty elements
 * @version 1.0
 */
core.VisualContainer = function () {
    "use strict";

    /**
     * Container layout
     * @public
     * @bindable
     * @setter setLayout
     * @type {core.layouts.Layout}
     */
    this.layout = undefined;

    /**
     * @private
     * @param {core.layouts.Layout} val
     */
    this.setLayout = function (val) {
        if (this.___layout !== undefined && this.___layout !== null) {
            this.___layout.deleteEventListener("layoutChanged", this.invalidateLayout, this);
        }
        val.createEventListener("layoutChanged", this.invalidateLayout, this);
        this.___layout = val;
    };

    /**
     * Holds elements
     * @public
     * @bindable
     * @type {Array}
     */
    this.elements = [];

    /**
     * @return {Number}
     */
    this.getElementsNum = function () {
        return this.elements.length;
    };

    /**
     * Returns the element at the given index.
     * @param position
     * @return {core.VisualComponent}
     */
    this.getElementAt = function (position) {
        return this.elements[position];
    };

    /**
     * Determines element index.
     * @param {core.VisualComponent} element
     * @return {Number}
     */
    this.getElementIndex = function (element) {
        return this.elements.indexOf(element);
    };

    /**
     * Removes given element.
     * @param {core.VisualComponent} element
     */
    this.removeElement = function (element) {
        if (this.getElementIndex(element) !== -1) {
            if (this.domElement === element.domElement.parentNode) {
                this.domElement.removeChild(element.domElement);
            }
            this.elements.splice(this.elements.indexOf(element), 1);
            this.deactivateElement(element);
            element.parent = null;
            element.triggerEvent("parentChanged");
            this.triggerEvent('elementsPropertyChanged');
        }
    };

    /**
     * Removes the element at the given index.
     * @param {Number} position
     */
    this.removeElementAt = function (position) {
        if (position >= 0 && position <= this.elements.length) {
            if (this.domElement === this.elements[position].domElement.parentNode) {
                this.domElement.removeChild(this.elements[position].domElement);
            }
            this.deactivateElement(this.elements[position]);
            this.elements[position].parent = null;
            this.elements[position].triggerEvent("parentChanged");
            this.elements.splice(position, 1);
            this.triggerEvent('elementsPropertyChanged');
        }
    };

    /**
     * Removes all elements.
     */
    this.removeAllElements = function () {
        var i;
        for (i in this.elements) {
            if (this.elements.hasOwnProperty(i)) {
                this.deactivateElement(this.elements[i]);
                this.elements[i].parent = null;
                this.elements[i].triggerEvent("parentChanged");
            }
        }
        this.elements = [];
        this.triggerEvent('elementsPropertyChanged');
    };

    /**
     * Adds element.
     * @param {core.VisualComponent} element
     */
    this.addElement = function (element) {
        if (this.elements.indexOf(element) === -1) {
            if (element.parent !== null) {
                element.parent.removeElement(element);
            }
            this.elements.push(element);
            this.domElement.appendChild(element.domElement);
            this.activateElement(element);
            element.parent = this;
            element.triggerEvent("parentChanged");
        } else {
            this.elements.splice(this.getElementIndex(element), 1);
            this.elements.push(element);
            this.domElement.appendChild(element.domElement);

        }
        this.triggerEvent('elementsPropertyChanged');
    };

    /**
     * Push element into the given position.
     * @param {core.VisualComponent} element
     * @param {Number} position
     */
    this.addElementAt = function (element, position) {
        if (this.elements.indexOf(element) === -1) {
            if (element.parent !== null && element.parent !== undefined) {
                element.parent.removeElement(element);
            }
            if (position < this.elements.length - 1) {
                this.domElement.insertBefore(this.elements[position + 1].domElement, element.domElement);
            } else {
                this.domElement.appendChild(element.domElement);
            }
            this.elements.splice(position, 0, element);
            this.activateElement(element);
            element.parent = this;
            element.triggerEvent("parentChanged");
        } else {
            this.elements.splice(this.getElementIndex(element), 1);
            this.elements.splice(position, 0, element);
            if (position < this.elements.length - 1) {
                this.domElement.insertBefore(this.elements[position + 1].domElement, element.domElement);
            } else {
                this.domElement.appendChild(element.domElement);
            }
        }
        this.triggerEvent('elementsPropertyChanged');
    };

    /**
     * @override
     */
    this.init = function () {
        this.superClass.init();
        /*for (var i in this.xmlContentArray) {
            this.addElement(this.xmlContentArray[i]);
        }*/
        this.createEventListener('elementsPropertyChanged', this.elementsChanged, this);
        this.createEventListener('layoutPropertyChanged', this.invalidateLayout, this);
        this.elementsChanged({});
    };

    this.elementsChanged = function (event) {
        this.invalidateLayout();
    };

    this.activateElement = function (element) {
        element.createEventListener('sizeChanged', this.invalidateLayout, this);
        element.createEventListener('positionChanged', this.invalidateLayout, this);
    };

    this.deactivateElement = function (element) {
        element.removeEventListener('sizeChanged', this);
        element.removeEventListener('positionChanged', this);
    };

    this.refreshLayout = function () {
        if (this.layout === null || this.layout === undefined) {
            this.___layout = new core.layouts.ConstraintLayout();
        }
        //Storing original content dimensions
        var originalContentWidth = this.measuredContentWidth,
            originalContentHeight = this.measuredContentHeight;
        this.layout.doLayout(this);
        if (this.parent !== undefined && this.parent !== null) {
            if (this.autoWidth && originalContentWidth !== this.measuredContentWidth) {
                this.invalidateSize();
            }
            if (this.autoHeight && originalContentHeight !== this.measuredContentHeight) {
                this.invalidateSize();
            }
        }

    };

    /**
     * @private
     * @type {Boolean}
     */
    this.layoutInvalid = false;

    /**
     * Force component to recalculate layout
     */
    this.invalidateLayout = function () {
        this.layoutInvalid = true;
        this.invalidateDisplayList();
    };

    /**
     * Measures component and sets measuredWidth and measuredHeight properties. Invalidates layout if component size
     * changed.
     * @override
     * @param {Number} predictedWidth
     * @param {Number} predictedHeight
     */
    this.measure = function (predictedWidth, predictedHeight) {
        var mW = this.measuredWidth,
            mH = this.measuredHeight;
        this.superClass.measure(predictedWidth, predictedHeight);
        if (this.measuredHeight !== mH || this.measuredWidth !== mW || this.autoWidth || this.autoHeight) {
            this.invalidateLayout();
        }
    };
    /**
     * Application call this function before every screen update.
     * @public
     * @override
     */
    this.tack = function () {
        var i;
        if (this.componentInvalid) {
            this.superClass.tack();
            if (this.layoutInvalid) {
                this.refreshLayout();
                this.layoutInvalid = false;
            }
            for (i in this.elements) {
                if (this.elements.hasOwnProperty(i)) {
                    this.elements[i].tack();
                }
            }
        }
    };

};