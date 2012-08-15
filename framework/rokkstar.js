/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/**
 *
 * @namespace
 */
var Rokkstar={};

Rokkstar.referenceObject={};

Rokkstar.classReferenceCache={};

Rokkstar.objectVariablesCache={};

Rokkstar.modelCache={};

Rokkstar.templates={};

Rokkstar.globals={};

Rokkstar.globals.regex={};

Rokkstar.globals.regex.pixelFormat=/^[0-9]+px$/;

Rokkstar.globals.regex.percentFormat=/^[0-9]+%$/;

Rokkstar.profiling={sgGeneration:0,classExtension:{},initCount:0,createdComponents:{}};

Rokkstar.templates.callSuper=function(functionName){
    var args=[];
    for(var i =1;i<arguments.length;i++){
        args.push(arguments[i]);
    }

    if(this.superClass.prototype[functionName]==undefined){
        throw new core.exceptions.TypeException('Requested super method missing:'+functionName);
    }
    var ret=this.superClass.prototype[functionName].apply(this,args);


    return ret;
}

Rokkstar.createClosure=function(func,sCls,absolute){
    if(absolute==undefined || absolute==false){
        return function(){
            var sClass=sCls;
            var oldSuper=this.superClass;
            this.superClass=sClass.prototype.superClass;
            var ret=func.apply(this,arguments);
            this.superClass=oldSuper;
            return ret;};
    }else{
        return function(){
            var sClass=sCls;
            var oldSuper=this.superClass;
            this.superClass=sClass;
            var ret=func.apply(this,arguments);
            this.superClass=oldSuper;
            return ret;};
    }

}


Rokkstar.GetRealMethods=function(object){
    var methods=[];
    for(var propertyName in object){
        if(typeof(object[propertyName]) == "function" && !Rokkstar.referenceObject.hasOwnProperty(propertyName)){
            methods.push(propertyName);
        }
    }
    return methods;
}

Rokkstar.createComponent=function(name){

    var cls=getClass(name);
    var cmp=new cls;
    //cmp.init();
    return cmp;
}

Rokkstar.Extend=function(object,objectReference){

    for(var propertyName in objectReference){
        if(!Rokkstar.referenceObject.hasOwnProperty(propertyName) && propertyName!="clone"){
            if(typeof objectReference[propertyName] == 'object' && objectReference[propertyName] != null && objectReference[propertyName].constructor == Array){
                var arr=[];
                for(var i in objectReference[propertyName]){
                    arr.push(objectReference[propertyName][i]);
                }
                object[propertyName]=arr;
            }else if(typeof objectReference[propertyName] == 'object' && objectReference[propertyName] != null){
                object[propertyName]={};
            }else{
                object[propertyName]=objectReference[propertyName];
            }
        }
    }
}

Rokkstar.GetMicrotime=function() {
    var now = new Date().getTime() / 1000;
    var s = parseInt(now, 10);
    return  now;
}

Rokkstar.setterGetterCache={};

Rokkstar.uniqueIds=0;

//Define global functions
/**
 * Get class instance from string
 * @param className
 * @return {*}
 */
function getClass(className){
    //Check class reference in cache
    if(Rokkstar.classReferenceCache[className]!=undefined){
        return Rokkstar.classReferenceCache[className];
    }
    var classPath=className.split('.');
    var base=window;
    var length=classPath.length;
    for(var i=0;i<length;i++){
        base=base[classPath[i]];
        if(base==undefined){

            throw new core.exceptions.TypeException('Class not found: '+className,1);
        }
    }

    //Caching class reference for faster look up
    Rokkstar.classReferenceCache[className]=base;

    return base;
}

/**
 * Apply behaviour
 * @param self Target object
 * @param superClass Class string
 */
function behaveAs(self,superClass){
    getClass(superClass).apply(self);
}

/**
 * Extends the class with the given super class
 * @param self Target object
 * @param superClass The super class name as string
 * @param as The new class name as string
 */
function extend(self,superClass){
    if(Rokkstar.profiling.classExtension[superClass]==undefined){
        Rokkstar.profiling.classExtension[superClass]=1;
    }else{
        Rokkstar.profiling.classExtension[superClass]++;
    }
    var sClass=getClass(superClass);
    sClass.apply(self,['R::!!NO-CONSTRUCT!!']);


    //Rokkstar.Extend(self,sClass.prototype);

    self.superClass=sClass;
    self.superClass.altered=true;
    self.absoluteSuperClass=sClass;
    self.absoluteSuperClass.altered=true;
    self.callSuper=Rokkstar.templates.callSuper;
    self.callSuper.altered=true;
}

