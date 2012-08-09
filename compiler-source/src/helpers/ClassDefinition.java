package helpers;
import java.util.Vector;


public class ClassDefinition {
	public String className="";
	public Vector<Attribute> attributes=new Vector<Attribute>();
	public ClassDefinition inheritsFrom=null;
	
	/**
	 * Translate common namespace to real namespace
	 * @param ns Common namespace
	 * @param className Affected class name
	 * @return actual namespace
	 */
	static public String translateNamespace(String ns,String className){
		if(RokkstarPreferences.getInstance().packageMaps.containsKey(ns)){
			//This name assigned to a package map
			PackageMapHandler map=RokkstarPreferences.getInstance().packageMaps.get(ns);
			if(map.packageMap.containsKey(className)){
				//Map is assign a namespace to this class
				return map.packageMap.get(className);
			}else{
				//Use default namespace
				return map.defaultNS;
			}
		}else{
			//Check is it an internally reserved namespace
			if(ns.equals("http://www.imagix-interactive/2012/Rokkstar/graphics")){
				return "core.graphics";
			}else if(ns.equals("http://www.imagix-interactive/2012/Rokkstar/events")){
				return ClassDefinition.eventNS;
			}else if(ns.equals("http://www.imagix-interactive/2012/Rokkstar")){
				return ClassDefinition.rokkstarNS;
			}
			return ns;
		}
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
	static public String eventNS="http://www.imagix-interactive/2012/Rokkstar/events";
	static public String rokkstarNS="http://www.imagix-interactive/2012/Rokkstar";
}
