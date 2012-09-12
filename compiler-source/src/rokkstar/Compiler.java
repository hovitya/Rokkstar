package rokkstar;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.GnuParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.OptionBuilder;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import rokkstar.entities.IPackageItem;
import rokkstar.entities.Library;
import rokkstar.exceptions.JSDocException;
import rokkstar.exceptions.ParameterException;
import rokkstar.resources.FileResource;

public class Compiler {
	
	public String sdkDir;
	
	public void createLibrary(String source, String target, Boolean includeSource) throws IOException, JSDocException, JSONException{
        FileOutputStream dest = new 
                FileOutputStream(target);
        ZipOutputStream out = new ZipOutputStream(new 
                BufferedOutputStream(dest));
        File sourceDir = new File(source);
        //Copy metadata
        File metaDir = new File(source + File.separator + "_meta");
        if (metaDir.exists() && metaDir.isDirectory()) {
        	this.writeDirToZip(metaDir, out, "_meta");
        }
        
        if (includeSource) {
        	this.writeDirToZip(sourceDir, out, "src");
        }
        
        Library lib = this.compileLibrary(source);
        out.putNextEntry(new ZipEntry("payload"));
        ObjectOutputStream objout = new ObjectOutputStream(out);
        objout.writeObject(lib);
        out.closeEntry();
        //Execute jsdoc
        out.putNextEntry(new ZipEntry("jsdoc.json"));
        out.write(this.runJSDoc(source).getBytes());
        out.closeEntry();
        out.close();
	}
	
	public String runJSDoc(String path) throws IOException, JSDocException{
		String line;
		String returnValue="";
		String errorValue="";
		OutputStream stdin = null;
	    InputStream stderr = null;
	    InputStream stdout = null;
	    
	    String jsdoc=this.sdkDir+File.separator+"third-party-bin"+File.separator+"jsdoc3";
	    String jar=jsdoc+File.separator+"lib"+File.separator+"js.jar";
	    String urlPath="file:/"+jsdoc.replaceAll("\\\\","/");
	    String args = "\""+path+"\" --template \"templates/rokkstar\" --destination \"console\" --recurse";
	    line=" -classpath \""+jar+"\" org.mozilla.javascript.tools.shell.Main -modules \""+urlPath+"/nodejs_modules\"  -modules \""+urlPath+"/rhino_modules\"  -modules \""+urlPath+"/rhino_modules\" -modules \""+urlPath+"\" \""+jsdoc+"/jsdoc.js\" "+args+" --dirname=\""+jsdoc+"/\"";

		Process process = Runtime.getRuntime().exec ("java"+line);
	    stdin = process.getOutputStream ();
	    stderr = process.getErrorStream ();
	    stdout = process.getInputStream ();
	    System.out.println(line);
	    //stdin.write(line.getBytes() );
	    //stdin.flush();
	    //stdin.close();
	 // clean up if any output in stdout
	      BufferedReader brCleanUp =
	        new BufferedReader (new InputStreamReader(stdout));
	      while ((line = brCleanUp.readLine ()) != null) {
	    	  returnValue+=line;
	      }
	      brCleanUp.close();

	      // clean up if any output in stderr
	      Boolean errorPrinted = false;
	      brCleanUp =
	        new BufferedReader (new InputStreamReader (stderr));
	      while ((line = brCleanUp.readLine ()) != null) {
	        errorValue+=line+"\n";
	        errorPrinted=true;
	      }
	      if(errorPrinted){
	    	  throw new JSDocException(errorValue);
	      }
	      brCleanUp.close();
	      return returnValue;
	    
	}
	
