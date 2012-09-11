package rokkstar.resources;

import java.io.File;
import java.net.URI;

import rokkstar.entities.IPackageItem;

public abstract class FileResource extends File {

	public FileResource(String arg0) {
		super(arg0);
		// TODO Auto-generated constructor stub
	}

	public FileResource(URI arg0) {
		super(arg0);
		// TODO Auto-generated constructor stub
	}

	public FileResource(String arg0, String arg1) {
		super(arg0, arg1);
		// TODO Auto-generated constructor stub
	}

	public FileResource(File arg0, String arg1) {
		super(arg0, arg1);
		// TODO Auto-generated constructor stub
	}
	
	public abstract IPackageItem toEntity();

}
