/**
    @overview Builds a tree-like JSON string from the doclet data.
    @version 0.0.3
    @example
        ./jsdoc scratch/jsdoc_test.js -t templates/haruki -d console -q format=xml
 */

function graft(parentNode, childNodes, parentLongname, parentName) {
    childNodes
    .filter(function (element) {
        return (element.memberof === parentLongname);
    })
    .forEach(function (element, i) {
        if (element.kind === 'namespace') {
            if (! parentNode.namespaces) {
                parentNode.namespaces = [];
            }
            
            var thisNamespace = {
                'name': element.name,
                'description': element.description || '',
                'access': element.access || '',
                'virtual': !!element.virtual
            };

            //parentNode.namespaces.push(thisNamespace);
            if (!parentNode.currentNamespaceHierarchy) parentNode.currentNamespaceHierarchy = [];
            parentNode.currentNamespaceHierarchy.push(element.name);
            graft(parentNode, childNodes, element.longname, element.name);
            parentNode.currentNamespaceHierarchy.pop();
        }
        else if (element.kind === 'mixin') {
            if (! parentNode.mixins) {
                parentNode.mixins = [];
            }
            
            var thisMixin = {
                'name': element.name,
                'description': element.description || '',
                'access': element.access || '',
                'virtual': !!element.virtual
            };

            parentNode.mixins.push(thisMixin);
            
            graft(thisMixin, childNodes, element.longname, element.name);
        }
        else if (element.kind === 'function') {
            if (! parentNode.functions) {
                parentNode.functions = {};
            }
            
            var thisFunction = {
                'name': element.name,
                'access': element.access || 'public',
                'virtual': !!element.virtual,
                'description': element.description || '',
                'parameters': [ ],
                'examples': [],
                'isOverride': !!element.isOverride,
                'static': !!element.static
            };

            parentNode.functions[thisFunction.name]=thisFunction;

            if (element.returns) {
                thisFunction.returns = {
                    'type': element.returns[0].type? (element.returns[0].type.names.length === 1? element.returns[0].type.names[0] : element.returns[0].type.names) : 'void',
                    'description': element.returns[0].description || ''
                };
            }else{
                thisFunction.returns = {'type':'void','description':''};
            }
            
            if (element.examples) {
                for (var i = 0, len = element.examples.length; i < len; i++) {
                    thisFunction.examples.push(element.examples[i]);
                }
            }
            
            if (element.params) {
                for (var i = 0, len = element.params.length; i < len; i++) {
                    thisFunction.parameters.push({
                        'name': element.params[i].name,
                        'type': element.params[i].type? (element.params[i].type.names.length === 1? element.params[i].type.names[0] : element.params[i].type.names) : '*',
                        'description': element.params[i].description || '',
                        'default': element.params[i].defaultvalue || '',
                        'optional': typeof element.params[i].optional === 'boolean'? element.params[i].optional : false,
                        'nullable': typeof element.params[i].nullable === 'boolean'? element.params[i].nullable : false
                    });
                }
            }
        }
        else if (element.kind === 'member') {
            if (! parentNode.properties) {
                parentNode.properties = {};
            }
            parentNode.properties[element.name]={
                'name': element.name,
                'access': element.access || 'public',
                'virtual': !!element.virtual,
                'description': element.description || '',
                'type': element.type? (element.type.length === 1? element.type[0] : element.type) : '',
                'static': !!element.static,
                'notNull': !!element.notNull,
                'bindable': !!element.bindable,
                'getter': element.getter || '',
                'setter': element.setter || ''
            };
        }
        
        else if (element.kind === 'event') {
            if (! parentNode.events) {
                parentNode.events = [];
            }
            
            var thisEvent = {
                'name': element.name,
                'access': element.access || '',
                'virtual': !!element.virtual,
                'description': element.description || '',
                'parameters': [],
                'examples': []
            };

            parentNode.events.push(thisEvent);
            
            if (element.returns) {
                thisEvent.returns = {
                    'type': element.returns.type? (element.returns.type.names.length === 1? element.returns.type.names[0] : element.returns.type.names) : '',
                    'description': element.returns.description || ''
                };
            }
            
            if (element.examples) {
                for (var i = 0, len = element.examples.length; i < len; i++) {
                    thisEvent.examples.push(element.examples[i]);
                }
            }
            
            if (element.params) {
                for (var i = 0, len = element.params.length; i < len; i++) {
                    thisEvent.parameters.push({
                        'name': element.params[i].name,
                        'type': element.params[i].type? (element.params[i].type.names.length === 1? element.params[i].type.names[0] : element.params[i].type.names) : '*',
                        'description': element.params[i].description || '',
                        'default': element.params[i].defaultvalue || '',
                        'optional': typeof element.params[i].optional === 'boolean'? element.params[i].optional : '',
                        'nullable': typeof element.params[i].nullable === 'boolean'? element.params[i].nullable : ''
                    });
                }
            }
        }
        else if (element.kind === 'class') {
            if (! parentNode.classes) {
                parentNode.classes = {};
            }
            var packageName ="";
            if(parentNode.currentNamespaceHierarchy){
                packageName = parentNode.currentNamespaceHierarchy.join(".");
            }
            var thisClass = {
                'name': element.name,
                'description': element.classdesc || '',
				'package': packageName,
                'type': 'class',
                'extends': element.augments || [],
                'impls': element.impls || [],
                'isInterface' : !!element.isInterface,
                'access': element.access || 'public',
                'virtual': !!element.virtual,
                'fires': element.fires || '',
                'constructor': {
                    'name': element.name,
                    'description': element.description || '',
                    'parameters': [
                    ],
                    'examples': []
                },
                arguments:element.arguments || []
            };

            if(thisClass.package=="") parentNode.classes[thisClass.name]=thisClass;
            else parentNode.classes[thisClass.package+"."+thisClass.name]=thisClass;
            
            if (element.examples) {
                for (var i = 0, len = element.examples.length; i < len; i++) {
                    thisClass.constructor.examples.push(element.examples[i]);
                }
            }
            
            if (element.params) {
                for (var i = 0, len = element.params.length; i < len; i++) {
                    thisClass.constructor.parameters.push({
                        'name': element.params[i].name,
                        'type': element.params[i].type? (element.params[i].type.names.length === 1? element.params[i].type.names[0] : element.params[i].type.names) : '',
                        'description': element.params[i].description || '',
                        'default': element.params[i].defaultvalue || '',
                        'optional': typeof element.params[i].optional === 'boolean'? element.params[i].optional : '',
                        'nullable': typeof element.params[i].nullable === 'boolean'? element.params[i].nullable : ''
                    });
                }
            }

            /*if (element.arguments) {
                for (var i = 0, len = element.arguments.length; i < len; i++) {
                    thisClass.arguments.push({
                        'name': element.params[i].name,
                        'type': element.arguments[i].type? (element.arguments[i].type.names.length === 1? element.arguments[i].type.names[0] : element.arguments[i].type.names) : '',
                        'description': element.arguments[i].description || '',
                        'default': element.arguments[i].defaultvalue || '',
                        'optional': typeof element.arguments[i].optional === 'boolean'? element.arguments[i].optional : '',
                        'nullable': typeof element.arguments[i].nullable === 'boolean'? element.arguments[i].nullable : ''
                    });
                }
            }*/
            
            graft(thisClass, childNodes, element.longname, element.name);
       }        else if (element.kind === 'behaviour') {
            if (! parentNode.classes) {
                parentNode.classes = {};
            }

            var thisClass = {
                'name': element.name,
                'description': element.classdesc || '',
                'package': element.package || '',
                'type': 'behaviour',
                'extends': element.augments || [],
                'implements': element.impls || [],
                'access': element.access || '',
                'isInterface' : !!element.isInterface,
                'virtual': !!element.virtual,
                'fires': element.fires || '',
                'constructor': {
                    'name': element.name,
                    'description': element.description || '',
                    'parameters': [
                    ],
                    'examples': []
                },
                arguments:element.arguments || []
            };

            parentNode.classes[thisClass.package+"."+thisClass.name]=thisClass;

            if (element.examples) {
                for (var i = 0, len = element.examples.length; i < len; i++) {
                    thisClass.constructor.examples.push(element.examples[i]);
                }
            }

            if (element.params) {
                for (var i = 0, len = element.params.length; i < len; i++) {
                    thisClass.constructor.parameters.push({
                        'name': element.params[i].name,
                        'type': element.params[i].type? (element.params[i].type.names.length === 1? element.params[i].type.names[0] : element.params[i].type.names) : '',
                        'description': element.params[i].description || '',
                        'default': element.params[i].defaultvalue || '',
                        'optional': typeof element.params[i].optional === 'boolean'? element.params[i].optional : '',
                        'nullable': typeof element.params[i].nullable === 'boolean'? element.params[i].nullable : ''
                    });
                }
            }

            /*if (element.arguments) {
             for (var i = 0, len = element.arguments.length; i < len; i++) {
             thisClass.arguments.push({
             'name': element.params[i].name,
             'type': element.arguments[i].type? (element.arguments[i].type.names.length === 1? element.arguments[i].type.names[0] : element.arguments[i].type.names) : '',
             'description': element.arguments[i].description || '',
             'default': element.arguments[i].defaultvalue || '',
             'optional': typeof element.arguments[i].optional === 'boolean'? element.arguments[i].optional : '',
             'nullable': typeof element.arguments[i].nullable === 'boolean'? element.arguments[i].nullable : ''
             });
             }
             }*/

            graft(thisClass, childNodes, element.longname, element.name);
        }else if (element.kind === 'interface'){
            if (! parentNode.classes) {
                parentNode.classes = {};
            }

            var thisClass = {
                'name': element.name,
                'description': element.classdesc || '',
                'package': element.package || '',
                'type': 'interface',
                'extends': element.augments || []
            };
            parentNode.classes[thisClass.package+"."+thisClass.name]=thisClass;
            graft(thisClass, childNodes, element.longname, element.name);
            
        }
    });
}
var currentNamespaceHierarchy=[];
/**
    @param {TAFFY} data
    @param {object} opts
 */
exports.publish = function(data, opts) {

    var root = {},
        docs;
    
    data.remove({undocumented: true});
    docs = data.get(); // <-- an array of Doclet objects

    graft(root, docs);
    
    if (opts.destination === 'console') {
        if (opts.query && opts.query.format === 'xml') {
            var xml = require('goessner/json2xml');
            console.log( '<jsdoc>\n' + xml.convert(root) + '\n</jsdoc>' );
        }
        else {
            console.log(root);
        }
    }
    else {
        console.log('The only -d destination option currently supported is "console"!');
    }
        
};
