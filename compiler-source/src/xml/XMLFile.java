package xml;
import helpers.ClassDefinition;
import helpers.FileReference;
import helpers.RokkstarOutput;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;


import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;



public class XMLFile {
	
	protected File xmlFile;
	
	public ClassDefinition definition;
	public XMLHandler handler=new XMLHandler();
	
	public XMLFile(File file){
		xmlFile=file;
		handler.fileName=xmlFile.getPath();
		
	}
	
	public void analyze(){
		try{
			XMLReader xr = XMLReaderFactory.createXMLReader();
			xr.setContentHandler(this.handler);
			FileReader r = new FileReader(xmlFile);
			xr.parse(new InputSource(r));
		}catch(SAXException ex){
			RokkstarOutput.WriteError(ex.getMessage(), new FileReference(xmlFile.getPath(), 0));
		}catch(FileNotFoundException ex){
			RokkstarOutput.WriteError(ex.getMessage(), new FileReference(xmlFile.getPath(), 0));
		}catch(IOException ex){
			RokkstarOutput.WriteError(ex.getMessage(), new FileReference(xmlFile.getPath(), 0));
		}
		
	}
}