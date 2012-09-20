package rokkstar.entities;

import java.util.ArrayList;

public class Parameter {
	public String name;
	public Boolean required;
	public String defaultValue;
	public ArrayList<String> type;
	public String description;
	

	public Parameter(String name, Boolean required, String defaultValue,
			ArrayList<String> type, String description) {
		super();
		this.name = name;
		this.required = required;
		this.defaultValue = defaultValue;
		this.type = type;
		this.description = description;
	}
	
}
