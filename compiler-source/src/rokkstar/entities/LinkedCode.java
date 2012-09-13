package rokkstar.entities;

import java.util.ArrayList;

import helpers.FileReference;

public class LinkedCode implements IPackageItem {
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
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setSource(FileReference file) {
		// TODO Auto-generated method stub

	}

	@Override
	public FileReference getSource() {
		// TODO Auto-generated method stub
		return null;
	}

}
