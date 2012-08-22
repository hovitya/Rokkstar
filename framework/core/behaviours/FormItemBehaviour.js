core.behaviours.FormItemBehaviour = function () {
    "use strict";

    this.formItemInit = function () {
        this.createEventListener('labelPropertyChanged', this._refreshLabel, this);
        this.createEventListener('validPropertyChanged', this.invalidateSkinState, this);
    };

    /**
     * Label node
     * @type {HTMLLabelElement}
     */
    this.labelNode = null;

    this._refreshLabel = function (event) {
        if (this.labelNode !== null) {
            this.labelNode.innerHTML = this.getLabel();
        }
    };
};