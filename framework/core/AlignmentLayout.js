/**
 * @augments core.Layout
 * @constructor
 */
core.AlignmentLayout=Rokkstar.createClass('core.AlignmentLayout','core.Layout',function(){

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('horizontalAlignPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('verticalAlignPropertyChanged',this.selfRefreshLayout,this);
    }

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('gapPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('verticalAlignPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('horizontalAlignPropertyChanged',this.selfRefreshLayout,this);
    }

},[new Attr('horizontalAlign','left'),new Attr('verticalAlign','top'),new Attr('gap',0)]);