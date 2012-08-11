core.data._generatedClasses={};
core.data.IDGenerator={
    currentModelId:0,
    generateModelId:function(){
        this.currentModelId++;
        return "Entity"+ this.currentModelId.toString();
    },
    currentEntityId:0,
    generateEntityId:function(){
        return this.currentEntityId++;
    }
};