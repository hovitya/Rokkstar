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
    this.init = function () {
        this.callSuper('init');
    }

    this.stop = function () {
        this.tween.stop();
    }

    this.setUp = function (reversed) {
        if (this.transitionMode) {
            var start = this.getTarget().get(this.getProperty());
            var end = this.getEnd();
            var startProp = this.startState.properties;
            var endProp = this.endState.properties;
            //var i=startProp.length;
            /*var prop=this.getProperty();
             while(i--){
             if(startProp[i].property==prop){
             start=startProp[i].value;
             }
             }*/

            i = endProp.length;
            var prop = this.getProperty();
            while (i--) {
                if (endProp[i].property == prop) {
                    end = endProp[i].value;
                }
            }
            if (this.getType() == 'integer') {
                start = parseInt(start);
                end = parseInt(end);
            } else {
                start = parseFloat(start);
                end = parseFloat(end);
            }
            if (!reversed) {
                this.tween.begin = start;
                this.tween.setFinish(end);
            } else {
                this.tween.begin = end;
                this.tween.setFinish(start);
            }
        } else if (this.getBy() == undefined) {
            var start = this.getStart();
            var end = this.getEnd();
            if (start == undefined) {
                start = this.getTarget().get(this.getProperty());
                this.setStart(start);
            }
            if (this.getType() == 'integer') {
                start = parseInt(start);
                end = parseInt(end);
            } else {
                start = parseFloat(start);
                end = parseFloat(end);
            }
            if (!reversed) {
                this.tween.begin = start;
                this.tween.setFinish(end);
            } else {
                this.tween.begin = end;
                this.tween.setFinish(start);
            }
        } else {
            var start = this.getTarget().get(this.getProperty());
            var by = this.getBy();
            if (this.getType() == 'integer') {
                start = parseInt(start);
                by = parseInt(by);
            } else {
                start = parseFloat(start);
                by = parseFloat(by);
            }

            if (!reversed) {
                this.tween.begin = start;
                this.tween.setFinish(start + by);
            } else {
                this.tween.begin = start;
                this.tween.setFinish(start - by);
            }
        }
        this.tween.prop = this.getProperty();
    }

    this.isPlaying = function () {
        if (this.tween.isPlaying == undefined) return false;
        else return this.tween.isPlaying;
    }
}, [new Attr('property', '', 'string'), new Attr('start', undefined, 'string'), new Attr('end', 100, 'string'), new Attr('by', undefined, 'string')]);