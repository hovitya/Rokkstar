package rokkstar.entities;

import helpers.FileReference;

import java.io.IOException;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import exceptions.CompilerException;

import rokkstar.ICopyHandler;
import rokkstar.Output;
import rokkstar.Tools;

public class Package implements IPackageItem, Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 3392282214806861097L;
	public HashMap<String, IPackageItem> items = new HashMap<String, IPackageItem>();
	public String name;
	public Package(){
		
	}
	
	public Package(String name, String packageName){
		this.name=name;
		this.packageName=packageName;
	}
	
	public String getName(){
		return this.name;
	}
	
	public void addItem(IPackageItem item){
		if(!this.items.containsKey(item.getName())){
			this.items.put(item.getName(), item);
		}else if(item instanceof Package && this.items.get(item.getName()) instanceof Package){
			Package src = (Package) this.items.get(item.getName());
			src.merge((Package) item);
		}else{
			Output.WriteError("Class or interface already defined at " + this.items.get(item.getName()).getSource().toString() , item.getSource());
		}
	}
	
	public void merge(Package pack){
		Iterator<Map.Entry<String,IPackageItem>> it = pack.items.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry<String,IPackageItem> pairs = it.next();
			this.addItem((IPackageItem) pairs.getValue());
		}
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
	
	public String packageName;
	
	public IPackageItem lookUpItem(String qualifiedName){
		String itemName = Tools.substringBeforeFirst(qualifiedName, ".");
		if(!items.containsKey(itemName)){
			return null;
		}
		IPackageItem item = items.get(itemName); 
		if(qualifiedName.contains(".")){
			if(!(item instanceof Package)){
				return null;
			}
			return ((Package) item).lookUpItem(Tools.substringAfterFirst(qualifiedName, "."));
		}
		return item;
	}
	
	
	public String parse(Library lib) throws CompilerException{
		String returnValue="";
		Iterator<Map.Entry<String,IPackageItem>> it = this.items.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry<String,IPackageItem> pairs = it.next();
			IPackageItem item = (IPackageItem) pairs.getValue();
			returnValue+=item.parse(lib);
		}
		if(returnValue.equals("")){
			return "";
		}else{
			if(this.packageName==null || this.packageName.equals("")) return this.name+"={};\n"+returnValue;
			return  this.packageName+"."+this.name+"={};\n"+returnValue;
		}
		
	}
	
	public void copy(ICopyHandler handler) throws IOException {
		Iterator<Map.Entry<String,IPackageItem>> it = this.items.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry<String,IPackageItem> pairs = it.next();
			IPackageItem item = (IPackageItem) pairs.getValue();
			item.copy(handler);
		}
	}

}
