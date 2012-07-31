/**
 *
 * @class
 * @name ArrayCollectionCursor
 * @package core.data
 */
core.data.ArrayCollectionCursor=Rokkstar.createClass('core.data.ArrayCollectionCursor','core.EventDispatcher',function(){
    /**
     *
     * @type {core.data.ArrayCollection}
     */
    this.collection=null;

    this.position=-1;

    this.isBeforeFirst=function(){
        return this.position<=-1;
    }

    this.isAfterLast=function(){
        return this.collection.view.length<=this.position;
    }

    this.moveNext=function(){
        this.position++;
        this.triggerEvent('cursorUpdated');
        return this.isAfterLast();
    }

    this.movePrevious=function(){
        this.position--;
        this.triggerEvent('cursorUpdated');
        return this.isBeforeFirst();
    }

    this.current=function(){
        if(this.isAfterLast() || this.isBeforeFirst()) throw new Error('Index is out of bounds.');
        return this.collection.view[this.position];
    }

    this.getBookmark=function(){
        return new core.data.CursorBookmark(this.position);
    }

    this.seek=function(bookmark){
        if(bookmark==core.data.CursorBookmark.BEFORE_FIRST){
            this.position=-1;
        }
        else if(bookmark==core.data.CursorBookmark.AFTER_LAST){
            this.position=this.collection.view.length;
        }else if(bookmark==core.data.CursorBookmark.FIRST){
            this.position=1;
        }else if(bookmark==core.data.CursorBookmark.LAST){
            this.position=this.collection.view.length-1;
        }else{
            this.position=bookmark.pos;
        }
        this.triggerEvent('cursorUpdated');
    }


},[],[],['core.data.IViewCursor']);