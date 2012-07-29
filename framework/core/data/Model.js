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
core.data.Model = Rokkstar.createClass('core.data.Model', 'core.Component', function () {

    this.fieldData={};


    this.setField=function(field,value){
        if(this.fieldData[field]!=undefined){
            this.fieldData[field].value=value;
        }else{
            throw new core.exceptions.Exception("Field not found: "+field);
        }
    }

    this.getField=function(field){
        if(this.fieldData[field]!=undefined){
            return this.fieldData[field].value;
        }else{
            throw new core.exceptions.Exception("Field not found: "+field);
        }
    }

    this.hasField=function(field){
        return (this.fieldData[field]!=undefined);
    }
},[new Attr('fields',[],'array')]);