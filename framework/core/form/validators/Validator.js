/* Rokkstar JavaScript Framework
 *
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * The Validator class is the base class for all Rokkstar validators. This class implements the ability for a validator to make a field required, which means that the user must enter a value in the field or the validation fails.
 * @class
 * @name Validator
 * @package core.form.validators
 */
core.form.validators.Validator=Rokkstar.createClass('core.form.validators.Validator','core.Component',function(){

    this.subFields=undefined;

    this.construct=function(){
        this.callSuper('construct');
        this.subFields=['default'];
    }

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('triggerPropertyChanged',this.__triggerChanged,this);
        this.createEventListener('triggerEventPropertyChanged',this.__triggerEventChanged,this);
        this.createEventListener('sourcePropertyChanged',this.__sourceChanged,this);
    }

    /**
     *
     * @param {core.events.PropertyChangeEvent} event
     * @private
     */
    this.__triggerChanged=function(event){
        if(this.getTriggerEvent()!=undefined){
            if(event.oldValue!=undefined){
                event.oldValue.deleteEventListener(this.getTriggerEvent(),this.__trigger,this);
            }
            if(event.newValue!=undefined){
                event.newValue.createEventListener(this.getTriggerEvent(),this.__trigger,this);
            }
        }
    }

    /**
     *
     * @param {core.events.PropertyChangeEvent} event
     * @private
     */
    this.__triggerEventChanged=function(event){
        if(this.getTrigger()!=undefined){
            if(event.oldValue!=undefined){
                this.getTrigger().deleteEventListener(event.oldValue,this.__trigger,this);
            }
            if(event.newValue!=undefined){
                this.getTrigger().createEventListener(event.newValue,this.__trigger,this);
            }
        }
    }

    /**
     *
     * @param {core.events.PropertyChangeEvent} event
     * @private
     */
    this.__sourceChanged=function(event){
        if(this.trigger==undefined){
            event.oldValue.deleteEventListener(this.getTriggerEvent(),this.__trigger,this);
            event.newValue.createEventListener(this.getTriggerEvent(),this.__trigger,this);
        }
    }



    this.getTrigger=function(){
        if(this.trigger!=undefined) return this.trigger;
        return this.source;
    }


    this.getListener=function(){
        if(this.listener!=undefined) return this.listener;
        return this.source;
    }

    /**
     *
     * @private
     */
    this.__trigger=function(){
        this.validate();
    }



    this.validate=function(value,suppressEvents){
        if(suppressEvents==undefined){
            suppressEvents=false;
        }
        if(value==undefined){
           value=this.getValueFromSource();
        }
        var results=this.doValidation(value);

        var resultEvent=this.handleResults(results);

        if(!suppressEvents){
            for(var i in this.subFields){
                if(this.listenerHandlers[this.subFields[i]]!=null && this.listenerHandlers[this.subFields[i]]!=undefined) this.listenerHandlers[this.subFields[i]].triggerEvent(resultEvent);
            }
        }
        return resultEvent;
    }

    /**
     * Returns a ValidationResultEvent from the Array of error results.
     * Internally, this function takes the results from the doValidation() method and puts it into a
     * ValidationResultEvent object. Subclasses, such as the RegExpValidator class, should override this function if
     * they output a subclass of ValidationResultEvent objects, such as the RegExpValidationResult objects, and needs
     * to populate the object with additional information. You never call this function directly, and you should rarely
     * override it.
     *
     * @param {Array} results
     * @protected
     * @return {core.form.validators.ValidationResultEvent}
     */
    this.handleResults=function(results){
        var type='valid';
        var message='';
        if(results.length!=0){
            type='invalid';
            for(var i in results){
                message+=results[i].errorMessage+" ";
            }
        }
        var resultEvent=new core.form.validators.ValidationResultEvent(type);
        resultEvent.field=this.getProperty();
        resultEvent.results=results;
        resultEvent.message=message;
        return resultEvent;
    }

    /**
     * Executes the validation logic of this validator, including validating that a missing or empty value causes a validation error as defined by the value of the required property.
     * If you create a subclass of a validator class, you must override this method.
     * @param {object} value Value to validate.
     * @protected
     * @return {Array} For an invalid result, an Array of ValidationResult objects, with one ValidationResult object for each field examined by the validator that failed validation.
     */
    this.doValidation=function(value){
        var errors=[];
        if(this.getRequired() && this.isRealValue(value)) errors.push(new core.form.validators.ValidationResult(true,this.subField,this.getRequiredFieldError(),"REQUIRED_FIELD_ERROR"));
        return errors;
    }

    /**
     * Returns the Object to validate. Complex subclasses override this method because they need to access the values
     * from multiple subfields.
     *
     * @return {object}
     */
    this.getValueFromSource=function(){
        var source=this.getSource();
        if(source.hasAttribute(this.getProperty())){
            return this.callGetter(this.getProperty());
        }else{
            return source[this.getProperty()];
        }
    }

    /**
     * Returns true if value is not null.
     * @protected
     * @param {object} value
     * @return {Boolean} true if value is not null
     */
    this.isRealValue=function(value){
        if(Rokkstar.instanceOf(value,'string')){
            return value.trim()=="";
        }else if(Rokkstar.instanceOf(value,'array')){
            return value.length==0;
        }else{
            return value==null || value==undefined;
        }
    }

    this.listenerHandlers={};

    this.removeListenerHandlers=function(){
        this.listenerHandlers={};
    }

    this.addListenerHandlers=function(){
        this.listenerHandlers["default"]=this.getListener();
    }


},[new Attr('enabled',true,'boolean'),new Attr('trigger',undefined,'core.EventDispatcher'),new Attr('triggerEvent','valueCommit','string'),new Attr('source',undefined,'core.EventDispatcher'),new Attr('listener',undefined,'core.EventDispatcher'),
    new Attr('property','value','string'),new Attr('required',false,'boolean'),new Attr('requiredFieldError',"This field is required.",'string')]);