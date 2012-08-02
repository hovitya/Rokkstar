core.data._entities={};
core.data.IDGenerator={
    currentModelId:0,
    generateModelId:function(){
        this.currentModelId++;
        return "core.data._entities.Entity"+ this.currentModelId.toString();
    },
    currentEntityId:0,
    generateEntityId:function(){
        return this.currentEntityId++;
    }
};