package rokkstar.entities;

import helpers.FileReference;

import java.util.ArrayList;

import rokkstar.ICopyHandler;

public class Interface implements IPackageItem, IClassLike{
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
	
	public String parse(){
		return this.payload;
	}
	
	@Override
	public void copy(ICopyHandler handler) {
		// Do nothing
	}
	@Override
	public void addFunction(Function func) {
		this.functions.add(func);
		
	}
	@Override
	public ArrayList<Function> getFunctions() {
		return this.functions;
	}
	
	
}
