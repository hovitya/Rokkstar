/**********************************************************************
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright (c) 2001 Robert Penner
JavaScript version copyright (C) 2006 by Philippe Maegerman
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

   * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
   * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
   * Neither the name of the author nor the names of contributors may
be used to endorse or promote products derived from this software
without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*****************************************/
function Delegate() {}
Delegate.create = function (o, f) {
	var a = new Array() ;
	var l = arguments.length ;
	for(var i = 2 ; i < l ; i++) a[i - 2] = arguments[i] ;
	return function() {
		var aP = [].concat(arguments, a) ;
		f.apply(o, aP);
	}
}

Tween = function(obj, prop, func, begin, finish, duration, suffixe){
	this.init(obj, prop, func, begin, finish, duration, suffixe)
}
var t = Tween.prototype;

t.obj = new Object();
t.prop='';
t.func = function (t, b, c, d) { return c*t/d + b; };
t.begin = 0;
t.change = 0;
t.prevTime = 0;
t.prevPos = 0;
t.looping = false;
t._duration = 0;
t._time = 0;
t._pos = 0;
t._position = 0;
t._startTime = 0;
t._finish = 0;
t.type='integer';
t.name = '';
t.suffixe = '';
t._listeners = new Array();	
t.setTime = function(t){
	this.prevTime = this._time;
	if (t > this.getDuration()) {
		if (this.looping) {
			this.rewind (t - this._duration);
			this.update();
			this.broadcastMessage('onMotionLooped',{target:this,type:'onMotionLooped'});
		} else {
			this._time = this._duration;
			this.update();
			this.stop();
			this.broadcastMessage('onMotionFinished',{target:this,type:'onMotionFinished'});
		}
	} else if (t < 0) {
		this.rewind();
		this.update();
	} else {
		this._time = t;
		this.update();
	}
}
t.getTime = function(){
	return this._time;
}
t.setDuration = function(d){
	this._duration = (d == null || d <= 0) ? 100000 : d;
}
t.getDuration = function(){
	return this._duration;
}
t.setPosition = function(p){
	this.prevPos = this._pos;
	var a = this.suffixe != '' ? this.suffixe : '';
	var j=this.obj.length;
	var val=p;
	if(this.type=='integer'){
		val=Math.round(p);
	}
	
	while(--j>=0){
		if(this.suffixe!=''){
			val=val.toString()+this.suffixe;
		}
		this.obj[j]["set"+this.prop.capitalize()].apply(this.obj[j],[val]);
	}
	//this.obj[this.prop] = Math.round(p) + a;
	this._pos = p;
	this.broadcastMessage('onMotionChanged',{target:this,type:'onMotionChanged'});
}
t.getPosition = function(t){
	if (t == undefined) t = this._time;
	return this.func(t, this.begin, this.change, this._duration);
};
t.setFinish = function(f){
	this.change = f - this.begin;
};
t.getFinish = function(){
	return this.begin + this.change;
};
t.init = function(obj, prop, func, begin, finish, duration, suffixe){
	if (!arguments.length) return;
	this._listeners = new Array();
	this.addListener(this);
	if(suffixe) this.suffixe = suffixe;
	this.obj = obj;
	this.prop = prop;
	this.begin = begin;
	this._pos = begin;
	this.setDuration(duration);
	if (func!=null && func!='') {
		this.func = func;
	}
	this.setFinish(finish);
}
t.start = function(){
	this.rewind();
	this.startEnterFrame();
	this.broadcastMessage('onMotionStarted',{target:this,type:'onMotionStarted'});
	//alert('in');
}
t.rewind = function(t){
	this.stop();
	this._time = (t == undefined) ? 0 : t;
	this.fixTime();
	this.update();
}
t.fforward = function(){
	this._time = this._duration;
	this.fixTime();
	this.update();
}
t.update = function(){
	this.setPosition(this.getPosition(this._time));
	}
t.startEnterFrame = function(){
	this.stopEnterFrame();
	this.isPlaying = true;
	this.onEnterFrame();
}
t.onEnterFrame = function(){
	if(this.isPlaying) {
		this.nextFrame();
		setTimeout(Delegate.create(this, this.onEnterFrame), 0);
	}
}
t.nextFrame = function(){
	this.setTime((this.getTimer() - this._startTime) / 1000);
	}
t.stop = function(){
	this.stopEnterFrame();
	this.broadcastMessage('onMotionStopped',{target:this,type:'onMotionStopped'});
}
t.stopEnterFrame = function(){
	this.isPlaying = false;
}

