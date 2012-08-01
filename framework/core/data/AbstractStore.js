core.data.AbstractStore=Rokkstar.createClass('core.data.AbstractStore','core.data.ArrayCollection',function(){



    /**
     *
     * @return {core.data.Model}
     * @private
     */
    this._readModel=function(){
        return this.getModel();
    }


    this._readProperty=function(object,property){

    }

},[new Attr('model',undefined,'core.data.Model'),new Attr('format','json','string')]);