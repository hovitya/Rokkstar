package rokkstar.resources;

import java.io.File;
import rokkstar.entities.IPackageItem;

public abstract class FileResource extends File {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7726786558644284306L;

	public FileResource(String pathname) {
		super(pathname);
	}

	public abstract IPackageItem toEntity();
	
	public static FileResource factory(File file){
		String name=file.getName();
		int pos=name.indexOf('.');
		String ext=name.substring(pos+1);
		ext=ext.toLowerCase();
		if(file.isDirectory()){
			DirectoryResource dirRes = new DirectoryResource(file.getPath()); 
		}
		switch(ext){
			case "r.js":
				return new JSResource(file.getPath());
			case "r.xml":
				return new XMLResource(file.getPath());
			default:
				return new OtherResource(file.getPath());
		}
	}

}
