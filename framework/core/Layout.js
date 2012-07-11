/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Create base layout object.
 * @author Horváth Viktor
 * @classdef All Layout classes have to extend this class.
 * @augments core.Component
 * @constructor
 */
core.Layout =Rokkstar.class('core.Layout','core.Component',function () {

    this.lastDiv = null;
    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.createAttribute('paddingLeft', '0');
        this.createAttribute('paddingRight', '0');
        this.createAttribute('paddingTop', '0');
        this.createAttribute('paddingBottom', '0');
    }


    this.init = function () {


        this.callSuper('init');
        //this.createEventListener('paddingLeftPropertyChanged',this.);
        this.createEventListener('paddingLeftPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('paddingRightPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('paddingTopPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('paddingBottomPropertyChanged', this.selfRefreshLayout, this);
    }

    /**
     * Refresh layout listener
     * @event
     * @param {core.Event} event Event object
     * @private
     */
    this.selfRefreshLayout = function (event) {
        event.stopPropagation();
        if (this.lastDiv != null) {
            //TODO: Replace this with event handling (one layout - multiple group case)
            //this.doLayout(this.lastDiv);
            this.lastDiv.invalidateLayout();
        }
    }

    /**
     * Applies layout to div.
     * @param {core.VisualContainer} div The layout object applies layout format to this div.
     */
    this.doLayout = function (div) {
        this.lastDiv = div;
        //Remove previously created attributes
        $(div.domElement).children().each(function () {
            $(this).css(
                {
                    'left':'',
                    'right':'',
                    'top':'',
                    'bottom':'',
                    'width':'',
                    'height':'',
                    'box-sizing': 'border-box',
                    '-moz-box-sizing': 'border-box',
                    '-webkit-box-sizing': 'border-box'
                }
            );
        });
    }


    this.stringToPixel=function(data,referenceValue,paddingA,paddingB){
        var percentRegexp=/^[0-9]+%$/;
        var pxRegexp=/^[0-9]+px$/;
        if(data=='auto'){
            return 'auto';
        }else if(percentRegexp.test(data)){
            var p=parseInt(data.replace('%',''));
            var padding=Math.round((((parseFloat(paddingA)+parseFloat(paddingB))/parseFloat(referenceValue)))*100);
            return (p-padding)+'%';
        }else if(pxRegexp.test(data)){
            return parseInt(data.replace('px',''));
        }else{
            return parseInt(data);
        }

    }


});