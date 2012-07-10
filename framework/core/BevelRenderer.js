core.BevelRenderer=function(){
    extend(this,'core.FilterRenderer');
    this.length=2;
    this.highlightColor="#FFFFFF";
    this.shadowColor="#000000";
    this.applyOperation="source-atop";
    this.rate=5;
    this.alpha=0.5;
    this.applyNum=1;
    this.render=function(){

 
        //Create shadow
        var renderer=$('<div></div>');
        renderer.xComponent('init','core.InnerDropshadowRenderer');
        renderer.get(0).color=this.shadowColor;
        renderer.get(0).alpha=this.alpha;
        renderer.get(0).dx=-1*this.length;
        renderer.get(0).dy=-1*this.length;
        renderer.get(0).rate=this.rate;
        renderer.get(0).renderTo(this.currentComp);
        //caching data
        //this.canvas.getContext('2d').drawImage(renderer.get(0).canvas,this.length,this.length);*/

        //Create highlight
        var renderer=$('<div></div>');
        renderer.xComponent('init','core.InnerDropshadowRenderer');
        renderer.get(0).color=this.highlightColor;
        renderer.get(0).alpha=this.alpha;
        renderer.get(0).dx=this.length;
        renderer.get(0).dy=this.length;
        renderer.get(0).rate=this.rate;
        renderer.get(0).renderTo(this.currentComp);
        //caching data
        //this.canvas.getContext('2d').drawImage(renderer.get(0).canvas,-1*this.length,-1*this.length);

    }
}