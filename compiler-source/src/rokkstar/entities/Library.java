package rokkstar.entities;

import helpers.FileReference;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.util.Iterator;
import java.util.Map;

import rokkstar.Compiler;
import rokkstar.Output;
import rokkstar.Tools;

import exceptions.CompilerException;


public class Library extends Package implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -2340484497303282280L;
	
	public String parse(Library lib) throws CompilerException {
		String compiled = "";
		
		//Adding rokkstar compatibility
		try{
			File compatibility = new File(Compiler.getInstance().sdkDir + File.separator + "framework" + File.separator + "rokkstar-compatibility.js");
			compiled += Tools.deserializeString(compatibility) + "\n";
		} catch(IOException ex) {
			Output.WriteError("A required framework file missing: rokkstar-compatibility.js", new FileReference("unknown", 0));
			throw new CompilerException("File is missing", new FileReference("unknown", 0));
		}
		Iterator<Map.Entry<String,IPackageItem>> it = this.items.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry<String,IPackageItem> pairs = it.next();
			IPackageItem item = (IPackageItem) pairs.getValue();
			compiled+=item.parse(lib);
		}
		
		return compiled;
	}

}
