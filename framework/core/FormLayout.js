/**
 * @augments core.Layout
 * @constructor
 */
core.FormLayout=function(){
    extend(this,'core.Layout','core.FormLayout');

    this.createAttributes=function(){
        this.callSuper('createAttributes');
        this.createAttribute('labelPosition','left','string');
        this.createAttribute('gap',5,'integer');
        this.createAttribute('labelPaddingLeft',5,'integer');
        this.createAttribute('labelPaddingRight',5,'integer');
        this.createAttribute('elementPaddingLeft',5,'integer');
        this.createAttribute('elementPaddingRight',5,'integer');
        this.createAttribute('elementPosition','left','string');
    }


    this.init=function(){
        this.callSuper('init');
        this.createEventListener('labelPositionPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('gapPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('labelPaddingLeftPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('labelPaddingRightPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('elementPaddingLeftPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('elementPaddingRightPropertyChanged',this.selfRefreshLayout,this);
        this.createEventListener('elementPositionPropertyChanged',this.selfRefreshLayout,this);
    }

    /**
     * @type {Number}
     */
    this.maxLabelWidth=0;

    /**
     * @override
     * @param {core.VisualContainer} div
     */
    this.doLayout=function(div){
        this.callSuper('doLayout',div);
        $(div.domElement).find('.core_FormLabel').remove();
        //Process labels
        this.maxLabelWidth=0;
        var labels=[];
        for(var i=0;i<div.getElementsNum();i++){
            var label=document.createElement('label');
            $(div.domElement).append(label);
            labels.push(label);
            label.className="core_FormLabel";
            $(label).css({position:'absolute',width:'auto',height:'auto'});
            if(div.getElementAt(i).getLabel!=undefined){
                label.innerHTML=div.getElementAt(i).getLabel();
                div.getElementAt(i).labelNode=label;
            }
            var labelWidth=$(label).width();
            if(labelWidth>this.maxLabelWidth){
                this.maxLabelWidth=labelWidth;
            }
            this.maxLabelWidth=this.maxLabelWidth+this.getLabelPaddingLeft()+this.getLabelPaddingRight();
        }

        //Process elements
        var currentTop=parseInt(this.getPaddingTop());
        var elementWidth=div.measuredWidth-this.maxLabelWidth;
        for(var i=0;i<div.getElementsNum();i++){
            //Fix label position
            $(labels[i]).css({top:currentTop+"px"});
            if(this.getLabelPosition()=='center'){
                var position=this.maxLabelWidth;
                position=Math.round((position-$(labels[i]).width())/2);
                $(labels[i]).css({left:position+"px"});
            }else if(this.getLabelPosition()=='left'){
                $(labels[i]).css({left:this.getLabelPaddingLeft()+"px"});
            }else if(this.getLabelPosition()=='right'){
                var position=this.maxLabelWidth;
                position=Math.round(position-this.getLabelPaddingRight()-$(labels[i]).width());
                $(labels[i]).css({left:position+"px"});
            }
            //Create and position element
            var comp=div.getElementAt(i);
            var el=div.getElementAt(i).domElement;
            $(el).css({position:'absolute',top:currentTop+"px"});
            $(el).css({width:this.stringToPixel(comp.getWidth(),div.measuredWidth,parseFloat(this.getElementPaddingLeft())+this.maxLabelWidth,this.getElementPaddingRight()),height:this.stringToPixel(comp.getHeight(),div.measuredHeight,0,0)});
            comp.measure();
            if(this.getElementPosition()=='left'){
                $(el).css({left:(this.maxLabelWidth+this.getElementPaddingLeft())+"px"});
            }else if(this.getElementPosition()=='center'){
                var position=elementWidth;
                position=Math.round((position-$(el).width())/2);
                $(el).css({left:position+"px"});
            }else{
                $(el).css({right:this.getElementPaddingRight()+"px"});
            }

            currentTop=currentTop+Math.max($(labels[i]).height(),comp.measuredHeight)+this.getGap();

        }
    }
}
