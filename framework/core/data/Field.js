core.data.Field=Rokkstar.createClass('core.data.Field','core.Component',function(){
    this.getPropertyName=function(){
        if(this.propertyName==undefined) return this.getName();
        return this.propertyName;
    }

    this.init=function(){
        this.callSuper('init');
        this.createEventListener('factoryClassPropertyChanged',this.invalidateFactory,this);
    }

    this.invalidateFactory=function(){
        this.factory=undefined;
    }

    this.getFactory=function(){
        if(this.factory) return this.factory;
        if(this.factoryClass){
            this.factory=new this.factoryClass;
            return this.factory;
        }
        return undefined;
    }


},[new Attr('name','','string'),new Attr('propertyName',undefined,'string'),new Attr('type','string','string'),new Attr('isArray',false,'boolean'),new Attr('isModel',false,'boolean'),new Attr('factoryClass',undefined,'string'),new Attr('factory',undefined,'core.IFactory')]);