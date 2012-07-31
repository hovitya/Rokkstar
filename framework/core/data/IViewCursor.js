/**
 * @interface
 * @name IViewCursor
 * @package core.data
 * @trigger cursorUpdated
 */
core.data.IViewCursor={
    isAfterLast:function(){},
    isBeforeFirst:function(){},

    findAny:function(values){},

    findFirst:function(values){},

    findLast:function(values){},

    insert:function(data){},

    remove:function(){},

    moveNext:function(){},

    movePrevious:function(){},

    current:function(){},

    /**
     * Create bookmark to the current position
     *
     * @returns core.data.CursorBookmark
     */
    getBookmark:function(){

    },

    /**
     * Set current position
     *
     * @param {CursorBookmark} bookmark
     */
    seek:function(bookmark){

    }
};