core.exceptions.Exception=function(message,code){
    this.type="core.exceptions.Exception";
    this.message=message;
    this.code=code;
    this.toString=function(){
        return this.type+": "+this.message;
    }
}