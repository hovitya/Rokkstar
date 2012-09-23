package rokkstar.entities;

import java.io.Serializable;
import java.util.ArrayList;

public class Function implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -8005253605402030631L;
	public String name;
	public ArrayList<Parameter> parameters = new ArrayList<Parameter>();
	public ArrayList<String> returnType;
	public String returnTypeDescription;
	public String scope = "public";
	public Boolean isStatic = false;
	public String description;
	public String payload;
	public String payloadBody;
	public Function overrideParent;
	public String originalOwner;
	public Boolean isOverride;
	
	public Function(String name, ArrayList<Parameter> parameters,
			ArrayList<String> returnType,String returnTypeDescription,String scope, Boolean isStatic,String description, Boolean isOverride) {
		super();
		this.name = name;
		this.parameters = parameters;
		this.returnType = returnType;
		this.returnTypeDescription=returnTypeDescription;
		this.scope=scope;
		this.isStatic = isStatic;
		this.description = description;
		this.isOverride = isOverride;
	}
	
	public Boolean checkCompatibility(Function func){
		if(func.parameters.size()!=this.parameters.size()) return false;
		for (int i = 0; i < this.parameters.size(); i++) {
			//Checking types
			Parameter param1 = this.parameters.get(i);
			Parameter param2 = func.parameters.get(i);
			if(param2.type.size()!=param1.type.size()) return false;
			for(int j = 0; j < param1.type.size(); j++){
				if(!param2.type.contains(param1.type.get(j))){
					return false;
				}
			}
		}
		return true;
	}
	
	public String getPayloadFor(String className){
		if(className.equals(this.originalOwner)){
			return this.payload;
		}else{
			return this.originalOwner+".prototype."+this.name;
		}
	}
	
}