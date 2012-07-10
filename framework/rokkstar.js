/* ROKKSTAR Framework
    Copyright Imagix Interactive Kft. 2012 */
"use strict";

//Define global variables
var components=[];

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

    if(this.altered==undefined){
        //Object contains unaltered methods
        for(var i in this){
            if(this[i] instanceof Function && this[i].altered==undefined){
                var func=this[i];
                this[i]=Rokkstar.createClosure(this[i],this.absoluteSuperClass,true);
                this[i].altered=true;
            }
        }
        this.altered=true;
    }
    if(this.superClass[functionName]==undefined){
        throw new core.exceptions.TypeException('Requested super method missing:'+functionName);
    }
    var ret=this.superClass[functionName].apply(this,args);


    return ret;
}

Rokkstar.createClosure=function(func,sCls,absolute){
    if(absolute==undefined || absolute==false){
        return function(){
            var sClass=sCls;
            var oldSuper=this.superClass;
            this.superClass=sClass.superClass;
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

    //if(precreatedDiv==undefined){
    //    var div=$('<div />');
    //}else{
    //    var div=precreatedDiv;
    //}

    //div.xComponent('init',name);
    //div.get(0).init();
    //return div.get(0);
    var cmp={};
    var cls=getClass(name);
    cls.apply(cmp);
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
 * Extends the class
 * @param self Target object
 * @param superClass Class string
 */
function extend(self,superClass){
    console.log("class creation");
    if(Rokkstar.profiling.classExtension[superClass]==undefined){
        Rokkstar.profiling.classExtension[superClass]=1;
    }else{
        Rokkstar.profiling.classExtension[superClass]++;
    }
    if(Rokkstar.classReferenceCache[superClass]==undefined){
        var sClass={};
        getClass(superClass).apply(sClass);
        //Altering functions
        if(sClass.superClass!=undefined){
            for(var i in sClass){

                if(sClass[i] instanceof Function && sClass[i].altered==undefined){
                    var func=sClass[i];
                    sClass[i]=Rokkstar.createClosure(sClass[i],sClass);
                    sClass[i].altered=true;
                }
            }
        }
        Rokkstar.Extend(self,sClass);
        Rokkstar.classReferenceCache[superClass]=sClass;
    }else{
        var sClass=Rokkstar.classReferenceCache[superClass];
        Rokkstar.Extend(self,sClass);
    }

    self.superClass=sClass;
    self.absoluteSuperClass=sClass;
    self.callSuper=Rokkstar.templates.callSuper;
    self.callSuper.altered=true;
}


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

                components.push(this);

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
        this.parentApplication=window;
        var component=$(this).xComponent('init',$(this).data('class'));
        $(this).removeClass('xComp');
        comps.push(component);
        if(owner!=undefined && component.getXMLData('id',undefined)!=undefined){
            owner[component.getXMLData('id',undefined)]=component;
        }

    });
    $(comps).each(function(i,e){
        console.log('init');
        if(this['initialized']==undefined){
            this.init();
            $(this).append(this.domElement);
            this.start();
        }
        this['initialized']=true;
    });
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
