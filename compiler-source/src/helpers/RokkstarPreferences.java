package helpers;
import java.io.Console;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;




public class RokkstarPreferences {
	
	private static RokkstarPreferences _instance=null;

	public Map<String,PackageMapHandler> packageMaps=new HashMap<String,PackageMapHandler>();

	private RokkstarPreferences(){
		File dir=new File("config"+File.separator+"packageMaps");
		//Load package map files
		for (File xmlFile : dir.listFiles()) {
			if (".".equals(xmlFile.getName()) || "..".equals(xmlFile.getName())) {
				continue;  // Ignore the self and parent aliases.
			}
			if (!xmlFile.isDirectory()){
				//Parsing package map
					try{
					PackageMapHandler handler=new PackageMapHandler();
					handler.fileName=xmlFile.getPath();
					XMLReader xr = XMLReaderFactory.createXMLReader();
					xr.setContentHandler(handler);
					FileReader r = new FileReader(xmlFile);
					xr.parse(new InputSource(r));
					
					r.close();
					packageMaps.put(handler.namespace, handler);
				}catch(SAXException ex){
					RokkstarOutput.WriteError(ex.getMessage(), new FileReference(xmlFile.getPath(), 0));
				}catch(FileNotFoundException ex){
					RokkstarOutput.WriteError(ex.getMessage(), new FileReference(xmlFile.getPath(), 0));
				}catch(IOException ex){
					RokkstarOutput.WriteError(ex.getMessage(), new FileReference(xmlFile.getPath(), 0));
				}
			}
		}
		System.out.println(this.packageMaps.toString());
	}

	public static RokkstarPreferences getInstance(){
		if(_instance==null){
			_instance=new RokkstarPreferences();
		}
		return _instance;
	}

}
