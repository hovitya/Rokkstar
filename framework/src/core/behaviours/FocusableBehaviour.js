/**
 * Focusable behaviour
 * This behaviour can be applied on core.VisualComponent based classes.
 * @behaviour
 * @name FocusableBehaviour
 * @package core.behaviours
 */
core.behaviours.FocusableBehaviour = function () {
    "use strict";

    this.focusableInit = function () {
        this.createEventListener('tabIndexPropertyChanged', this.tabIndexChanged, this);
        this.createEventListener('focus', this.focused, this);
        this.createEventListener('blur', this.blured, this);
        this.setTabIndex(1);
    };

    this.tabIndexChanged = function () {
        $(this.domElement).attr('tabindex', this.getTabIndex());
    };

    this.createFocusRectangle = function () {
        $(this.domElement).addClass('rokkstar_focus');
    };

    this.removeFocusRectangle = function () {
        $(this.domElement).removeClass('rokkstar_focus');
    };

    this.focused = function (event) {
        this.createFocusRectangle();
    };

    this.blured = function (event) {
        this.removeFocusRectangle();
    };

};
