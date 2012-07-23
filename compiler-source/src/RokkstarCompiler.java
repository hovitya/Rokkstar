import helpers.FileReference;
import helpers.RokkstarOutput;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;

import static java.nio.file.StandardCopyOption.*;

import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.GnuParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.OptionBuilder;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;

import xml.XMLFile;

import exceptions.CompilerException;


public class RokkstarCompiler {


	public String targetDir=null;
	public String appClass="my.App";
	public String targetFile="app.js";
	public String outputMode="html";
	public String frameworkDir="framework";
	public String sdkDir="";
	public String sourceDir=null;
	public String skinDir="skins"+File.separator+"default";
	public String templateFile=null;
	protected String cssValue="";
	
	public RokkstarCompiler(CommandLine line) {
		if(line.hasOption("source")){
			this.sourceDir=line.getOptionValue("source");
		}
		
		if(line.hasOption("skin")){
			this.skinDir=line.getOptionValue("skin");
		}
		
		if(line.hasOption("sdk")){
			this.sdkDir=line.getOptionValue("sdk");
		}

		if(line.hasOption("output")){
			this.outputMode=line.getOptionValue("output");
		}
		
		if(line.hasOption("framework")){
			this.frameworkDir=line.getOptionValue("framework");
		}
		
		
		if(line.hasOption("target-file")){
			this.targetFile=line.getOptionValue("target-file");
		}
		
		if(line.hasOption("class")){
			this.appClass=line.getOptionValue("class");
		}



		if(line.hasOption("target")){
			this.targetDir=line.getOptionValue("target");
		}else{
			this.targetDir=this.sourceDir+File.separator+".."+File.separator+"web-debug";
		}

		if(line.hasOption("template")){
			this.templateFile=line.getOptionValue("template");
		}else{
			this.templateFile=this.sdkDir+File.separator+this.frameworkDir+File.separator+"html-template"+File.separator+"index.html";
		}

	}



	public void compile() throws CompilerException{
		try{
			//Create target directories
			this.createDirs(this.targetDir);
			
			
			FileWriter fw=new FileWriter(this.targetDir+File.separator+this.targetFile);
			
			//Compile third party scripts
			fw.write(this.processDir(new File(this.sdkDir+File.separator+"third-party"),""));
			
			//Compile framework root
			fw.write(this.compileJS(new File(this.sdkDir+File.separator+this.frameworkDir+File.separator+"rokkstar.js")));
			
			fw.write("\n/** @namespace  */ var core={};\n");
			
			//Compile framework files
			File dir = new File(this.sdkDir+File.separator+this.frameworkDir+File.separator+"core");
			fw.write(this.processDir(dir, "core."));	
			
			
			//Compile selected skin set
			fw.write("\n/** @namespace  */ core.skins={};\n");
			dir = new File(this.sdkDir+File.separator+this.frameworkDir+File.separator+this.skinDir);
			fw.write(this.processDir(dir, "core.skins."));	
			
			//Compile user files
			dir = new File(this.sourceDir);
			fw.write(this.processDir(dir, ""));
			fw.flush();
			fw.close();
			
			//Generate HTML
			this.generateHtml();
			
		}catch(IOException ex){
			System.err.println( "IO error: " + ex.getMessage() );
			throw new CompilerException();
		}
	}
	
	protected String processDir(File dir,String packageName) throws CompilerException{
		String output="";
		for (File child : dir.listFiles()) {
			if (".".equals(child.getName()) || "..".equals(child.getName())) {
				continue;  // Ignore the self and parent aliases.
			}
			if (child.isDirectory()){
				output=output.concat(this.compileDir(child,packageName));
			}else{
				String name=child.getName();
				int pos=name.lastIndexOf('.');
				String ext=name.substring(pos+1);
				ext=ext.toLowerCase();
				switch(ext){
				case "js":
					output=output.concat(this.compileJS(child));
					break;
				case "xml":
					output=output.concat(this.compileXML(child,packageName));
					break;
				default:
					this.cssValue+=this.compileAsset(child, packageName);
					break;
				}
	
			}
		}
		return output;
	}

