/**
 * @class
 * @name ArrayCollection
 * @package core.data
 */
core.data.ArrayCollection=Rokkstar.createClass('core.data.ArrayCollection','core.Component',function(){

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('sourcePropertyChanged',this._refresh,this);
        this.createEventListener('sortPropertyChanged',this._refresh,this);
        this.createEventListener('filterPropertyChanged',this._refresh,this);
    }

    this.construct=function(source){
        this.callSuper('construct');
        if(source!=undefined){
            this.setSource(source);
        } else{
            this.setSource([]);
        }
    }

    this.createCursor=function(){
        return new core.data.ArrayCollectionCursor(this);
    }

    this.view=[];

    this.refresh=function(){
        this._refresh(undefined);
    }

    /**
     *
     * @param {core.events.PropertyChangeEvent} event
     */
    this._refresh=function(event){
        this.view=[];
        var source=this.getSource();
        for(var i in source){
            if(this.filter==undefined || this.filter.apply(this,[source[i]])){
                this.view.push(source[i]);
            }
        }
        if(this.sort!=undefined){
            console.log('Sort');
            this.view.sort(this.sort);
        }
        if(event==undefined || event.propertyName=='source'){
            this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged','reset'));
        }else{
            this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged','refresh'));
        }

    }

    this.contains=function(value){
        return (this.view.indexOf(value)!=-1);
    }

    this.length=function(){
        return this.view.length;
    }

    this.addItem=function(item){
        var source=this.getSource();
        if(this.view.indexOf(item)==-1){
            //Add new item
            source.push(item);
            this.view.push(item);
            this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged','add',this.view.length-1,-1,[item]));
        }else{
            //Moves item to end
            var oldIndex=this.view.indexOf(item);
            source.splice(source.indexOf(item),1);
            source.push(item);
            this.view.splice(oldIndex,1);
            this.view.push(item);
            this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged','move',this.view.length-1,oldIndex,[item]));
        }

    }

    this._checkIndex=function(index){
        if(index<0 || index>=this.length()){
            throw new RangeError('Index out of bounds.');
        }

    }

    this.addItemAt=function(item,index){
        this._checkIndex(index);
        var source=this.getSource();
        if(this.view.indexOf(item)==-1){
            source.splice(source.indexOf(this.view[index]),0,item);
            this.view.splice(index,0,item);
            this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged','add',index,-1,[item]));
        }else{
            source.splice(source.indexOf(item),1);
            source.splice(source.indexOf(this.view[index]),0,item);
            var oldIndex=this.view.indexOf(item);
            this.view.splice(oldIndex,1);
            this.view.splice(index,0,item);
            this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged','move',index,oldIndex,[item]));
        }
    }

    this.removeItemAt=function(index){
        this._checkIndex(index);
        var source=this.getSource();
        var item=this.view[index];
        source.splice(source.indexOf(item),1);
        this.view.splice(index,1);
        this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged','remove',index,-1,[item]));
    }

    this.getItemAt=function(index){
        this._checkIndex(index);
        return this.view[index];
    }

    this.getItemIndex=function(item){
        return this.view.indexOf(item);
    }

    this.removesAll=function(){
        this.setSource([]);
    }

    this.setItemAt=function(index,item){
        this._checkIndex(index);
        var oldItem=this.view[index];
        var source=this.getSource();
        source.splice(source.indexOf(oldItem),1,item);
        this.view.splice(index,1,item);
        this.triggerEvent(new core.data.events.CollectionEvent('collectionChanged','replace',index,-1,[oldItem,item]));
    }

    this.toArray=function(){
        var array=[];
        for(var i in this.view){
            array.push(this.view[i]);
        }
        return array;
    }



},[new Attr('source',[],'array'),new Attr('sort',undefined,'function'),new Attr('filter',undefined,'function')],[],['core.data.ICollectionView','core.data.IList']);