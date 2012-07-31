/**
 * @interface
 * @name ICollectionView
 * @package core.data
 */
core.data.ICollectionView={
    /**
     * @returns IViewCursor
     */
    createCursor:function(){},

    setFilter:function(filterFunction){},

    setSort:function(sortFunction){},

    length:function(){},

    refresh:function(){},

    contains:function(item){}
}