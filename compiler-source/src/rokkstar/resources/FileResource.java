package rokkstar.resources;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import rokkstar.Tools;
import rokkstar.entities.IPackageItem;
import rokkstar.exceptions.JSDocException;

public abstract class FileResource extends File {
	public ArrayList<String> packageHierarchy=new ArrayList<String>();
	/**
	 * 
	 */
	private static final long serialVersionUID = 7726786558644284306L;

	public FileResource(String pathname) {
		super(pathname);
	}
	
	protected String getClassName(){
		return this.getName().replaceAll("(\\.r){0,1}\\.js", "");
	}
	
	protected String getQualifiedClassName(){
		
		return Tools.implode(this.packageHierarchy.toArray(),".")+"."+this.getClassName();
	}

	public abstract IPackageItem toEntity() throws IOException, JSDocException;
	
	public static FileResource factory(File file, Boolean isInitial){
		String name=file.getName();
		int pos=name.indexOf('.');
		String ext=name.substring(pos+1);
		ext=ext.toLowerCase();
		if(file.isDirectory()){
			DirectoryResource dirRes = new DirectoryResource(file.getPath(),isInitial);
			return dirRes;
		}
		switch(ext){
			case "r.js":
			case "js":
				return new JSResource(file.getPath());
			case "r.xml":
				return new XMLResource(file.getPath());
			default:
				return new OtherResource(file.getPath());
		}
	}
	
	public static FileResource factory(File file){
		return FileResource.factory(file, false);
	}

}
