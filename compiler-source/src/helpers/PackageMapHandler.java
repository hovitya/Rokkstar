package helpers;

import java.util.HashMap;
import java.util.Map;

import org.xml.sax.Attributes;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class PackageMapHandler extends DefaultHandler {
	
	private Boolean nsMode=false;
	private Boolean cMode=false;
	private String currentNamespace="";
	public String namespace="";
	public String defaultNS="";
	public Map<String, String> packageMap=null;
	public String fileName="";
	public Boolean errorOccured=false;
	protected Locator locator=null;
	
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		if(localName.equals("package")){
			nsMode=false;
		}else if(localName.equals("component")){
			cMode=false;
		}
	}

	@Override
	public void characters(char[] arg0, int arg1, int arg2) throws SAXException {
		if(cMode){
			String str=new String(arg0, arg1, arg2);
			packageMap.put(str, currentNamespace);
		}
	}

	@Override
	public void startDocument() throws SAXException {
		packageMap=new HashMap<String, String>();
	}

	@Override
	public void startElement(String nsURI, String localName, String tagName, Attributes attributes) throws SAXException {
		FileReference fRef=new FileReference(this.fileName, locator.getLineNumber());
		if(localName.equals("package")){
			if(nsMode){
				RokkstarOutput.WriteError("Config file format error: Nested packages", fRef);
				errorOccured=true;
			}
			nsMode=true;
			currentNamespace=attributes.getValue("name");
		}else if(localName.equals("component")){
			if(!nsMode){
				RokkstarOutput.WriteError("Config file format error: Missing package definition", fRef);
				errorOccured=true;
			}
			cMode=true;
		}else if(localName.equals("packageMap")){
			namespace=attributes.getValue("namespace");
			defaultNS=attributes.getValue("default");
		}
	}
	
	public void setDocumentLocator(Locator locator){
		this.locator=locator;
	}
	
	
}