t.continueTo = function(finish, duration){
	this.begin = this._pos;
	this.setFinish(finish);
	if (this._duration != undefined)
		this.setDuration(duration);
	this.start();
}
t.resume = function(){
	this.fixTime();
	this.startEnterFrame();
	this.broadcastMessage('onMotionResumed',{target:this,type:'onMotionResumed'});
}
t.yoyo = function (){
	this.continueTo(this.begin,this._time);
}

t.addListener = function(o){
	this.removeListener (o);
	return this._listeners.push(o);
}
t.removeListener = function(o){
	var a = this._listeners;	
	var i = a.length;
	while (i--) {
		if (a[i] == o) {
			a.splice (i, 1);
			return true;
		}
	}
	return false;
}
t.broadcastMessage = function(){
	var arr = new Array();
	for(var i = 0; i < arguments.length; i++){
		arr.push(arguments[i])
	}
	var e = arr.shift();
	var a = this._listeners;
	var l = a.length;
	for (var i=0; i<l; i++){
		if(a[i][e])
		a[i][e].apply(a[i], arr);
	}
}
t.fixTime = function(){
	this._startTime = this.getTimer() - this._time * 1000;
}
t.getTimer = function(){
	return new Date().getTime() - this._time;
}
Tween.backEaseIn = function(t,b,c,d,a,p){
	if (s == undefined) var s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
}
Tween.backEaseOut = function(t,b,c,d,a,p){
	if (s == undefined) var s = 1.70158;
	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
}
Tween.backEaseInOut = function(t,b,c,d,a,p){
	if (s == undefined) var s = 1.70158; 
	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
}
Tween.elasticEaseIn = function(t,b,c,d,a,p){
		if (t==0) return b;  
		if ((t/=d)==1) return b+c;  
		if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) {
			a=c; var s=p/4;
		}
		else 
			var s = p/(2*Math.PI) * Math.asin (c/a);
		
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	
}
Tween.elasticEaseOut = function (t,b,c,d,a,p){
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
	}
Tween.elasticEaseInOut = function (t,b,c,d,a,p){
	if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) var p=d*(.3*1.5);
	if (!a || a < Math.abs(c)) {var a=c; var s=p/4; }
	else var s = p/(2*Math.PI) * Math.asin (c/a);
	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
}

Tween.bounceEaseOut = function(t,b,c,d){
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}
}
Tween.bounceEaseIn = function(t,b,c,d){
	return c - Tween.bounceEaseOut (d-t, 0, c, d) + b;
	}
Tween.bounceEaseInOut = function(t,b,c,d){
	if (t < d/2) return Tween.bounceEaseIn (t*2, 0, c, d) * .5 + b;
	else return Tween.bounceEaseOut (t*2-d, 0, c, d) * .5 + c*.5 + b;
	}

Tween.strongEaseInOut = function(t,b,c,d){
	return c*(t/=d)*t*t*t*t + b;
	}

Tween.regularEaseIn = function(t,b,c,d){
	return c*(t/=d)*t + b;
	}
Tween.regularEaseOut = function(t,b,c,d){
	return -c *(t/=d)*(t-2) + b;
	}

Tween.regularEaseInOut = function(t,b,c,d){
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
	}
Tween.strongEaseIn = function(t,b,c,d){
	return c*(t/=d)*t*t*t*t + b;
	}
Tween.strongEaseOut = function(t,b,c,d){
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
	}

Tween.strongEaseInOut = function(t,b,c,d){
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
	}
	
	
/**********************************************************************
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright (c) 2001 Robert Penner
JavaScript version copyright (C) 2006 by Philippe Maegerman
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

   * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
   * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
   * Neither the name of the author nor the names of contributors may
be used to endorse or promote products derived from this software
without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*****************************************/
ColorTween.prototype = new Tween();
ColorTween.prototype.constructor = Tween;
ColorTween.superclass = Tween.prototype;

function ColorTween(obj,prop,func,fromColor,toColor,duration){
	this.targetObject = obj;
	this.targetProperty = prop;	
	this.fromColor = fromColor;
	this.toColor = toColor;
	this.init(new Object(),'x',func,0,100,duration);
	this.listenerObj = new Object();
	this.listenerObj.onMotionChanged = Delegate.create(this,this.onColorChanged);
	this.addListener(this.listenerObj);
}
var o = ColorTween.prototype;
o.targetObject = {};
o.targetProperty = {};
o.fromColor = '';
o.toColor = '';
o.currentColor = '';
o.listenerObj = {};
o.onColorChanged = function(){
	this.currentColor = this.getColor(this.fromColor,this.toColor,this._pos);
	this.targetObject[this.targetProperty] = this.currentColor;
}

