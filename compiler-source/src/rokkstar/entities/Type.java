package rokkstar.entities;

import helpers.FileReference;
import helpers.RokkstarOutput;

import java.io.Serializable;
import java.util.ArrayList;

import exceptions.CompilerException;

import rokkstar.ICopyHandler;
import rokkstar.Output;
import rokkstar.Tools;

public class Type implements IPackageItem, IClassLike, Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -3017313130102801846L;
	public String name;
	public String superType;
	public ArrayList<String> implementedInterfaces = new ArrayList<String>();
	public ArrayList<Function> functions = new ArrayList<Function>();
	protected ArrayList<Property> properties = new ArrayList<Property>();
	public String description;
	public Function construct;
	public String access;
	protected Boolean parsed = false;
	
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
	
	protected Type parsedSuperType;
	public Type getSuperType(Library lib) throws CompilerException{
		if(parsedSuperType!=null) return parsedSuperType;
		if(this.superType!=null && this.superType!=""){
			IPackageItem superObj = lib.lookUpItem(this.superType);
			if(!(superObj instanceof Type)){
				Output.WriteError("Only classes can be extended. Component "+this.getQualifiedName()+" is trying to extend " + this.superType, this.source);
				throw new CompilerException();
			}
			return (Type) superObj;
		}
		return null;
	}
	
	@SuppressWarnings("unchecked")
	public ArrayList<String> collectDynamicTypeNames(Library lib) throws CompilerException{
		Type superObject = this.getSuperType(lib);
		ArrayList<String> ret;
		if(superObject==null){
			ret=new ArrayList<String>();
		}else{
			ret=(ArrayList<String>) superObject.collectDynamicTypeNames(lib).clone();
		}
		ret.add(this.getQualifiedName());
		//Add interfaces
		for (int i = 0; i < this.implementedInterfaces.size(); i++) {
			IPackageItem iface = lib.lookUpItem(this.implementedInterfaces.get(i));
			if(iface == null || !(iface instanceof Interface)) {
				Output.WriteError("Interface is not found: "+this.implementedInterfaces.get(i), this.getSource());
				throw new CompilerException();
			}else{
				ret.addAll(((Interface) iface).collectDynamicTypes(lib));
			}
		}
		return ret;
	}
	
	public String getQualifiedName() {
		if(this.packageName!=null && !this.packageName.equals("")) return this.packageName+"."+this.name;
		else return this.name;
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
	
	private ArrayList<Function> processedFunctions;
	
	@SuppressWarnings("unchecked")
	public ArrayList<Function> getFunctions(Library lib) throws CompilerException{
		if(this.processedFunctions!=null) return this.processedFunctions;
		ArrayList<Function> ret;
		if(this.superType!=null && this.superType!=""){
			IPackageItem superObj = lib.lookUpItem(this.superType);
			if(!(superObj instanceof Type)){
				Output.WriteError("Only classes can be extended. Class "+this.getQualifiedName() + " is trying to extend "+this.superType+".", this.source);
				throw new CompilerException();
			}
			ret = (ArrayList<Function>) ((Type) superObj).getFunctions(lib).clone();
		}else{
			ret = new ArrayList<Function>();
		}
		for (int i = 0; i < this.functions.size(); i++) {
			Function func = this.functions.get(i);
			int override = -1;
			for (int j = 0; j < ret.size(); j++) {
				if(ret.get(j).name.equals(func.name)){
					override = j;
				}
			}
			if(override!=-1){
				func.overrideParent=ret.get(override);
				ret.remove(override);
				if(!func.isOverride){
					Output.WriteWarning("Overriding a function ("+func.originalOwner+"#" + func.name + ") that is not marked for override.", this.source);
				}
				if(!func.overrideParent.checkCompatibility(func)){
					Output.WriteWarning("Incompatible override ("+func.originalOwner+"#" + func.name + ").", this.source);
				}
			}
			ret.add(func);
		}
		//Checking interfaces
		for (int i = 0; i < this.implementedInterfaces.size(); i++) {
			Interface iface = (Interface) lib.lookUpItem(this.implementedInterfaces.get(i));
			if(iface == null) {
				Output.WriteError("Interface is not found: "+this.implementedInterfaces.get(i), this.getSource());
				throw new CompilerException();
			}
			ArrayList<Function> ifunctions= iface.getFunctions(lib);
			for (int j = 0; j < ifunctions.size(); j++) {
				Boolean found = false;
				for (int j2 = 0; j2 < ret.size(); j2++) {
					if(ret.get(j2).name.equals(ifunctions.get(j).name)){
						found = true;
						if(!ret.get(j2).checkCompatibility(ifunctions.get(j))){
							Output.WriteWarning("Implemented function is not compatible with the one declared in the interface. " +
												this.getQualifiedName()+"#"+ret.get(j2).name+" is not compatible with "+iface.getQualifiedName()+"#"+ifunctions.get(j).name, this.source);
						}
					}
				}
				if(!found){
					Output.WriteError("Interface function is not implemented: "+iface.getQualifiedName()+"#"+ifunctions.get(j).name, this.source);
					throw new CompilerException();
				}
			}
		}
		this.processedFunctions = ret;
		
		return ret;
	}
	
	@SuppressWarnings("unchecked")
	public ArrayList <Property> getProperties(Library lib) throws CompilerException{
		Type superObj = this.getSuperType(lib);
		ArrayList<Property> prop;
		if(superObj==null){
			prop = new ArrayList<Property>();
		}else{
			prop=(ArrayList<Property>) superObj.getProperties(lib).clone();
		}
		
		for (int i = 0; i < this.properties.size(); i++) {
			int override = -1;
			
			Property property = this.properties.get(i);
		    for (int j = 0; j < prop.size(); j++) {
				if(prop.get(j).name.equals(property.name)){
					override = j;
				}
			}
		    
			if(override!=-1){
				Output.WriteWarning("Redefining inherited property " + prop.get(override).name + "in class " + this.getQualifiedName(), this.source);
				prop.remove(override);	
			}
			prop.add(property);
		}
		

		
		return prop;
	}
	
	public String parse(Library lib) throws CompilerException{
		if(this.parsed) return "";
		ArrayList<Function> funcs = this.getFunctions(lib);
		ArrayList<Property> props = this.getProperties(lib);
		
		String head = this.getQualifiedName() + " = function () {\n";
		String proto = this.getQualifiedName() + ".prototype = Object.create({},{\n";
		String stat = "";
		
		//Compiling properties
		for(int i = 0; i < props.size(); i++){
			if(props.get(i).isStatic){
				stat += "Object.defineProperty("+this.getQualifiedName() + ",\"" + props.get(i).name + "\", " + props.get(i).getParsedValue(lib) + ");\n"; 
			}else{
				head += "Object.defineProperty(this,\"" + props.get(i).name + "\", " + props.get(i).getParsedValue(lib) + ");\n"; 				
			}
		}
		
		
		//Compiling functions
		Boolean protomod = false;
		for (int i = 0; i < funcs.size(); i++) {
			if(funcs.get(i).name.equals(this.name) && this.functions.contains(funcs.get(i))){
				head += "("+funcs.get(i).payload+").apply(this,arguments);";
			}else if(!funcs.get(i).isStatic){
				if(protomod) proto += ",\n";
				protomod = true;
				proto += funcs.get(i).name+":{value: "+funcs.get(i).getPayloadFor(this.getQualifiedName(),lib)+",writable: false, enumerable: false, configurable: false}";
			}else{
				stat+= this.getQualifiedName() + "." + funcs.get(i).name + " = " + funcs.get(i).getPayloadFor(this.getQualifiedName(),lib) + ";\n";
			}
		}
		
		//Polymorphism
		if(protomod) proto += ",\n";
		proto += "__staticType:{value: \""+this.getQualifiedName()+"\",writable: false, enumerable: false, configurable: false},\n";
		proto += "__dynamicTypes:{value: [\""+Tools.implode(this.collectDynamicTypeNames(lib).toArray(), "\",\"")+"\"],writable: false, enumerable: false, configurable: false}\n";
		proto += "\n});";
		head += "};";
		this.parsed = true;
		Type superObj = this.getSuperType(lib);
		if(superObj == null){
			return head + "\n" + proto + "\n" + stat;
		}else{
			return superObj.parse(lib) + "\n" + head + "\n" + proto + "\n" + stat;
		}
		
		
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
	

	public void addProperty(Property p) {
		p.originalOwner = this.getQualifiedName();
		this.properties.add(p);
	}
	
	public ArrayList<Property> getProperties(){
		return this.properties;
	}

	@Override
	public Boolean hasFunction(String name, Library lib) throws CompilerException {
		ArrayList<Function> funcs = this.getFunctions(lib);
		for (int i = 0; i < funcs.size(); i++) {
			if(name.equals(funcs.get(i).name)) return true;
		}
		return false;
	}
	
}