Rokkstar.classes=[];

function Attr(name,defaultValue,type,triggerEvent){
    this.name=name;
    this.defaultValue=defaultValue;
    this.type=type;
    if(triggerEvent==undefined){
        this.triggerEvent=true;
    }else{
        this.triggerEvent=false;
    }
}

/**
 * Create attribute for this object. Generate getter and setter and also initialize xml attributes.
 * @description
 * Use this method to generate standard getters setters with a single line. This method has to be called in
 * the createAttributes method.
 * @example
 * <pre><code>
 *      my.NewComponent=function(){
 *          extend(this,'core.Component');
 *
 *          this.createAttribute('width',200);
 *
 *          this.init(){
 *              this.callSuper('init');
 *              this.getWidth(); //This will return 200, if it is not overridden in the layout xml
 *              this.setWidth(350); //This will set width parameter 350 and fires widthPropertyChanged event
 *              this.getWidth(); //Returns 350
 *          }
 *      }
 * </code></pre>
 * This method looking for default value amongst the xml attributes for the first place. So if this component is
 * included into a layout xml this way <code><my:NewComponent width="900"/></code> then the first getWidth() call
 * will return 900 instead of 200.
 * @param {String} property Property name
 * @param {*} defaultValue Property default value
 */
Rokkstar.createAttribute=function(cls,property,defaultValue){
    cls.prototype._object_scope.push({name:property,val:defaultValue});

    //generating getters and setters
    var getterName='get'+property.capitalize();
    var setterName='set'+property.capitalize();
    if(cls.prototype[setterName]==undefined){
        if(Rokkstar.setterGetterCache[setterName]==undefined){
            Rokkstar.profiling.sgGeneration++;
            Rokkstar.setterGetterCache[setterName]=function(v){
                this.set(property,v);
            };
        }

        cls.prototype[setterName]=Rokkstar.setterGetterCache[setterName];
    }
    if(cls.prototype[getterName]==undefined){
        if(Rokkstar.setterGetterCache[getterName]==undefined){
            Rokkstar.profiling.sgGeneration++;
            Rokkstar.setterGetterCache[getterName]=function(){
                return this.get(property);
            };
        }

        cls.prototype[getterName]=Rokkstar.setterGetterCache[getterName];
    }
}

Rokkstar.instanceOf=function(object,type){
    if(typeof object != "object") return false;
    if(object.__classType==undefined) return false;
    if(object.__classType==type) return true;
    if(object._classHierarchy.indexOf(type)!=-1) return true;
    for(var i in object._interfaces){
        if(object._interfaces[i]==type) return true;
    }
    return false;
}

Rokkstar.createInterface=function(name,structure,interfaces){

}

Rokkstar.console={};

Rokkstar.console.warning=function(message){
    if(console){
        console.warn(message);
    }
}

/**
 * Creates a new a class.
 * @param {Function} structure Class structure creator function.
 * @param {String} superClass Optional. Super class which will be extended.
 * @param {Array} behaviours Optional. Class behaviours.
 * @return {Function} Class declaration.
 */
