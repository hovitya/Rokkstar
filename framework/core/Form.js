/**
 * @augments core.SkinnableContainer
 * @borrows core.behaviours.FormItemBehaviour#_refreshLabel
 * @borrows core.behaviours.FormItemBehaviour#doValidation
 * @borrows core.behaviours.FormItemBehaviour#validate
 * @borrows core.behaviours.FormItemBehaviour#formItemCreateAttributes
 * @borrows core.behaviours.FormItemBehaviour#formItemInit
 * @borrows core.behaviours.FormItemBehaviour#labelNode
 * @constructor
 */
core.Form=function(){
    extend(this,'core.SkinnableContainer','core.Form');
    behaveAs(this,'core.behaviours.FormItemBehaviour');

    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.formItemCreateAttributes();
    }

    this.init=function(){
        this.callSuper('init');
        this.formItemInit();
    }

}