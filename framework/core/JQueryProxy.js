/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Creates new JQueryProxy object.
 * @constructor
 */
core.JQueryProxy=Rokkstar.createClass('core.JQueryProxy',undefined,function(){
    this.findById=function(id){
        return $(this).find('#'+id).get(0);
    }

    this.getById=function(id){
        return $('#'+id).get(0);
    }

    this.findOneByClass=function(className){
        return $(this).find('.'+className).get(0);
    }

    this.findByClass=function(className){
        return $.makeArray($(this).find('.'+className));
    }
});