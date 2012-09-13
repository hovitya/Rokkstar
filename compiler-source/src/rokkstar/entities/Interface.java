package rokkstar.entities;

import helpers.FileReference;

import java.util.ArrayList;

public class Interface implements IPackageItem {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2365065920956107475L;
	public String name;
	
	public Interface(String name,String payload){
		this.name=name;
		this.payload=payload;
	}
	
	public ArrayList<Interface> superInterfaces = new ArrayList<Interface>();
	public ArrayList<Function> functions = new ArrayList<Function>();
	public String getName(){
		return this.name;
	}
	
	public String payload;
	
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
