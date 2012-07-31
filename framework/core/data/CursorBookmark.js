core.data.CursorBookmark=Rokkstar.createClass('core.data.CursorBookmark',undefined,function(){
    this.pos=-1;
    this.construct=function(pos){
        this.pos=pos;
    }
});

core.data.CursorBookmark.FIRST=-1;
core.data.CursorBookmark.LAST=-2;
core.data.CursorBookmark.BEFORE_FIRST=-3;
core.data.CursorBookmark.AFTER_LAST=-4;