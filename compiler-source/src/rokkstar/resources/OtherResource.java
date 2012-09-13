package rokkstar.resources;

import java.io.IOException;

import rokkstar.Tools;
import rokkstar.entities.IPackageItem;
import rokkstar.entities.LinkedCode;
import rokkstar.entities.Type;

public class OtherResource extends FileResource {

	/**
	 * 
	 */
	private static final long serialVersionUID = -912837716661807048L;

	public OtherResource(String arg0) {
		super(arg0);
	}

	public IPackageItem toEntity() throws IOException {
		return new LinkedCode(this.getQualifiedClassName(),Tools.deserializeString(this),this.packageHierarchy,this.getName());
	}

}
