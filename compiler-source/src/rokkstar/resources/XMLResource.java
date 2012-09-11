package rokkstar.resources;

import java.io.File;
import java.net.URI;

import rokkstar.entities.IPackageItem;

public class XMLResource extends FileResource {

	public XMLResource(String arg0) {
		super(arg0);
		// TODO Auto-generated constructor stub
	}

	public XMLResource(URI arg0) {
		super(arg0);
		// TODO Auto-generated constructor stub
	}

	public XMLResource(String arg0, String arg1) {
		super(arg0, arg1);
		// TODO Auto-generated constructor stub
	}

	public XMLResource(File arg0, String arg1) {
		super(arg0, arg1);
		// TODO Auto-generated constructor stub
	}

	@Override
	public IPackageItem toEntity() {
		// TODO Auto-generated method stub
		return null;
	}

}
