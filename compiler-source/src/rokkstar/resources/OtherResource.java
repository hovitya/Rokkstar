package rokkstar.resources;

import rokkstar.entities.IPackageItem;
import rokkstar.entities.Type;

public class OtherResource extends FileResource {

	/**
	 * 
	 */
	private static final long serialVersionUID = -912837716661807048L;

	public OtherResource(String arg0) {
		super(arg0);
		// TODO Auto-generated constructor stub
	}

	public IPackageItem toEntity() {
		return new Type(this.getName());
	}

}
