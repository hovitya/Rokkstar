package rokkstar.entities;

import java.io.Serializable;
import java.util.ArrayList;

import rokkstar.Tools;


public class Property implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -7681119293204080890L;
	public String name;
	public Boolean isStatic;
	public String valueType = "null";
	public String defaultValue;
	public ArrayList<String> type;
	public String description;
	public String access;
	public Boolean notNull = false;
	public Boolean bindable = false;
	

	public Property(String name, Boolean isStatic, String defaultValue, ArrayList<String> type,String access, String description, String valueType, Boolean notNull,Boolean bindable) {
		super();
		this.name = name;
		this.isStatic = isStatic;
		this.defaultValue = defaultValue;
		this.type = type;
		this.description = description;
		this.access = access;
		this.valueType = valueType;
		this.bindable = bindable;
		this.notNull = notNull;
	}
	
	protected String getValue(){
		if(valueType.equals("null")) return "null";
		if(valueType.equals("array")) return "[]";
		if(valueType.equals("object")) return "{}";
		if(valueType.equals("string")) return "\"" + this.defaultValue + "\"";
		return this.defaultValue;
	}
	
	protected String createGetter(){
		String ret = "function() { if(this.___" + this.name + " === undefined) {return this.___"+this.name+" = " + this.getValue() + ";} else { return this.___" + this.name + "; } }";
		return ret;
	}
	
	protected String createSetter(){
		String ret = "function(val) { \n";
		if(this.notNull){
			ret += "if(val === null || val === undefined) throw new Error(\"Property '"+this.name+"' cannot be set to null or undefined.\");\n";
		}
		if(this.type.size()>0 && this.type.indexOf("*")==-1 && this.type.indexOf("")==-1){
			ArrayList<String> checks = new ArrayList<String>();
			for (int i = 0; i < type.size(); i++) {
				checks.add("!val.instanceOf("+this.type.get(i)+")");
			}
			ret += "if(val !== null && " + Tools.implode(checks.toArray(), " && ") + ") { throw new Error(\"Cannot assign\"+val.toString()+\" to property '" + this.name + "' which accepts following types: {"+Tools.implode(this.type.toArray(), "|")+"}.\"); }\n";
		}
		
		ret += "var oldVal = this.___"+this.name+";\nthis.___"+this.name+" = val;\n";
		
		if(this.bindable){
			ret += "this.trigger(new core.events.PropertyChangeEvent(\""+this.name+"PropertyChanged\",oldVal,val,\""+this.name+"\"));\n";
		}
		ret += "}";
		return ret;
	}
	
	public String getParsedValue(){
		return "{configurable: false, enumerable: false, get: "+this.createGetter()+", set: "+this.createSetter()+" }";
	}

	
}
