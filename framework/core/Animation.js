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
core.Animation = Rokkstar.createClass('core.Animation', 'core.Component', function () {

    this.tween=null;
    this.startValue=0;
    this.endValue=0;
    this.propertyName='';

    this.play=function(reversed){
        if(reversed==undefined){
            reversed=false;
        }
        this.tween.prop=this.propertyName;
        this.tween.type=this.getType();
        this.tween.setDuration(this.getDuration());
        this.tween.func=this.getEasing();
        this.tween.suffixe=this.getSuffix();
        this.tween.obj=[this.getTarget()];
        if(!reversed){
            this.tween.begin=this.startValue;
            this.tween.setFinish(this.endValue);
        }else{
            this.tween.begin=this.endValue;
            this.tween.setFinish(this.startValue);
        }
        this.tween.start();

    }

    this.init=function(){
        this.callSuper('init');
        this.tween=new Tween([],'','',0,0,this.getDuration(),this.getSuffix());
    }




},[new Attr('target',null,'object'),new Attr('type','integer','string'),new Attr('suffix','','string'),new Attr('duration',0.5,'float'),new Attr('easing',Tween.regularEaseInOut,'function')],['core.behaviours.ContainerBehaviour']);