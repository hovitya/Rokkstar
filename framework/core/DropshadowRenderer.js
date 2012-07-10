core.DropshadowRenderer=function(){
    extend(this,'core.FilterRenderer');

    this.color='#000000';
    this.textureSafe=false;
    this.dx=4;
    this.dy=4;
    this.alpha=0.5;
    this.applyNum=1;
    this.shadowOperation="destination-in";
    this.rate=5;
    this.render=function(){
        var ctx = this.canvas.getContext("2d");
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        ctx.fillStyle=this.color;
        //ctx.globalAlpha=this.alpha;
        ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        //
        //if(!this.textureSafe){
        ctx.globalCompositeOperation=this.shadowOperation;
        //}else{
        //	ctx.globalCompositeOperation='xor';
        //}

        ctx.drawImage(this.currentComp.canvas,this.dx,this.dy);
        ctx.globalCompositeOperation=="source-over";
        stackBlurCanvasRGBA( this.canvas, 0, 0, this.canvas.width, this.canvas.height, this.rate );
        for(var i=0;i<this.applyNum;i++)
        {
            this.apply();
        }
        //ctx.globalAlpha=1.0;
    }


}
