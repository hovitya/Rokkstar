/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.SkinnableContainer
 * @class
 * @name Panel
 * @package core
 */
core.Panel = Rokkstar.createClass('core.Panel', 'core.SkinnableContainer', function () {

    this.createAttributes = function () {
        this.callSuper('createAttributes');
        this.declareSkinPart('controlBar', false, 'core.Group');
    }

    this.init = function () {
        this.callSuper('init');
        this.setSkinClass("core.skins.PanelSkin");
        this.createEventListener('showControlBarPropertyChanged', this.invalidateSkinState, this);
        this.createEventListener('controlBarContentPropertyChanged', this._controlBarContentChanged, this);
    }

    this._controlBarContentChanged = function () {
        if (this.hasSkinPart('controlBar')) {
            var cbContent = this.getControlBarContent();
            for (var i in cbContent) {
                this.getSkinPart('controlBar').addElement(cbContent[i]);
            }
        }
        this.invalidateSkinState();
    }

    this.getSkinState = function () {
        if (this.getShowControlBar() == 'yes') {
            return "normalWithControlBar";
        } else if (this.getShowControlBar() == 'no') {
            return "normal";
        } else if (this.getShowControlBar() == 'auto' && this.getControlBarContent().length == 0) {
            return "normal";
        } else {
            return "normalWithControlBar";
        }
    }

    this.partAdded = function (name, instance) {
        this.callSuper('partAdded', name, instance);
        if (name == 'controlBar') {
            var cbContent = this.getControlBarContent();
            for (var i in cbContent) {
                instance.addElement(cbContent[i]);
            }
        }
    }


}, [new Attr('controlBarContent', [], 'array'), new Attr('showControlBar', 'auto'), new Attr('controlBar', false, 'core.VisualContainer')]);