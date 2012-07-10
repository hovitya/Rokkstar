/**
 * Abstract base class for form input elements
 * @augments core.SkinnableComponent
 * @borrows core.behaviours.FormItemBehaviour#_refreshLabel
 * @borrows core.behaviours.FormItemBehaviour#doValidation
 * @borrows core.behaviours.FormItemBehaviour#validate
 * @borrows core.behaviours.FormItemBehaviour#formItemCreateAttributes
 * @borrows core.behaviours.FormItemBehaviour#formItemInit
 * @borrows core.behaviours.FormItemBehaviour#labelNode
 * @constructor
 */
core.abstract.FormItem=function(){
    extend(this,'core.SkinnableComponent','core.FormItem');
    behaveAs(this,'core.behaviours.FormItemBehaviour');

    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.formItemCreateAttributes();
    }

    this.init=function(){
        this.callSuper('init');
        this.formItemInit();
        this.createEventListener('disabledPropertyChanged',this.invalidateSkinState,this);
    }


    this.getSkinState=function(){
        if(this.getDisabled()){
            return 'disabled';
        }else{
            return 'normal';
        }
    }
}