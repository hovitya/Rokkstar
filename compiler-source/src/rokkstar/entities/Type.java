package rokkstar.entities;

import java.util.ArrayList;

public class Type implements IPackageItem{
	public String name;
	public Type superType;
	public ArrayList<Interface> implementedInterfaces = new ArrayList<Interface>();
	public ArrayList<Function> functions = new ArrayList<Function>();
	
	public Type(){
		
	}
	
	public Type(String name) {
		this.name = name;
	}
	
	public String getName(){
		return this.name;
	}
	
}
