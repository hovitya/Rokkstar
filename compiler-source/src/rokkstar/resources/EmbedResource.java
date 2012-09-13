package rokkstar.resources;

import java.io.IOException;

import rokkstar.Tools;
import rokkstar.entities.EmbeddedCode;
import rokkstar.entities.IPackageItem;
import rokkstar.exceptions.JSDocException;

public class EmbedResource extends FileResource {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2468532402573563412L;

	public EmbedResource(String pathname) {
		super(pathname);
		// TODO Auto-generated constructor stub
	}

	@Override
	public IPackageItem toEntity() throws IOException, JSDocException {
		EmbeddedCode code = new EmbeddedCode(this.getQualifiedClassName());
		code.payload = Tools.deserializeString(this);
		return code;
	}

}
