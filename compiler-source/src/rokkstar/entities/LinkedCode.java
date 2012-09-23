package rokkstar.entities;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;

import exceptions.CompilerException;

import rokkstar.ICopyHandler;
import rokkstar.Tools;

import helpers.FileReference;

public class LinkedCode implements IPackageItem, Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -5968064218787409437L;
	public String payload;
	public String name;
	public ArrayList<String> packages;
	public String filename;
	
	public LinkedCode(String name,String payload,ArrayList<String> packages,String filename) {
		this.name=name;
		this.payload=payload;
		this.packages=packages;
		this.filename=filename;
	}

	@Override
	public String getName() {
		return this.name;
	}

	protected FileReference fr;
	@Override
	public void setSource(FileReference file) {
		this.fr=file;
	}

	@Override
	public FileReference getSource() {
		return fr;
	}
	
	public String parse(){
		return "";
	}
	
	@Override
	public void copy(ICopyHandler handler) throws IOException {
		handler.writeFile(Tools.implode(this.packages.toArray(), File.separator),this.name, this.payload);
	}

	@Override
	public String parse(Library lib) throws CompilerException {
		// TODO Auto-generated method stub
		return "";
	}

}
