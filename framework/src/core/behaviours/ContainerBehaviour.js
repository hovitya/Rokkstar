(function () {
    "use strict";
}());
/**
 * Container behaviour
 * This behaviour can be applied on core.VisualComponent based classes.
 * @behaviour
 * @name ContainerBehaviour
 * @package core.behaviours
 */
core.behaviours.ContainerBehaviour = function () {
    "use strict";

    this.elements = [];

    this.getElementsNum = function () {
        return this.elements.length;
    };

    /**
     *
     * @param position
     * @return {core.VisualComponent}
     */
    this.getElementAt = function (position) {
        return this.elements[position];
    };

    this.getElementIndex = function (element) {
        return this.elements.indexOf(element);
    };

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

    this.removeElementAt = function (position) {
        if (position >= 0 && position <= this.elements.length) {
            if (this.domElement == this.elements[position].domElement.parentNode) {
                this.domElement.removeChild(this.elements[position].domElement);
            }
            this.deactivateElement(this.elements[position]);
            this.elements[position].parent = null;
            this.elements[position].triggerEvent("parentChanged");
            this.elements.splice(position, 1);
            this.triggerEvent('elementsPropertyChanged');
        }
    };

    this.removeAllElements = function () {
        var i;
        for (i in this.elements) {
            if (Rokkstar.instanceOf(this.elements[i], 'core.VisualComponent')) {
                this.deactivateElement(this.elements[i]);
                this.elements[i].parent = null;
                this.elements[i].triggerEvent("parentChanged");
            }
        }
        this.elements = [];
        this.triggerEvent('elementsPropertyChanged');
    };


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

    this.addElementAt = function (element, position) {
        if (this.elements.indexOf(element) === -1) {
            if (element.parent !== null) {
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

};