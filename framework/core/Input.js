/**
 * @augments core.abstract.FormItem
 * @constructor
 */
core.Input=function(){
    extend(this,'core.abstract.FormItem','core.Input');

    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.declareSkinPart('input',true,'core.InputBase');
    }

    this.init=function(){
        this.callSuper('init');
        this.setSkinClass('core.skins.InputSkin');
    }



}