/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @augments core.VisualComponent
 * @constructor
 */
core.Label=Rokkstar.createClass('core.Label','core.VisualComponent',function(){
    this.init=function(){
        this.callSuper('init');
        this.createEventListener('textPropertyChanged',this._updateText,this);
        this.setWidth('auto');
        this.setHeight('auto');
        $(this.domElement).html(this.getText());
    }
    /**
     * @private
     *
     */
    this._updateText=function(){
        $(this.domElement).html(this.getText());
        if(this.getWidth()=='auto' || this.getHeight()=='auto'){
            this.invalidateSize();
        }
    }
},[new Attr('text','')]);