	protected String compileDir(File dir,String packageName) throws CompilerException{
		String output;
		if(packageName.lastIndexOf('.')==-1){
			output="\n/** @namespace  */ var "+dir.getName()+"={};\n";
		}else{
			output="\n/** @namespace  */ "+packageName+dir.getName()+"={};\n";
		}
		if(dir.isDirectory()){
		for (File child : dir.listFiles()) {
			if (".".equals(child.getName()) || "..".equals(child.getName())) {
				continue;  // Ignore the self and parent aliases.
			}
			if (child.isDirectory()){
				output=output.concat(this.compileDir(child,packageName+dir.getName()+"."));
			}else{
				String name=child.getName();
				int pos=name.lastIndexOf('.');
				String ext=name.substring(pos+1);
				ext=ext.toLowerCase();
				switch(ext){
				case "js":
					output=output.concat(this.compileJS(child));
					break;
				case "xml":
					output=output.concat(this.compileXML(child,packageName));
					break;
				default:
					this.cssValue+=this.compileAsset(child, packageName+dir.getName());
					break;
				}

			}

		}
		}else{
			System.err.println(dir.getPath()+" is not a directory.");
			throw new CompilerException();
		}
		return output;
	}

	protected String compileJS(File file) throws CompilerException{
		StringBuilder  stringBuilder = new StringBuilder();
		try{
			BufferedReader reader = new BufferedReader( new FileReader (file));
			String         line = null;
			
			String         ls = System.getProperty("line.separator");
	
	
				while( ( line = reader.readLine() ) != null ) {
					stringBuilder.append( line );
					stringBuilder.append( ls );
				}
	
			
			reader.close();
			
		}catch(FileNotFoundException ex){
			System.err.println("File not found: "+file.getPath());
			throw new CompilerException();
		}catch(IOException ex){
			System.err.println("File not readable: "+file.getPath());
			throw new CompilerException();
		}
		return stringBuilder.toString();
	}

	protected String compileXML(File file,String packageName) throws CompilerException{
		XMLFile xFile=new XMLFile(file);
		xFile.analyze();
		try{
			ByteArrayOutputStream baos=new ByteArrayOutputStream();
			javax.xml.transform.Source xmlSource =
					new javax.xml.transform.stream.StreamSource(file);
			javax.xml.transform.Source xsltSource =
					new javax.xml.transform.stream.StreamSource(getClass().getResourceAsStream("rokkstarXML.xsl"));
			javax.xml.transform.Result result =
					new javax.xml.transform.stream.StreamResult(baos);
			
			javax.xml.transform.TransformerFactory transFact =
					javax.xml.transform.TransformerFactory.newInstance(  );
	
			javax.xml.transform.Transformer trans =
					transFact.newTransformer(xsltSource);
	
			trans.transform(xmlSource, result);
			return baos.toString("UTF-8").replaceAll("\\{\\{instance_name\\}\\}", packageName+file.getName().replaceAll(".(xml|XML)", ""));
		}catch(TransformerConfigurationException ex){
			System.err.println("Invalid transformer configuration: "+file.getPath());
			throw new CompilerException();
		}catch(TransformerException ex){
			System.err.println("XML compilation error in file: "+file.getPath()+" Error: "+ex.getMessage());
			throw new CompilerException();
		}catch(UnsupportedEncodingException ex){
			System.err.println("UTF-8 encoding not supported.");
		}
		throw new CompilerException();
		
	}
	
	protected String implode(String[] parts,String glue){
		String AsImplodedString;
		if (parts.length==0) {
		    AsImplodedString = "";
		} else {
		    StringBuffer sb = new StringBuffer();
		    sb.append(parts[0]);
		    for (int i=1;i<parts.length;i++) {
		        sb.append(glue);
		        sb.append(parts[i]);
		    }
		    AsImplodedString = sb.toString();
		}
		return AsImplodedString;
		
	}
	
	
	
	protected String compileAsset(File file,String packageName) throws CompilerException{
		try{
		String[] parts=packageName.split("\\.");
		String AsImplodedString=this.implode(parts, File.separator);
		
		
		this.createDirs(this.targetDir+File.separator+AsImplodedString);
	    File inputFile = file;
	    File outputFile = new File(this.targetDir+File.separator+AsImplodedString+File.separator+file.getName());

	    Files.copy(inputFile.toPath(), outputFile.toPath(), REPLACE_EXISTING);
		//Include CSS
	    String name=file.getName();
		int pos=name.lastIndexOf('.');
		String ext=name.substring(pos+1);
		ext=ext.toLowerCase();
		if(ext.equals("css")){
			String relativePath=this.implode(parts, "/");
			return "\n@import url('"+relativePath+"/"+file.getName()+"');\n";
		}
		
		}catch(IOException ex){
			System.err.println("IO error: "+file.getAbsolutePath());
			throw new CompilerException();
		}
		return "";
	}
	
