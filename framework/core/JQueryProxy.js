
/**
 * Creates new JQueryProxy object.
 * @class
 * @constructor
 */
core.JQueryProxy=function(){
    this.findById=function(id){
        return $(this).find('#'+id).get(0);
    }

    this.getById=function(id){
        return $('#'+id).get(0);
    }

    this.findOneByClass=function(className){
        return $(this).find('.'+className).get(0);
    }

    this.findByClass=function(className){
        return $.makeArray($(this).find('.'+className));
    }
}