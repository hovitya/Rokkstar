package xml;

import helpers.Attribute;
import helpers.ClassDefinition;
import helpers.FileReference;
import helpers.RequestedClass;
import helpers.RokkstarOutput;

import java.util.Vector;

import org.xml.sax.*;
import org.xml.sax.helpers.*;


public class XMLAnalizer extends DefaultHandler {
	public Vector<String> namespaces=new Vector<String>();
	public RequestedClass inheritsFrom=null;
	public Vector<RequestedClass> requestedClasses=new Vector<RequestedClass>();
	public Vector<Attribute> attributes=new Vector<Attribute>();
	public String fileName="";
	public Boolean errorOccured=false;
	protected Locator locator=null;
	protected int elementLevel=0;
	protected Vector<RequestedClass> currentComponent=new Vector<RequestedClass>();
	
	public void startElement(String nsURI, String localName, String tagName, Attributes attributes) throws SAXException {
		FileReference fRef=new FileReference(this.fileName, locator.getLineNumber());
		String ns=ClassDefinition.translateNamespace(nsURI,localName);
		if(!ClassDefinition.isPromotedNS(nsURI)){
			/*
			 * Process component 
			 */
			if(namespaces.indexOf(ns)==-1) namespaces.add(ns);
			RequestedClass rc=new RequestedClass();
			rc.className=ns+"."+localName;
			rc.firstReference=fRef;	
			requestedClasses.add(rc);
			currentComponent.add(rc);
			if(elementLevel==0) this.inheritsFrom=rc;
			//Parsing attributes
			for(int i=0;i<attributes.getLength();i++){
				if(attributes.getURI(i).equals("")){
					
					for (Attribute attr : requestedClasses.lastElement().attributes) {
						if(attr.name.equals(attributes.getLocalName(i))){
							RokkstarOutput.WriteError("Attribute "+attributes.getLocalName(i)+" already defined at line "+attr.fileReference.line, fRef);
							errorOccured=true;
						}
					}
					Attribute attr=new Attribute(attributes.getLocalName(i), fRef);
					rc.attributes.add(attr);
				}
			}
		}else if(ns.equals(ClassDefinition.rokkstarNS)){
			if(!ClassDefinition.isPromotedAttr(localName)){
				/*
				 * Process attribute
				 */
				for (Attribute attr : requestedClasses.lastElement().attributes) {
					if(attr.name.equals(localName)){
						RokkstarOutput.WriteError("Attribute "+localName+" already defined at line "+attr.fileReference.line, fRef);
						errorOccured=true;
					}
				}
				Attribute attr=new Attribute(localName, fRef);
				requestedClasses.lastElement().attributes.add(attr);	
			}else{
				/*
				 * Process promoted attribute
				 */
				if(currentComponent.size()!=1){
					RokkstarOutput.WriteError("Promoted tag only allowed in root element: "+localName, fRef);
					this.errorOccured=true;
				}
			}
		}else{
			RokkstarOutput.WriteError("Event namespace does not contains elements.", fRef);
			this.errorOccured=true;
		}
		elementLevel++;
	}
	
	public void endElement(String nsURI, String localName, String tagName) throws SAXException {
		if(!ClassDefinition.isPromotedNS(nsURI)){
			currentComponent.remove(currentComponent.size()-1);
		}
		elementLevel--;
	}
	
	public void processingInstruction(String target, String data)
			throws SAXException {
		FileReference fRef=new FileReference(this.fileName, locator.getLineNumber());
		if(target.equals("Attribute")){
			String[] params=data.split("\\s+");
			if(params.length==2){
				this.attributes.add(new Attribute(params[0], fRef));
			}
		}
		
	}
	


	public void setDocumentLocator(Locator locator){
		this.locator=locator;
	}

}
