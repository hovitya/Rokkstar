package xml;

import helpers.ClassDefinition;
import helpers.FileReference;
import helpers.RokkstarOutput;

import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.xml.sax.Attributes;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class XMLCodeGenerator  extends DefaultHandler{
	protected String scriptSection="";
	protected String declarationSection="";
	protected String propertySetSection="";
	protected String attributesSection="";
	protected String className="";
	protected String superClassName="";
	protected Vector<String> idS=new Vector<String>();
	protected Vector<String> mode=new Vector<String>();
	protected Vector<String> currentAttr=new Vector<String>();
	protected int currentId=0;
	public Boolean errorOccured=false;
	protected int elementLevel=0;
	protected Locator locator=null;
	public String fileName="";
	public String generatedCode="";
	protected String bindings="";
	
	
	public void endDocument() throws SAXException {
		generatedCode="".concat(className+" = Rokkstar.createClass('"+className+"','"+superClassName+"',function(){"+scriptSection+"\nthis._buildDOM=function(){\nthis.callSuper('_buildDOM');\n"+declarationSection+"\n"+propertySetSection+"\n"+bindings+"\n};"+"});\n\n");
    }
	
	public void startElement(String uri, String localName,
	        String qName, Attributes attributes)
	    throws SAXException {
		FileReference fRef=new FileReference(this.fileName, locator.getLineNumber());
		String ns=ClassDefinition.translateNamespace(uri,localName);

		
		if(!ClassDefinition.isPromotedNS(ns) && elementLevel==0){
			idS.add("this");
			mode.add("component");
			this.superClassName=ns+"."+localName;
			//Attributes
			for (int i = 0; i < attributes.getLength(); i++) {
				if(attributes.getURI(i).equalsIgnoreCase(ClassDefinition.eventNS)){
					this.propertySetSection=this.propertySetSection.concat("this.createEventListener('"+attributes.getLocalName(i)+"',function(event){"+attributes.getValue(i)+"},this);\n");
				}else{
					if(attributes.getLocalName(i).lastIndexOf('.')!=-1){
						String state=attributes.getLocalName(i).substring(attributes.getLocalName(i).lastIndexOf('.')+1);
						String property=attributes.getLocalName(i).substring(0,attributes.getLocalName(i).lastIndexOf('.'));
						this.propertySetSection=this.propertySetSection.concat("this.states['"+state+"'].addProperty(this,'"+property+"',"+this.parseValue(attributes.getValue(i),property,"id")+");\n");
					}else{
						this.propertySetSection=this.propertySetSection.concat("this.set('"+attributes.getLocalName(i)+"',"+this.parseValue(attributes.getValue(i),attributes.getLocalName(i),"this")+");\n");	
					}
					
				}
				
			}
		}else if(!ClassDefinition.isPromotedNS(ns)){
			String id;
			Boolean customId=false;
			//Component
			if(attributes.getIndex("id")==-1){
				id=this.requestId();
			}else{
				id=attributes.getValue("id");
				customId=true;
			}
			
			this.createComponent(ns+"."+localName, id,customId);
			//Attributes
			for (int i = 0; i < attributes.getLength(); i++) {
				if(attributes.getURI(i).equalsIgnoreCase(ClassDefinition.eventNS)){
					this.propertySetSection=this.propertySetSection.concat(id+".createEventListener('"+attributes.getLocalName(i)+"',function(event){"+attributes.getValue(i)+"},this);\n");
				}else{
					if(attributes.getLocalName(i).lastIndexOf('.')!=-1){
						String state=attributes.getLocalName(i).substring(attributes.getLocalName(i).lastIndexOf('.')+1);
						String property=attributes.getLocalName(i).substring(0,attributes.getLocalName(i).lastIndexOf('.'));
						this.propertySetSection=this.propertySetSection.concat("this.states['"+state+"'].addProperty("+id+",'"+property+"',"+this.parseValue(attributes.getValue(i),property,id)+");\n");
					}else{
						this.propertySetSection=this.propertySetSection.concat(id+".set('"+attributes.getLocalName(i)+"',"+this.parseValue(attributes.getValue(i),attributes.getLocalName(i),id)+");\n");	
					}
					
				}
				
			}
			
			if(mode.get(mode.size()-1)=="component"){
				this.declarationSection=this.declarationSection.concat(idS.get(idS.size()-1)+".addElement("+id+");\n");
			}else if(mode.get(mode.size()-1)=="attribute"){
				String pref="";
				if(this.currentAttr.get(this.currentAttr.size()-1).length()!=0) pref=",";
				this.currentAttr.set(this.currentAttr.size()-1,this.currentAttr.get(this.currentAttr.size()-1).concat(pref+id));
			}else if(mode.get(mode.size()-1)=="states"){
				this.declarationSection=declarationSection.concat("this.states['"+attributes.getValue("name")+"']="+id+";\n");
			}else if(mode.get(mode.size()-1)=="transitions"){
				this.declarationSection=declarationSection.concat("this.transitions.push("+id+");\n");
			}
			this.idS.add(id);
			this.mode.add("component");
		}else if(ClassDefinition.rokkstarNS.equals(ns)){
			if(ClassDefinition.isPromotedAttr(localName)){
				//Promoted attribute
				mode.add(localName);
			}else{
				//Attribute
				mode.add("attribute");
				currentAttr.add("");
			}
			
			
		}else{
			RokkstarOutput.WriteError("This namespace does not contains any component.", fRef);
			errorOccured=true;
		}
		
		elementLevel++;
	}
	
	protected String parseValue(String value,String property,String id){
		FileReference fRef=new FileReference(this.fileName, locator.getLineNumber());
		if(value.startsWith("{") && value.endsWith("}")){
			try{
			//Create binding
			/*String[] parts=value.substring(1, value.length()-1).split("\\.");
			String chain="[";
			for (int i = 1; i < parts.length; i++) {
				if(chain.length()!=1){
					chain+=",";
				}
				chain+=parts[i];
			}
			chain+="]";
			
			bindings+="core.Binding.bindProperty(this,'"+property+"',"+parts[0]+","+chain+");\n";
			return value.substring(1, value.length()-1); */
			String hosts="[";
			JSONArray chains=new JSONArray();
			String expression=value.substring(1, value.length()-1);
			Pattern pattern = Pattern.compile("([',\"]{0,1}[a-zA-Z_][a-zA-Z0-9_]*(?:\\.[a-zA-Z_][a-zA-Z0-9_]*)+)[',\"]{0,1}");
			Matcher m = pattern.matcher(value.substring(1, value.length()-1));
			int i=0;
			
			while (m.find()) {
				
			    String s = m.group(1);
			    if(!s.startsWith("'") && !s.startsWith("\"")){
				    String[] parts=s.split("\\.");
				    if(hosts.length()!=1){
				    	hosts+=",";
				    }
				    hosts+=parts[0];
				    JSONArray chain=new JSONArray();
					for (int j = 1; j < parts.length; j++) {
						chain.put(parts[j]);
					}
					chains.put(chain);
				    expression=expression.replaceAll(Pattern.quote(s), "__watch_results["+i+"]");
				    i++;
			    }
			}
			hosts+="]";
			try{
				return "core.Binding.bindExpression("+id+",'"+property+"',"+hosts+","+chains.toString(0)+",'"+expression.replace("'", "\\'")+"')"; 
			}catch(JSONException ex){
				RokkstarOutput.WriteError("Unable to parse "+property+" property value.", fRef);
			}
			
			}catch(Exception ex){
				RokkstarOutput.WriteError("Unable to parse "+property+" property value.", fRef);
			}
			return "undefined";
		}else{
			return '"'+value+'"';
		}
	}
	
	protected void createComponent(String className,String tempId,Boolean customId){
		this.declarationSection=this.declarationSection.concat("var "+tempId+" = new "+className+"();\n");
		if(customId){
			this.declarationSection=this.declarationSection.concat("this."+tempId+" = "+tempId+";\n");
		}
	}
	
	public void endElement(String uri, String localName, String qName)
		    throws SAXException {
		  String m=mode.lastElement();
		  mode.remove(mode.size()-1);
		  if(m.equals("component")){
			  idS.remove(idS.size()-1);
		  }else if(m.equals("attribute")){
			  String attrData=currentAttr.lastElement();
			  if(attrData.contains(",")) attrData="["+attrData+"]";
			  if(localName.lastIndexOf('.')==-1){
				  this.propertySetSection=this.propertySetSection.concat(idS.lastElement()+".set('"+localName+"',"+attrData+");\n");
			  }else{
					String state=localName.substring(localName.lastIndexOf('.')+1);
					String property=localName.substring(0,localName.lastIndexOf('.'));
					this.propertySetSection=this.propertySetSection.concat("this.states['"+state+"'].addProperty("+idS.lastElement()+",'"+property+"',"+attrData+");\n");
			  }
			  
			  currentAttr.remove(currentAttr.size()-1);
		  }
		  elementLevel--;
	}

	public void characters(char ch[], int start, int length)
		    throws SAXException {
		String str=new String(ch, start, length);
		str=str.trim();
		if(str.length()>0){
			FileReference fRef=new FileReference(this.fileName, locator.getLineNumber());
			if(mode.lastElement().equals("attribute")){
				this.currentAttr.set(this.currentAttr.size()-1, '"'+str+'"');
			}else if(mode.lastElement().equals("script")){
				this.scriptSection=this.scriptSection.concat(str);
			}else{
				RokkstarOutput.WriteError("Only attributes can contain text "+mode.lastElement()+": "+str, fRef);
				errorOccured=true;
			}
		}
			
	}
	
	protected String requestId(){
		return "c".concat(Integer.toString(currentId++));
	}
	
	public void setDocumentLocator(Locator locator){
		this.locator=locator;
	}
}
