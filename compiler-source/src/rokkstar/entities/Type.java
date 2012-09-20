package rokkstar.entities;

import helpers.FileReference;

import java.util.ArrayList;

import rokkstar.ICopyHandler;

public class Type implements IPackageItem, IClassLike{
	/**
	 * 
	 */
	private static final long serialVersionUID = -3017313130102801846L;
	public String name;
	public String superType;
	public ArrayList<String> implementedInterfaces = new ArrayList<String>();
	public ArrayList<Function> functions = new ArrayList<Function>();
	public String description;
	public Function construct;
	public String access;
	
	public Type(){
		
	}
	
	public Type(String name, String payload,String packageName,String superType,String description,String access) {
		this.name = name;
		this.payload = payload;
		this.packageName=packageName;
		this.superType = superType;
		this.description = description;
		this.access = access;
		
	}
	
	public void addInterface(String interf){
		this.implementedInterfaces.add(interf);
	}
	
	public String getName(){
		return this.name;
	}
	
	public String payload;
	
	public String packageName;
	
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
		String superName="undefined";
		if(this.superType!=null){
			superName=this.superType;
		}
		String pack = "";
		if(this.packageName!="" && this.packageName!=null){
			pack=this.packageName+".";
		}
		
		return pack+this.getName()+"=Rokkstar.createClass('"+pack+this.getName()+"',"+superName+","+this.payload.substring(this.payload.indexOf('=')+1,this.payload.lastIndexOf(';'))+");";
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
