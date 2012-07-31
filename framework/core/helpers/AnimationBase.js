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
core.helpers.AnimationBase = Rokkstar.createClass('core.helpers.AnimationBase', 'core.Component', function () {

    this.transitionMode=false;

    this.startState=null;
    this.endState=null;

    this.play=function(reversed){

    }

    this.stop=function(){

    }

    this.setUp=function(reversed){

    }

    this.fastForward=function(){

    }

    this.isPlaying=function(){
        return false;
    }
});