package rokkstar.entities;

import helpers.FileReference;

import java.util.ArrayList;

import exceptions.CompilerException;

import rokkstar.ICopyHandler;
import rokkstar.Output;

public class Interface implements IPackageItem, IClassLike{
	/**
	 * 
	 */
	private static final long serialVersionUID = -2365065920956107475L;
	public String name;
	public String packageName;
	
	public Interface(String name,String payload,String packageName){
		this.name=name;
		this.payload=payload;
		this.packageName = packageName;
	}
	
	public ArrayList<String> superInterfaces = new ArrayList<String>();
	public ArrayList<Function> functions = new ArrayList<Function>();
	public String getName(){
		return this.name;
	}
	
	public String payload;
	
	public ArrayList<String> collectDynamicTypes(Library lib) {
		ArrayList<String> ret = new ArrayList<String>();
		for (int i = 0; i < this.superInterfaces.size(); i++) {
			IPackageItem item = lib.lookUpItem(this.superInterfaces.get(i));
			if(item instanceof Interface){
				ret.addAll(((Interface) item).collectDynamicTypes(lib));
			}else{
				Output.WriteError("Interface can extend an another interface only. "+item.getName()+" is not an interface.", this.source);
			}
		}		
		ret.add(this.getQualifiedName());
		return ret;
		
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
	
	public String getQualifiedName() {
		if(this.packageName!=null && !this.packageName.equals("")) return this.packageName+"."+this.name;
		else return this.name;
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
		func.originalOwner = this.getQualifiedName();
		this.functions.add(func);
		
	}

	
	private ArrayList<Function> parsedFunctions;
	
	@Override
	public ArrayList<Function> getFunctions(Library lib) {
		if(parsedFunctions==null){
			ArrayList<Function> funcs = new ArrayList<Function>();
			for (int i = 0; i < superInterfaces.size(); i++) {
				IPackageItem iface = lib.lookUpItem(superInterfaces.get(i));
				if(!(iface instanceof Interface)){
					Output.WriteError("Interface can extend an another interface only. "+iface.getName()+" is not an interface.", this.source);
				}else{
				    ArrayList<Function> tmpFunctions = ((Interface) iface).getFunctions(lib);
				    for (int j = 0; j < tmpFunctions.size(); j++) {
					    Boolean collision = false;
						for (int j2 = 0; j2 < funcs.size(); j2++) {
							if(funcs.get(j2).name.equals(tmpFunctions.get(j).name)){
								if(!funcs.get(j2).checkCompatibility(tmpFunctions.get(j))){
									Output.WriteError("Name collision between incopatible interface functions: " +funcs.get(j2).originalOwner+"#"+funcs.get(j2).name + " and "+tmpFunctions.get(j).originalOwner+"#"+tmpFunctions.get(j).name , this.source);
									collision = true;
								}	
							}
						}
					    if(!collision){
					    	funcs.add(tmpFunctions.get(j));
					    }
					}

				}
			}
			for (int i = 0; i < this.functions.size(); i++) {
				Function thisFunc = this.functions.get(i);
				Boolean skip = false;
				for (int j = 0; j < funcs.size(); j++) {
					if(funcs.get(j).name.equals(thisFunc.name)){
						skip = true;
						if(!funcs.get(j).checkCompatibility(thisFunc)){
							Output.WriteError("Incopatible redeclaration of "+funcs.get(j).originalOwner+"#"+funcs.get(j).name , this.source);
						}
					}
				}
				if(!skip){
					funcs.add(thisFunc);
				}
			}
			
			this.parsedFunctions = funcs;
		}
		return this.parsedFunctions;
	}
	
	@Override
	public String parse(Library lib) throws CompilerException {
		return this.getQualifiedName()+" = Object.create({},{__staticType:{value:'"+this.getQualifiedName()+"',writable:false,enumerable:false,configurable:false}});\n";
	}

	@Override
	public Boolean hasFunction(String name, Library lib) {
		ArrayList<Function> funcs = this.getFunctions(lib);
		for (int i = 0; i < funcs.size(); i++) {
			if(name.equals(funcs.get(i).name)) return true;
		}
		return false;
	}
	
	
}