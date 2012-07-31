core.exceptions.Exception=Rokkstar.createClass('core.exceptions.Exception',undefined,function(){
    this.type="core.exceptions.Exception";
    this.message=message;
    this.code=code;
    this.toString=function(){
        return this.type+": "+this.message;
    }
});