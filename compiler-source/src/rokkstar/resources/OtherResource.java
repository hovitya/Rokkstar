package rokkstar.resources;

import java.io.File;
import java.net.URI;

import rokkstar.entities.IPackageItem;

public class OtherResource extends FileResource {

	public OtherResource(String arg0) {
		super(arg0);
		// TODO Auto-generated constructor stub
	}

	public OtherResource(URI arg0) {
		super(arg0);
		// TODO Auto-generated constructor stub
	}

	public OtherResource(String arg0, String arg1) {
		super(arg0, arg1);
		// TODO Auto-generated constructor stub
	}

	public OtherResource(File arg0, String arg1) {
		super(arg0, arg1);
		// TODO Auto-generated constructor stub
	}

	public IPackageItem toEntity() {
		return null;
	}

}
