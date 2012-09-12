package rokkstar.entities;

import helpers.FileReference;

import java.util.ArrayList;

public class Type implements IPackageItem{
	/**
	 * 
	 */
	private static final long serialVersionUID = -3017313130102801846L;
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
	
	private FileReference source;
	@Override
	public void setSource(FileReference file) {
		this.source = file;
		
	}
	@Override
	public FileReference getSource() {
		return this.source;
	}
	
}