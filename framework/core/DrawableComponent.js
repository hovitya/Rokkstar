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
 * @augments core.VisualComponent
 */
core.DrawableComponent = Rokkstar.createClass('core.DrawableComponent', 'core.VisualComponent', function () {
    /**
     *
     * @type {CanvasRenderingContext2D}
     */
    this.graphics=null;

    /**
     *
     * @type {HTMLCanvasElement}
     */
    this.canvas=null;

    this.createDomElement=function(){
        this.domElement=document.createElement('div');
        this.domElement.style[Modernizr.prefixed('boxSizing')]='border-box';
        this.domElement.style.position='absolute';

        this.canvas=document.createElement('canvas');
        this.canvas.style[Modernizr.prefixed('boxSizing')]='border-box';
        this.canvas.style.position='absolute';



        this.graphics=this.domElement.getContext('2d');
    }

},[new Attr('canvasOuterPadding',20,'integer')]);