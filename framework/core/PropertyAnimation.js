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
core.PropertyAnimation = Rokkstar.createClass('core.PropertyAnimation', 'core.Animation', function () {
    this.init=function(){
        this.callSuper('init');
        this.createEventListener('propertyPropertyChanged',this._propChanged,this);
        this.createEventListener('startPropertyChanged',this._propChanged,this);
        this.createEventListener('endPropertyChanged',this._propChanged,this);
    }

    this._propChanged=function(event){
        if(event.propertyName=='property') this.propertyName=this.getProperty();
        if(event.propertyName=='start') this.startValue=this.getStart();
        if(event.propertyName=='end') this.endValue=this.getEnd();
    }
},[new Attr('property','','string'),new Attr('start',0,'integer'),new Attr('end',100,'integer')]);