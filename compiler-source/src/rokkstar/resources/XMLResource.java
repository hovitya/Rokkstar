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
		// TODO Auto-generated constructor stub
	}


	@Override
	public IPackageItem toEntity() throws IOException {
		// TODO Auto-generated method stub
		return new Type(this.getName(),Tools.deserializeString(this));
	}

}
