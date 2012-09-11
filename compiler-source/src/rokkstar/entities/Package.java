package rokkstar.entities;

import java.util.HashMap;

public class Package implements IPackageItem{
	public HashMap<String, IPackageItem> items = new HashMap<String, IPackageItem>();
	public String name;
	public String getName(){
		return this.name;
	}
}
