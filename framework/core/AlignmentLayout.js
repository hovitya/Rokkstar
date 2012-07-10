/**
 * @augments core.Layout
 * @constructor
 */
core.AlignmentLayout=function(){
    extend(this,'core.Layout');

    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.createAttribute('horizontalAlign','left');
        this.createAttribute('verticalAlign','top');
    }

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('horizontalAlignPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('verticalAlignPropertyChanged',this.selfRefreshLayout,this);
    }

    this.init=function(){

        this.createAttribute('gap',0);
        this.callSuper('init');
        this.createEventListener('gapPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('verticalAlignPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('horizontalAlignPropertyChanged',this.selfRefreshLayout,this);
    }

}