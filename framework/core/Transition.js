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
core.Transition = Rokkstar.createClass('core.Transition', 'core.Parallel', function () {

    this.transitionListener=null;
    this.transitionListenerScope=null;

    this.playTransition=function(startState,endState){
        this.transitionMode=true;
        this.startState=startState;
        this.endState=endState;
        this.play();
        this.transitionMode=false;
    }

    this.interrupt=function(){

        this.fastForward();
        this.triggerEvent('animationEnded');

    }
},[new Attr('from','','string'),new Attr('to','','string')]);