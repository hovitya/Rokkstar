package rokkstar.entities;

import java.util.ArrayList;

public class Function {
	public String name;
	public ArrayList<Parameter> parameters = new ArrayList<Parameter>();
	public ArrayList<String> returnType;
	public String returnTypeDescription;
	public String scope = "public";
	public Boolean isStatic = false;
	public String description;
	public String payload;
	
	public Function(String name, ArrayList<Parameter> parameters,
			ArrayList<String> returnType,String returnTypeDescription,String scope, Boolean isStatic,String description) {
		super();
		this.name = name;
		this.parameters = parameters;
		this.returnType = returnType;
		this.returnTypeDescription=returnTypeDescription;
		this.scope=scope;
		this.isStatic = isStatic;
		this.description = description;
	}
	
}