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

Rokkstar.templates={};

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
    var cmp=eval('var x=new '+name+'();x');
    cmp.init();
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
    var ret;
    eval("ret="+className+";");
    if(ret==undefined){
        throw new core.exceptions.TypeException('Class not found: '+className,1);
    }
    return ret;
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

    if(sClass.prototype.constructed==undefined){
        eval("new "+superClass+"('R::!!NO-CONSTRUCT!!');");
    }
    Rokkstar.Extend(self,sClass.prototype);
    self.superClass=sClass;
    self.superClass.altered=true;
    self.absoluteSuperClass=sClass;
    self.absoluteSuperClass.altered=true;
    self.callSuper=Rokkstar.templates.callSuper;
    self.callSuper.altered=true;
}

/**
 * Creates a new a class.
 * @param {Function} structure Class structure creator function.
 * @param {String} superClass Optional. Super class which will be extended.
 * @param {Array} behaviours Optional. Class behaviours.
 * @return {Function} Class declaration.
 */
Rokkstar.class=function(name,superClass,structure,behaviours){
    return function(){
        if(getClass(name).prototype.constructed==undefined){
            var func=function(){
                if(superClass!=undefined){
                    extend(this,superClass);
                }

                if(behaviours!=undefined && typeof Array){
                    for(var i in behaviours){
                        behaveAs(this,behaviours[i]);
                    }
                }

                //Building class structure
                structure.apply(this);

                //Altering new functions
                for(var i in this){
                    if(this[i] instanceof Function && this[i].altered==undefined){
                        var func=this[i];
                        if(superClass!=undefined){
                            this[i]=Rokkstar.createClosure(this[i],getClass(name));
                        }

                        this[i].altered=true;
                    }
                }
            }

            func.apply(getClass(name).prototype);
            getClass(name).prototype.type=name;
            getClass(name).prototype.constructed=true;


        }
        //Set type
        this.type=name;

        //Create local variables
        var cls=getClass(name);
        for(var i in cls.prototype){
            if(!$.isFunction(cls.prototype[i])){
                if(typeof cls.prototype[i]=='string' || typeof cls.prototype[i]=='number' ||  typeof cls.prototype[i]=='boolean' || typeof cls.prototype[i]=='undefined'){
                    this[i]=cls.prototype[i];
                }else if(cls.prototype[i] === null){
                    this[i]=null;
                }else if(cls.prototype[i] instanceof Array){
                    if(cls.prototype[i].length!=0) throw new core.exceptions.TypeException('Cannot initialize object property with complex type (array with elements). Use empty array instead and fill with variables from the constructor. Property name: '+name+'#'+i+".",900);
                    this[i]=[];
                }else if(cls.prototype[i] instanceof Object){
                    if(!$.isEmptyObject(cls.prototype[i])) core.exceptions.TypeException('Cannot initialize object property with complex type (non-empty object). Use empty object ({}) or null. Property name: '+name+'#'+i+".",900);
                    this[i]={};
                }
            }
        }

        if(arguments.length!=1  || arguments[0]!="R::!!NO-CONSTRUCT!!"){
            if(this.construct!=undefined){ this.construct.apply(this,arguments);}
        }
    }
};



Rokkstar.parseAttribute=function(val,typeForcing){
    var ret;
    if(typeForcing=='boolean'){
        if(val!=undefined) ret=!(val=='false' || val==false);
        else ret=val;
    }else if(typeForcing=='integer'){
        if(val!=undefined) ret=parseInt(val);
        else ret=val;
    }else if(typeForcing=='array'){
        if(val instanceof Array){
            ret=val;
        }else{
            ret=[];
            ret.push(val);
        }
    }else if(typeForcing=='object'){
        if(val instanceof Object){
            ret=val;
        }else{
            ret=JSON.parse(val.replace(/'/g,'"'));
        }
    }else{
        ret=val;
    }
    return ret;
}

// Creating prototypes
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.uncapitalize = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
};


//Extending jquery
//Mobile detection
(function(a){jQuery.browser.mobile=/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);


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
        var component = Rokkstar.createComponent($(this).data('class'));
        $(this).append(component.domElement);
        if(window.RokkstarApps==undefined) window.RokkstarApps=[];
        window.RokkstarApps.push(component);

    });
    for(var i in window.RokkstarApps){
        window.RokkstarApps[i].start();
    }
}

/**
 * Start Rokkstar framework.
 * @function
 */
Rokkstar.init=function(){
    //Prepare view
    if($.browser.mobile){
        if($('body').data('mobileVersion')!=null){
            document.location=$('body').data('mobileVersion');
        }
    }else{
        if($('body').data('desktopVersion')!=null){
            document.location=$('body').data('desktopVersion');
        }
    }
    //Application bootstrap
    Rokkstar.parseDOM($('body').get(0));
}


$(function(){
    Rokkstar.init();
});
