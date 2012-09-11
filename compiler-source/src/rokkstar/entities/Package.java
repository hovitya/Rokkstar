package rokkstar.entities;

import helpers.FileReference;

import java.util.HashMap;
import java.util.Iterator;

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
	
	public Package(String name){
		this.name=name;
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
		Iterator it = pack.items.entrySet().iterator();
		while (it.hasNext()) {
			this.addItem((IPackageItem) it.next());
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
}