/***********************************************
*
* Function    : getColor
*
* Parameters  :    start - the start color (in the form "RRGGBB" e.g. "FF00AC")
*            end - the end color (in the form "RRGGBB" e.g. "FF00AC")
*            percent - the percent (0-100) of the fade between start & end
*
* returns      : color in the form "#RRGGBB" e.g. "#FA13CE"
*
* Description : This is a utility function. Given a start and end color and
*            a percentage fade it returns a color in between the 2 colors
*
* Author      : www.JavaScript-FX.com
*
*************************************************/ 
o.getColor = function(start, end, percent)
{
	var r1=this.hex2dec(start.slice(0,2));
    var g1=this.hex2dec(start.slice(2,4));
    var b1=this.hex2dec(start.slice(4,6));

    var r2=this.hex2dec(end.slice(0,2));
    var g2=this.hex2dec(end.slice(2,4));
    var b2=this.hex2dec(end.slice(4,6));

    var pc = percent/100;

    r= Math.floor(r1+(pc*(r2-r1)) + .5);
    g= Math.floor(g1+(pc*(g2-g1)) + .5);
    b= Math.floor(b1+(pc*(b2-b1)) + .5);

    return("#" + this.dec2hex(r) + this.dec2hex(g) + this.dec2hex(b));
}
/*** These are the simplest HEX/DEC conversion routines I could come up with ***/
/*** I have seen a lot of fade routines that seem to make this a             ***/
/*** very complex task. I am sure somene else must've had this idea          ***/
/************************************************/  

o.dec2hex = function(dec){return(this.hexDigit[dec>>4]+this.hexDigit[dec&15]);}
o.hexDigit=new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F");
o.hex2dec = function(hex){return(parseInt(hex,16))};

/**********************************************************************
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright (c) 2001 Robert Penner
JavaScript version copyright (C) 2006 by Philippe Maegerman
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

   * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
   * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
   * Neither the name of the author nor the names of contributors may
be used to endorse or promote products derived from this software
without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*****************************************/

TextTween.prototype = new Tween();
TextTween.prototype.constructor = Tween;
TextTween.superclass = Tween.prototype;

function TextTween(obj,property,txt,func,duration){
	this.targetObject = obj;
	this.targetProperty = property;
	this.txt = txt;
	if (func!=null && func!='') {
		this.func = func;
	}
	this.init(new Object(),'x',func,0,txt.length,duration);
}
var o = TextTween.prototype;
o.targetObject = {};
o.targetProperty = {};
o.fromColor = '';
o.toColor = '';
o.currentColor = '';
o.onMotionChanged = function(evt){
	var v = evt.target._pos;
	this.targetObject[this.targetProperty] = this.txt.substr(0,v);	
}

