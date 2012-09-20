package rokkstar.entities;

import helpers.FileReference;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import rokkstar.ICopyHandler;
import rokkstar.Output;

public class Package implements IPackageItem{
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
	
	
	public String parse(){
		String returnValue="";
		Iterator<Map.Entry<String,IPackageItem>> it = this.items.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry<String,IPackageItem> pairs = it.next();
			IPackageItem item = (IPackageItem) pairs.getValue();
			returnValue+=item.parse();
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