	public void generateHtml() throws CompilerException{
		File file=new File(this.templateFile);
		StringBuilder  stringBuilder = new StringBuilder();
		try{
			BufferedReader reader = new BufferedReader( new FileReader (file));
			String         line = null;
			
			String         ls = System.getProperty("line.separator");
	
	
				while( ( line = reader.readLine() ) != null ) {
					stringBuilder.append( line );
					stringBuilder.append( ls );
				}
	
			
			reader.close();
			

		String template=stringBuilder.toString();
		template=template.replaceAll("\\{\\{app_file\\}\\}", this.targetFile);
		template=template.replaceAll("\\{\\{app_class\\}\\}", this.appClass);
		template=template.replaceAll("\\{\\{css_import\\}\\}", this.cssValue);
		FileWriter fw=new FileWriter(this.targetDir+File.separator+file.getName());
		fw.write(template);
		fw.flush();
		fw.close();
		
		}catch(FileNotFoundException ex){
			System.err.println("File not found: "+file.getPath());
			throw new CompilerException();
		}catch(IOException ex){
			System.err.println("File not readable: "+file.getPath());
			throw new CompilerException();
		}
	}
	
	public void createDirs(String dir) {

		// create the file pointer
		File file = new File(dir);

		// check if directory already exists or not
		if (file.exists()) {
			//System.out.println("Directory : " + dir + " already exists");
		} else {

			// create the non existent directory if any
			// It returns a boolean indicating whether the operation
			// was successful of not
			boolean retval = file.mkdirs();

			// evaluate the result
			if (retval) {
				//System.out.println("Directory : " + dir
				//		+ " created succesfully");
			} else {
				//System.out.println("Directory : " + dir + " creation failed");
				RokkstarOutput.WriteError("Directory : " + dir + " creation failed", new FileReference("",0));
			}
		}

	}


	/**
	 * @param args
	 */
	@SuppressWarnings("static-access")
	public static void main(String[] args) {
		//Creating command line options
		Options options = new Options();

		Option source = OptionBuilder.withArgName( "dir" )
				.hasArg()
				.withDescription(  "path for source files" )
				.create( "source" );
		Option skin = OptionBuilder.withArgName( "dir" )
				.hasArg()
				.withDescription(  "path for default skin (relative to SDK directory)" )
				.create( "skin" );
		Option target = OptionBuilder.withArgName( "file" )
				.hasArg()
				.withDescription(  "write output into the given file" )
				.create( "target" );
		Option cls = OptionBuilder.withArgName( "class" )
				.hasArg()
				.withDescription(  "main application class" )
				.create( "class" );
		Option output = OptionBuilder.withArgName( "file" )
				.hasArg()
				.withDescription(  "set template file" )
				.create( "template" );
		
		Option framework = OptionBuilder.withArgName( "dir" )
				.hasArg()
				.withDescription(  "framework directory (relative to SDK directory)" )
				.create( "framework" );
		Option sdk = OptionBuilder.withArgName( "dir" )
				.hasArg()
				.withDescription(  "SDK directory" )
				.create( "sdk" );


		options.addOption(source);
		options.addOption(target);
		options.addOption(output);
		options.addOption(framework);
		options.addOption(skin);
		options.addOption(sdk);
		options.addOption(cls);
		CommandLineParser parser = new GnuParser();
		try {
			// parse the command line arguments
			CommandLine line = parser.parse( options, args );
			if(line.hasOption("source")){
				RokkstarCompiler compiler=new RokkstarCompiler(line);
				compiler.compile();
				System.out.println( "Compilation complete." );
			}else{
				HelpFormatter formatter = new HelpFormatter();
				formatter.printHelp( "rokkstar", options );
			}
		}
		catch( ParseException exp ) {
			// oops, something went wrong
			System.err.println( "Command line attribute parsing failed.  Reason: " + exp.getMessage() );
		}catch( CompilerException exp ) {
			// oops, something went wrong
			System.err.println( "Compilation failed." );
		}


	}

}
