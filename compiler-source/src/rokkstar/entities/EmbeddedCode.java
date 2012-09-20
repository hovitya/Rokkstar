package rokkstar.entities;

import rokkstar.ICopyHandler;
import helpers.FileReference;

public class EmbeddedCode implements IPackageItem {

	/**
	 * 
	 */
	private static final long serialVersionUID = 109391114731155524L;

	protected String name;
	
	public EmbeddedCode(String name) {
		this.name=name;
	}

	@Override
	public String getName() {
		return name;
	}
	
	public String payload;
	
	protected FileReference fr;

	@Override
	public void setSource(FileReference file) {
		this.fr=file;
	}

	@Override
	public FileReference getSource() {
		return this.fr;
	}
	
	public String parse(){
		return "";
		//return this.payload;
	}
	
	@Override
	public void copy(ICopyHandler handler) {
		// Do nothing
	}

}