Rokkstar.createClass=function(name,superClass,structure,attributes,behaviours,interfaces){
    Rokkstar.classes.push(name);
    return function(){
        var cls=getClass(name);
        if(cls.prototype.constructed==undefined){

            cls.prototype._object_scope=[];
            cls.prototype._interfaces=[];
            cls.prototype._attributeTypes={};
            cls.prototype._classHierarchy=[];

            //constructing prototype
            var reference={};

            if(superClass!=undefined){
                var superCls=getClass(superClass);
                //Copy prototypes
                //Check is super class initialized
                if(superCls.constructed==undefined){
                    superCls.apply({},["R::!!NO-CONSTRUCT!!"]);
                }
                Rokkstar.Extend(cls.prototype,superCls.prototype);
                //Copy object variables
                //cls.prototype._object_scope=cls.prototype._object_scope.concat(superCls.prototype._object_scope);
                //cls.prototype._attributes=cls.prototype._attributes.concat(superCls.prototype._attributes);
                Rokkstar.Extend(cls.prototype._attributeTypes,superCls.prototype._attributeTypes);
                cls.prototype._interfaces=cls.prototype._interfaces.concat(superCls.prototype._interfaces);
                cls.prototype._classHierarchy=cls.prototype._interfaces.concat(superCls.prototype._classHierarchy);
                cls.prototype._classHierarchy.push(superClass);
                //Rokkstar.Extend(cls.prototype._interfaces,superCls.prototype._attributeTypes);
                cls.prototype.superClass=superCls;
                //Copy rokkstar object to local namespace
                cls.prototype.rokk=Rokkstar;
            }else{
                cls.prototype.callSuper=Rokkstar.templates.callSuper;
                cls.prototype.callSuper.altered=true;
                cls.prototype.set=function(property,value){
                    var target;
                    if(this.propertyRedirections.hasOwnProperty(property) && this.propertyRedirections[property]!=null){
                        target=this.propertyRedirections[property];
                        target.set(property,value);
                    }else{
                        target=this;
                        var oldValue=target[property];
                        target[property]=Rokkstar.parseAttribute(value,this._attributeTypes[property]);
                        var event=new core.events.PropertyChangeEvent(property+'PropertyChanged',oldValue,value,property);
                        target.triggerEvent(event);
                    }
                }

                cls.prototype.get=function(property){
                    var val=this[property]
                    //Resolve reference
                    if(typeof val == "string" && val.substr(0,1)=='$'){
                        val=eval('var x='+val.substr(1)+'; x');
                        if(val==undefined){
                            throw new core.Exception('Cannot resolve reference: '+val);
                        }
                        this[property]=this[val];
                    }
                    return this[property];
                }
            }

            if(behaviours!=undefined && typeof Array){
                for(var i in behaviours){
                    behaveAs(reference,behaviours[i]);
                }
            }

            //Building class structure
            structure.apply(reference);

          //Creating attributes
            if(attributes!=undefined){
                var j=attributes.length;
                while(--j>=0){
                    var attr=attributes[j];
                    cls.prototype._attributeTypes[attr.name]=attr.type;
                    Rokkstar.createAttribute(cls,attr.name,attr.defaultValue,attr.type);
                }
            }

            //Altering new functions
            for(var i in reference){
                if(reference.hasOwnProperty(i)){
                    var refValue=reference[i];
                    if(refValue instanceof Function){
                        if(refValue.altered==undefined){
                            var sign=refValue.length;
                            if(superClass!=undefined){
                                refValue=Rokkstar.createClosure(refValue,cls);
                            }
                            refValue.altered=true;
                            refValue.originalSignature=sign;
                        }
                        cls.prototype[i]=refValue;
                    }else if(i!="_object_scope" && i!="_attributes" && i!="_attributeTypes" && i!="_interfaces"){
                        cls.prototype._object_scope.push({name:i,val:refValue});
                    }
                }
            }
            cls.prototype.constructed=true;

            if(interfaces!=undefined){
                for(var i in interfaces){
                    var iface=getClass(interfaces[i]);
                    for(var j in iface){
                        if(iface.hasOwnProperty(j) && iface[j] instanceof Function){
                            if(cls.prototype[j] instanceof Function && (cls.prototype[j].originalSignature==iface[j].length || (cls.prototype[j].originalSignature==undefined && cls.prototype[j].length==iface[j].length))){
                                //Correct implementation
                            }else{
                                throw new Error('Interface function '+j+' is missing, or it has wrong signature. Interface:'+interfaces[i]);
                            }
                        }
                    }
                    cls.prototype._interfaces.push(interfaces[i]);
                }
            }


        }



        var j=cls.prototype._object_scope.length;
        while(--j>=0){
            var prop=cls.prototype._object_scope[j];
            if(typeof prop.val == 'object'){
                if(prop.val==null){
                    this[prop.name]=null;
                }else if(Object.prototype.toString.call(prop.val ) === '[object Array]'){
                    this[prop.name]=[];
                }else{
                    this[prop.name]={};
                }
            }else{
                this[prop.name]=prop.val;
            }
        }

        //Set type
        this.__classType=name;

        if(arguments.length!=1  || arguments[0]!="R::!!NO-CONSTRUCT!!"){
            if(this.construct!=undefined){ this.construct.apply(this,arguments);}
        }

    }
};