	private void writeDirToZip(File dir, ZipOutputStream zip, String prefix) throws IOException{
		byte[] buffer = new byte[1024];
		for (File child : dir.listFiles()) {
			if (".".equals(child.getName()) || "..".equals(child.getName())  || "_meta".equals(child.getName())) {
				continue;  // Ignore the self and parent aliases.
			}
			if (child.isDirectory()){
				this.writeDirToZip(child, zip, prefix + File.separator + child.getName());
			}else{
				FileInputStream fin = new FileInputStream(child);
				zip.putNextEntry(new ZipEntry(prefix + File.separator + child.getName()));
                int length;
                
                while((length = fin.read(buffer)) > 0)
                {
                   zip.write(buffer, 0, length);
                }
                zip.closeEntry();
                zip.flush();
                fin.close();
			}

		}
	}
	
	public JSONObject classDefinitions;
	
	private Library compileLibrary(String source, Library sourceLibrary) throws IOException, JSDocException, JSONException{
		JSONObject obj = new JSONObject(this.runJSDoc(source));
		this.classDefinitions=obj.getJSONObject("classes");
		File sourceDir=new File(source);
		IPackageItem item = FileResource.factory(sourceDir,true).toEntity();
		if(item instanceof Package){
			sourceLibrary.merge((rokkstar.entities.Package) item);
		}else{
			sourceLibrary.addItem(item);
		}
		
		return sourceLibrary;
	}
	
	private Library compileLibrary(String source) throws IOException, JSDocException, JSONException{
		return this.compileLibrary(source, new Library());
	}
	
	private static Compiler instance;
	
	public static Compiler getInstance(){
		if(Compiler.instance==null) Compiler.instance = new Compiler();
		return Compiler.instance;
	}
	
	/**
	 * @param args
	 * @throws Exception 
	 */
	@SuppressWarnings("static-access")
	public static void main(String[] args) throws Exception {
		Options options = new Options();
		Option comp = OptionBuilder.create("compile");
		Option deb = OptionBuilder.create("debug");
		Option pack = OptionBuilder.create("library");
		Option src = OptionBuilder.create("includeSource");
		Option help = OptionBuilder.create("help");
		Option sdk = OptionBuilder.withArgName( "dir" )
				.hasArg()
				.withDescription(  "sdk source dir (dir)" )
				.create( "sdk" );
		Option target = OptionBuilder.withArgName( "file" )
				.hasArg()
				.withDescription(  "compiler output (file or dir)" )
				.create( "target" );
		Option source = OptionBuilder.withArgName( "file" )
				.hasArg()
				.withDescription(  "compiler output (rokk file or dir)" )
				.create( "source" );
		options.addOption(comp);
		options.addOption(deb);
		options.addOption(pack);
		options.addOption(src);
		options.addOption(help);
		options.addOption(source);
		options.addOption(target);
		options.addOption(sdk);
		CommandLineParser parser = new GnuParser();
		Compiler compiler = Compiler.getInstance();
		try {
			CommandLine line = parser.parse(options, args);
			if(!line.hasOption("compile") && !line.hasOption("debug") && !line.hasOption("library")){
				//No action specified
				HelpFormatter formatter = new HelpFormatter();
				formatter.printHelp( "rokk", options );
			}else{
				if(line.hasOption("library") && !line.hasOption("compile") && !line.hasOption("debug")){
					//Creating library
					if(!line.hasOption("target") ){
						throw new ParameterException("Error: Parameter is missing: 'target'");
					}
					if(!line.hasOption("source") ){
						throw new ParameterException("Error: Parameter is missing: 'source'");
					}
					if(!line.hasOption("sdk") ){
						throw new ParameterException("Error: Parameter is missing: 'sdk'");
					}
					compiler.sdkDir=line.getOptionValue("sdk");
					compiler.createLibrary(line.getOptionValue("source"), line.getOptionValue("target"),line.hasOption("includeSource"));
				}
			}
		}catch(ParameterException e){
			System.out.println("Error: "+e.getMessage());
		} catch (ParseException e) {
			System.out.println("Error: "+e.getMessage());
			
		}catch (JSDocException e) {
			System.out.println("JSDoc Error: "+e.getMessage());
			
		}finally{
			System.out.println("Compilation complete.");
		}

	}

}
