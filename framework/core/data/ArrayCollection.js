/**
 * @class
 * @name ArrayCollection
 * @package core.data
 */
core.data.ArrayCollection=Rokkstar.createClass('core.data.ArrayCollection','core.Component',function(){

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('sourcePropertyChanged',this.refresh,this);
        this.createEventListener('sortPropertyChanged',this.refresh,this);
        this.createEventListener('filterPropertyChanged',this.refresh,this);
    }

    this.construct=function(source){
        this.callSuper('construct');
        if(source!=undefined){
            this.setSource(source);
        }
    }

    this.createCursor=function(){

    }

    this.view=[];

    this.refresh=function(){
        this.view=[];
        var source=this.getSource();
        for(var i in source){
            if(this.filter==undefined || this.filter.apply(this,[source[i]])){
                this.view.push(source[i]);
            }
        }
        if(this.sort!=undefined){
            this.view.sort(this.sort);
        }
        this.triggerEvent($.Event('collectionChanged',{}));
    }

    this.contains=function(value){
        return (this.view.indexOf(value)!=-1);
    }

    this.length=function(){
        return this.view.length;
    }



},[new Attr('source',[],'array'),new Attr('sort',undefined,'function'),new Attr('filter',undefined,'function')],[],['core.data.ICollectionView']);