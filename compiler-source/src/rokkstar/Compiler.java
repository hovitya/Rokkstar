package rokkstar;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
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

import rokkstar.entities.IPackageItem;
import rokkstar.entities.Library;
import rokkstar.exceptions.ParameterException;
import rokkstar.resources.FileResource;

public class Compiler {
	
	public void createLibrary(String source, String target, Boolean includeSource) throws IOException{
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
        
        //ObjectOutputStream objout = new ObjectOutputStream(out);
        //objout.writeObject(lib);
        //objout.close();
        out.closeEntry();
        out.close();
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
	
	
	public Library compileLibrary(String source, Library sourceLibrary){
		File sourceDir=new File(source);
		IPackageItem item = FileResource.factory(sourceDir).toEntity();
		if(item instanceof Package){
			sourceLibrary.merge((rokkstar.entities.Package) item);
		}else{
			sourceLibrary.addItem(item);
		}
		
		return sourceLibrary;
	}
	
	public Library compileLibrary(String source){
		return this.compileLibrary(source, new Library());
	}
	
	/**
	 * @param args
	 */
	@SuppressWarnings("static-access")
	public static void main(String[] args) {
		Options options = new Options();
		Option comp = OptionBuilder.create("compile");
		Option deb = OptionBuilder.create("debug");
		Option pack = OptionBuilder.create("library");
		Option src = OptionBuilder.create("includeSource");
		Option help = OptionBuilder.create("help");
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
		CommandLineParser parser = new GnuParser();
		Compiler compiler = new Compiler();
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
						throw new ParameterException("Parameter is missing: 'target'");
					}
					if(!line.hasOption("source") ){
						throw new ParameterException("Parameter is missing: 'source'");
					}
					compiler.createLibrary(line.getOptionValue("source"), line.getOptionValue("target"),line.hasOption("includeSource"));
				}
			}
		}catch(ParameterException e){
			System.out.println("Error: "+e.getMessage());
		} catch (ParseException e) {
			System.out.println("Error: Unable to parse input parameters.");
			
		}catch(Exception e){
			System.out.println("Error: "+e.getMessage());
		}finally{
			System.out.println("Compilation complete.");
		}

	}

}
