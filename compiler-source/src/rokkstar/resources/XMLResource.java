package rokkstar.resources;


import java.io.IOException;

import rokkstar.Tools;
import rokkstar.entities.IPackageItem;
import rokkstar.entities.Type;

public class XMLResource extends FileResource {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2814504172399811365L;


	public XMLResource(String arg0) {
		super(arg0);
	}


	@Override
	public IPackageItem toEntity() throws IOException {
		return new Type(this.getName(),Tools.deserializeString(this),Tools.implode(this.packageHierarchy.toArray(), "."),"","","public");
	}

}
