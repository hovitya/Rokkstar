package helpers;
import java.util.Vector;


public class ClassDefinition {
	public String className="";
	public Vector<String> attributes=new Vector<String>();
	public ClassDefinition inheritsFrom=null;
	
	static public String translateNamespace(String ns){
		if(ns.equals("http://www.imagix-interactive/2012/Rokkstar/components")){
			return "core";
		}else if(ns.equals("http://www.imagix-interactive/2012/Rokkstar/graphics")){
			return "core.graphics";
		}else if(ns.equals("http://www.imagix-interactive/2012/Rokkstar/events")){
			return ClassDefinition.eventNS;
		}else if(ns.equals("http://www.imagix-interactive/2012/Rokkstar")){
			return ClassDefinition.rokkstarNS;
		}
		return ns;
	}
	
	static public Boolean isPromotedNS(String ns){
		if(ns.equals("http://www.imagix-interactive/2012/Rokkstar/events")){
			return true;
		}else if(ns.equals("http://www.imagix-interactive/2012/Rokkstar")){
			return true;
		}
		return false;
	}
	
	static public boolean isPromotedAttr(String attr){
		if(attr.equals(ClassDefinition.scriptAttr) || attr.equals(ClassDefinition.definitionsAttr) || attr.equals(ClassDefinition.statesAttr) || attr.equals(ClassDefinition.transitionsAttr)) return true;
		else return false;
	}
	
	//Promoted attributes
	static public String scriptAttr="script";
	static public String definitionsAttr="definitions";
	static public String statesAttr="states";
	static public String transitionsAttr="transitions";
	
	//Promoted namespaces
	static public String eventNS="[event]";
	static public String rokkstarNS="[rokkstar]";
}
