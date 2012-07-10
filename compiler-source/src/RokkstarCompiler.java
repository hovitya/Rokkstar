import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

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


public class RokkstarCompiler {


	public String targetDir=null;
	public String targetFile="app.html";
	public String outputMode="html";
	public String frameworkDir="framework";
	public String sourceDir=null;
	public String skinDir="skins"+File.separator+"default";

	public RokkstarCompiler(CommandLine line) {
		if(line.hasOption("source")){
			this.sourceDir=line.getOptionValue("source");
		}
		
		if(line.hasOption("skin")){
			this.skinDir=line.getOptionValue("skin");
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


		if(line.hasOption("target")){
			this.targetDir=line.getOptionValue("target");
		}else{
			this.targetDir=this.sourceDir+File.separator+"web-debug";
		}


	}



	public void compile() throws CompilerException{
		try{
		FileWriter fw=new FileWriter(this.targetDir+File.separator+this.targetFile);
		//Compile framework
		File dir = new File(this.frameworkDir);
		fw.write(this.compileDir(dir, ""));
		
		//Compile user files
		dir = new File(this.sourceDir);
		fw.write(this.compileDir(dir, ""));
		fw.flush();
		fw.close();
		}catch(IOException ex){
			System.err.println( "IO error: " + ex.getMessage() );
		}
	}

	protected String compileDir(File dir,String packageName) throws CompilerException{
		String output;
		if(packageName.lastIndexOf('.')==-1){
			output="/** @namespace  */ "+dir.getName()+"={};\n";
		}else{
			output="/** @namespace  */ "+packageName+dir.getName()+"={};\n";
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
					output=output.concat(this.compileXML(child));
					break;
				default:
					//Copy as asset
					
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

	protected String compileXML(File file) throws CompilerException{
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
			return baos.toString("UTF-8");
		}catch(TransformerConfigurationException ex){
			System.err.println("Invalid transformer configuration: "+file.getPath());
		}catch(TransformerException ex){
			System.err.println("XML compilation error in file: "+file.getPath()+" Error: "+ex.getMessage());
		}catch(UnsupportedEncodingException ex){
			System.err.println("UTF-8 encoding not supported.");
		}
		throw new CompilerException();
		
	}
	
	public void copyAsset(){
		
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
				.withDescription(  "path for default skin" )
				.create( "skin" );


		Option target = OptionBuilder.withArgName( "file" )
				.hasArg()
				.withDescription(  "write output into the given file" )
				.create( "target" );

		Option output = OptionBuilder.withArgName( "mode" )
				.hasArg()
				.withDescription(  "set output mode (js|html)" )
				.create( "output" );
		
		Option framework = OptionBuilder.withArgName( "dir" )
				.hasArg()
				.withDescription(  "framework directory" )
				.create( "framework" );


		options.addOption(source);
		options.addOption(target);
		options.addOption(output);
		options.addOption(framework);
		options.addOption(skin);

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
