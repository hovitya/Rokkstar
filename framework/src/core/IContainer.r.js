/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @interface
 * @classdesc
 * Interface for container type components.
 * @author Viktor Horvath <a href="mailto:hovitya@gmail.com">hovitya@gmail.com</a>
 * @version 1.0
 */
core.IContainer = function () {
    "use strict";

    /**
     * Returns number of elements in the container.
     * @return {Number}
     */
    this.getElementsNum = function () { };

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
    this.removeElement = function (element) { };

    /**
     * Removes the element at the given index.
     * @param {Number} position
     */
    this.removeElementAt = function (position) { };

    /**
     * Removes all elements.
     */
    this.removeAllElements = function () { };

    /**
     * Adds element.
     * @param {core.VisualComponent} element
     */
    this.addElement = function (element) { };

    /**
     * Push element into the given position.
     * @param {core.VisualComponent} element
     * @param {Number} position
     */
    this.addElementAt = function (element, position) { };
};