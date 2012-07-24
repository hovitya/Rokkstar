package xml;
import helpers.ClassDefinition;
import helpers.FileReference;
import helpers.RequestedClass;
import helpers.RokkstarOutput;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Vector;


import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;



public class XMLFile {
	
	protected File xmlFile;
	
	public ClassDefinition definition;
	public XMLAnalizer handler=new XMLAnalizer();
	public XMLCodeGenerator codeGenerator=new XMLCodeGenerator();
	public Vector<RequestedClass> requiredClasses;
	public String superClassName;
	public String className="";
	
	public XMLFile(File file,String className){
		xmlFile=file;
		handler.fileName=xmlFile.getPath();
		this.className=className;
	}
	
	public void analyze(){
		try{
			XMLReader xr = XMLReaderFactory.createXMLReader();
			xr.setContentHandler(this.handler);
			FileReader r = new FileReader(xmlFile);
			xr.parse(new InputSource(r));
			this.requiredClasses=this.handler.requestedClasses;
			this.superClassName=this.handler.inheritsFrom.className;
			this.definition=new ClassDefinition();
			this.definition.className=this.className;
			this.definition.attributes=this.handler.attributes;
			this.codeGenerator.fileName=xmlFile.getPath();
			this.codeGenerator.className=this.className;
		}catch(SAXException ex){
			RokkstarOutput.WriteError(ex.getMessage(), new FileReference(xmlFile.getPath(), 0));
		}catch(FileNotFoundException ex){
			RokkstarOutput.WriteError(ex.getMessage(), new FileReference(xmlFile.getPath(), 0));
		}catch(IOException ex){
			RokkstarOutput.WriteError(ex.getMessage(), new FileReference(xmlFile.getPath(), 0));
		}
		
	}
	
	public String compile(){
		try{
			XMLReader xr = XMLReaderFactory.createXMLReader();
			xr.setContentHandler(this.codeGenerator);
			FileReader r = new FileReader(xmlFile);
			xr.parse(new InputSource(r));
		}catch(SAXException ex){
			RokkstarOutput.WriteError(ex.getMessage(), new FileReference(xmlFile.getPath(), 0));
		}catch(FileNotFoundException ex){
			RokkstarOutput.WriteError(ex.getMessage(), new FileReference(xmlFile.getPath(), 0));
		}catch(IOException ex){
			RokkstarOutput.WriteError(ex.getMessage(), new FileReference(xmlFile.getPath(), 0));
		}
		return codeGenerator.generatedCode;
	}
	
	
}
