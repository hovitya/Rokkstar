core.data.AbstractStore=Rokkstar.createClass('core.data.AbstractStore','core.data.ArrayCollection',function(){

    /**
     * @type {core.data.IList}
     */
    this.dataProvider=null;

    this.init=function(){
        this.callSuper('init');
    }

    this.attachDataProvider=function(dataProvider){
        dataProvider.createEventListener
    }

    /**
     *
     * @return {core.data.Model}
     * @private
     */
    this._readModel=function(){
        return this.getModel();
    }


    this.readProperty=function(object,property){
        return object[property];
    }

},[new Attr('model',undefined,'core.data.Model')]);