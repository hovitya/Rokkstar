package rokkstar.entities;

import java.util.ArrayList;

import rokkstar.entities.javascript.Void;

public class Function {
	public String name;
	public ArrayList<Parameter> parameters = new ArrayList<Parameter>();
	public Type returnType;
	public String scope = "public";
	public Boolean isStatic = false;
	public String description;
	
	public Function(String name, ArrayList<Parameter> parameters,
			Type returnType) {
		super();
		this.name = name;
		this.parameters = parameters;
		this.returnType = returnType;
	}
	
	public Function(String name, ArrayList<Parameter> parameters) {
		super();
		this.name = name;
		this.parameters = parameters;
		this.returnType = Void.getInstance();
	}
}