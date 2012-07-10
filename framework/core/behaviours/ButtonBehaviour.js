/**
 * Button behaviour
 * This behaviour can be applied on core.VisualComponent based classes.
 * @constructor
 */
core.behaviours.ButtonBehaviour=function(){

    this.buttonCreateAttributes=function(){
        var upState=this.createComponent('core.State');
        upState.setStateName('up');
        var overState=this.createComponent('core.State');
        overState.setStateName('over');
        var downState=this.createComponent('core.State');
        downState.setStateName('down');
        this.states['up']=upState;
        this.states['over']=overState;
        this.states['down']=downState;
    }

    this.buttonInit=function(){
        this.createEventListener("mouseover",this.buttonMouseEnter,this);
        this.createEventListener("mouseout",this.buttonMouseLeave,this);
        this.createEventListener("blur",this.buttonMouseLeave,this);
        this.createEventListener("mouseup",this.buttonMouseUp,this);
        this.createEventListener("mousedown",this.buttonMouseDown,this);
        this.createEventListener("touchend",this.buttonMouseUp,this);
        this.createEventListener("touchstart",this.buttonMouseDown,this);
        this.createEventListener("keyup",this.buttonKeyUp,this);
        this.createEventListener("keydown",this.buttonKeyDown,this);
    }

    this.buttonMouseEnter=function(event){
        this.setCurrentState('over');
    }

    this.buttonMouseLeave=function(event){
        this.setCurrentState('up');
    }

    this.buttonMouseDown=function(event){
        this.setCurrentState('down');
    }

    this.buttonMouseUp=function(event){
        this.setCurrentState('over');
    }

    this.buttonKeyDown=function(event){
        var key = event.keyCode;
        if(key==32 || key==13){
            this.setCurrentState('down');
        }
    }

    this.buttonKeyUp=function(event){
        var key = event.keyCode;
        if(key==32 || key==13){
            this.setCurrentState('up');
        }
    }
}