Rokkstar.parseAttribute=function(val,typeForcing){
    var ret;
    if(val==undefined) return val;
    if(typeForcing=='boolean'){
        if(val!=undefined) ret=!(val=='false' || val==false);
        else ret=val;
    }else if(typeForcing=='integer'){
        if(val!=undefined) ret=parseInt(val);
        else ret=val;
    }else if(typeForcing=='float'){
        if(val!=undefined) ret=parseFloat(val);
        else ret=val;
    }else if(typeForcing=='array'){
        if(val instanceof Array){
            ret=val;
        }else{
            ret=[];
            ret.push(val);
        }
    }else if(typeForcing=='string'){
        if(typeof val == 'object'){
            ret=val.toString();
        }
        ret=val;
    }else if(typeForcing==undefined || typeForcing=='object' || typeForcing=='*' || typeForcing=='function'){
        ret=val;
    }else{
        if(typeof val == 'string'){
            var object=new typeForcing;
            if(!Rokkstar.instanceOf(object,'core.ISerializable')) throw new TypeError('This class cannot be initialized from string.');
            object.unserialize(val);
            ret=object;
        }else if(typeof val == 'object'){
            if(!Rokkstar.instanceOf(val,typeForcing)) throw new TypeError('Type mismatch. Requested type: '+typeForcing);
            ret=val;
        }else{
            throw new TypeError('Unknown attribute type.');
        }
    }
    return ret;
};

// Creating prototypes
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.uncapitalize = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
};

String.prototype.trim=function()
{
    var l=0; var r=this.length -1;
    while(l < this.length && this[l] == ' ')
    {     l++; }
    while(r > l && this[r] == ' ')
    {     r-=1;     }
    return this.substring(l, r+1);
}

//Creating primitive types.
Object.prototype.__classType="object";
Object.prototype.callGetter=function(attribute){
    return this["get"+property.capitalize()].apply(this,[]);
}

Object.prototype.hasAttribute=function(attribute){
    if(this._attributeTypes==undefined) return false;
    if(this._attributeTypes[attribute]==undefined) return false;
    return true;
}
String.prototype.__classType="string";
Boolean.prototype.__classType="boolean";
Function.prototype.__classType="function";
Number.prototype.__classType="number";


Rokkstar.requestAnimationFrame = Modernizr.prefixed('requestAnimationFrame', window) || function(callback){ window.setTimeout(callback, 1000 / 60); };





Rokkstar.toDegree=function(radians){
    var pi = Math.PI;
    var deg = (radians)*(180/pi);
    return Number(deg);
};

Rokkstar.toRadians=function(degree) {
    var pi = Math.PI;
    var rad = degree*(pi/180);
    return Number(rad);
};

Rokkstar.hexToRgb=function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};


//Extending jquery
//Mobile detection
//(function(a){jQuery.browser.mobile=/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);



//Component basics
(function( $ ) {

    var methods = {
        init : function( className ) {
            this.each(function(){
                var name=className;
                if(Rokkstar.profiling.createdComponents[name]==undefined){
                    Rokkstar.profiling.createdComponents[name]=1;
                }else{
                    Rokkstar.profiling.createdComponents[name]++;
                }
                var cls=getClass(className);
                if(cls==undefined) console.log("Fatal error: Class missing "+className);
                eval(className+".apply(this);");


            });
            return this.get(0);
        }
    };

    $.fn.xComponent=function(method){
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.xComponent' );
        }
    }

})( jQuery );

/**
 * Initialize Rokkstar components.
 * @function
 * @param {HTMLElement} element Dom to be parsed.
 */
Rokkstar.parseDOM=function(element,owner){
    var comps=[];
    $(element).find('.xComp').each(function(index, element) {
        console.profile();
        var component = Rokkstar.createComponent($(this).data('class'));
        console.profileEnd();
        $(this).append(component.domElement);
        if(window.RokkstarApps==undefined) window.RokkstarApps=[];
        window.RokkstarApps.push(component);

    });
    for(var i in window.RokkstarApps){
        console.profile();
        window.RokkstarApps[i].start();
        console.profileEnd();
    }
}

/**
 * Start Rokkstar framework.
 * @function
 */
Rokkstar.init=function(){
    //Prepare view
    /*if($.browser.mobile){
        if($('body').data('mobileVersion')!=null){
            document.location=$('body').data('mobileVersion');
        }
    }else{
        if($('body').data('desktopVersion')!=null){
            document.location=$('body').data('desktopVersion');
        }
    }*/
    //Application bootstrap
    Rokkstar.parseDOM($('body').get(0));
}


$(function(){
    //Initialize classes
    var classes=Rokkstar.classes;
    var i=classes.length;
    while(--i>=0){
            var current=getClass(classes[i]);
            if(current.prototype.constructed==undefined){
                console.log('init: '+classes[i]);
                //console.profile();
                current.apply({},["R::!!NO-CONSTRUCT!!"]);
                //console.profileEnd();

            }

    }

    Rokkstar.init();
});


Rokkstar.globals.DOMEvents=['mouseover','mouseout','mousemove','blur','mouseup','mousedown','touchend','touchstart','keyup','keydown','focus'];