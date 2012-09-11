package rokkstar.entities;

import rokkstar.entities.javascript.Any;

public class Parameter {
	public String name;
	public Boolean required;
	public String defaultValue;
	public Type type;
	public String description;
	
	public Parameter(String name, Boolean required, String defaultValue, Type type) {
		super();
		this.name = name;
		this.required = required;
		this.defaultValue = defaultValue;
		this.type = type;
	}
	
	public Parameter(String name, Boolean required, String defaultValue) {
		super();
		this.name = name;
		this.required = required;
		this.defaultValue = defaultValue;
		this.type = Any.getInstance();
	}
	
}
