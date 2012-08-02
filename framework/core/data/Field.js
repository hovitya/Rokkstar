core.data.Field=Rokkstar.createClass('core.data.Field','core.Component',function(){
    this.getPropertyName=function(){
        if(this.propertyName==undefined) return this.getName();
        return this.propertyName;
    }
},[new Attr('name','','string'),new Attr('propertyName',undefined,'string'),new Attr('type','string','string'),new Attr('isArray',false,'boolean'),new Attr('isModel',false,'boolean')]);