/**********************************************************************
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright (c) 2001 Robert Penner
JavaScript version copyright (C) 2006 by Philippe Maegerman
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

   * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
   * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
   * Neither the name of the author nor the names of contributors may
be used to endorse or promote products derived from this software
without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*****************************************/
function Delegate() {}
Delegate.create = function (o, f) {
	var a = new Array() ;
	var l = arguments.length ;
	for(var i = 2 ; i < l ; i++) a[i - 2] = arguments[i] ;
	return function() {
		var aP = [].concat(arguments, a) ;
		f.apply(o, aP);
	}
}
function Sequence(){
	this.children = new Array();
	this.currentChildIndex = 0;
	this._listeners = new Array();
	this.nextObject = new Object();
	this.addListener(this);
}
var s = Sequence.prototype;
s.addChild = function(tween){
	this.children.push(tween)
}
s.removeChild = function(tween){
	var a = this.children;	
	var i = a.length;
	while (i--) {
		if (a[i] == tween) {
			a.splice (i, 1);
			return true;
		}
	}
	return false;
}
s.start = function(){
	this.rewind();
	this.play();
	this.broadcastMessage('onMotionStarted',{target:this,type:'onMotionStarted'});
}
s.next = function(){
	this.children[this.currentChildIndex].removeListener(this.nextObject);
	if(this.currentChildIndex < this.children.length-1){
		this.currentChildIndex++;
		this.play();
	}
	else{
		this.stop();
		this.broadcastMessage('onMotionFinished',{target:this,type:'onMotionFinished'});
	}
}
s.play = function(){
	this.nextObject = new Object();
	this.nextObject.onMotionFinished = Delegate.create(this, this.next);
	this.children[this.currentChildIndex].addListener(this.nextObject);
	this.children[this.currentChildIndex].start();
}
s.stop = function(){
	this.children[this.currentChildIndex].stop();
	this.broadcastMessage('onMotionStopped',{target:this,type:'onMotionStopped'});
}
s.rewind = function(){
	this.children[this.currentChildIndex].removeListener(this.nextObject);
	this.currentChildIndex = 0;
	for(var i = 0; i < this.children.length; i++){
		this.children[i].rewind();
	}
}
s.fforward = function(){
	this.children[this.currentChildIndex].removeListener(this.nextObject);
	for(var i = 0; i < this.children.length; i++){
		this.children[i].fforward();
	}
	this.currentChildIndex = this.children.length - 1;
}
s.resume = function(){
	this.children[this.currentChildIndex].resume();
	this.broadcastMessage('onMotionResumed',{target:this,type:'onMotionStopped'});
}
s.addListener = function(o){
	this.removeListener (o);
	return this._listeners.push(o);

}
s.removeListener = function(o){
	var a = this._listeners;	
	var i = a.length;
	while (i--) {
		if (a[i] == o) {
			a.splice (i, 1);
			return true;
		}
	}
	return false;
}
s.broadcastMessage = function(){
	var arr = new Array();
	for(var i = 0; i < arguments.length; i++){
		arr.push(arguments[i])
	}
	var e = arr.shift();
	var a = this._listeners;
	var l = a.length;
	for (var i=0; i<l; i++){
		if(a[i][e])
		a[i][e].apply(a[i], arr);
	}
}

/**********************************************************************
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright (c) 2001 Robert Penner
JavaScript version copyright (C) 2006 by Philippe Maegerman
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

   * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
   * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
   * Neither the name of the author nor the names of contributors may
be used to endorse or promote products derived from this software
without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*****************************************/
function Delegate() {}
Delegate.create = function (o, f) {
	var a = new Array() ;
	var l = arguments.length ;
	for(var i = 2 ; i < l ; i++) a[i - 2] = arguments[i] ;
	return function() {
		var aP = [].concat(arguments, a) ;
		f.apply(o, aP);
	}
}
function Parallel(){
	this.children = new Array();
	this.numChildren = 0;
	this._listeners = new Array();
	this.addListener(this);
}
var s = Parallel.prototype;
s.endObject = new Object();
s.addChild = function(tween){
	this.children.push(tween)
	this.numChildren++;
}
s.start = function(){
	this.play();
	this.broadcastMessage('onMotionStarted', {target:this, type:'onMotionStarted'});
}
s.play = function(){
	for(var u = 0; u < this.numChildren; u++){
		if(u==(this.numChildren-1)){
			this.endObject = new Object();
			this.endObject.onMotionFinished = Delegate.create(this, this.end);
			this.children[u].addListener(this.endObject);
		}
		this.children[u].start();
	}
}

s.end = function(){
	this.children[this.numChildren-1].removeListener(this.endObject);
	this.broadcastMessage('onMotionFinished', {target:this, type:'onMotionFinished'});
}
s.stop = function(){
	this.enumAction('stop');
	this.broadcastMessage('onMotionStopped', {target:this, type:'onMotionStopped'});
	}
s.rewind = function(){
	this.enumAction('rewind');
	}
s.fforward = function(){
	this.enumAction('fforward');
	}
s.resume = function(){
	this.enumAction('resume');
	this.broadcastMessage('onMotionResumed', {target:this, type:'onMotionResumed'});
	}
s.yoyo = function(){
	this.enumAction('yoyo');
	}


s.enumAction = function(action){
	for(var u = 0; u < this.numChildren; u++){
		this.children[u][action]();
	}
}

s.addListener = function(o){
	this.removeListener (o);
	return this._listeners.push(o);

}
s.removeListener = function(o){
	var a = this._listeners;	
	var i = a.length;
	while (i--) {
		if (a[i] == o) {
			a.splice (i, 1);
			return true;
		}
	}
	return false;
}
s.broadcastMessage = function(){
	var arr = new Array();
	for(var i = 0; i < arguments.length; i++){
		arr.push(arguments[i])
	}
	var e = arr.shift();
	var a = this._listeners;
	var l = a.length;
	for (var i=0; i<l; i++){
		if(a[i][e])
		a[i][e].apply(a[i], arr);
	}
}