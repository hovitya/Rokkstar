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
 * @name Binding
 * @package core
 */
core.Binding = Rokkstar.createClass('core.Binding', 'core.Component', function () {

});

core.Binding.bindProperty=function(source,sourceAttribute,destination,destinationAttribute){
    if(source._attributeTypes==undefined || source._attributeTypes[sourceAttribute]==undefined){
        Rokkstar.console.warning("Class "+source.__classType+" does not have attribute called "+sourceAttribute+", so real data binding is not possible.");
    }
    if(destination.__bindings==undefined){
        destination.__bindings=[];
    }
    destination.__bindings.push({source:source,sourceAttribute:sourceAttribute,destination:destination,destinationAttribute:destinationAttribute});



}