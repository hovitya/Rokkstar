package rokkstar.entities;

import java.util.ArrayList;

public class Interface implements IPackageItem {
	public String name;
	public ArrayList<Interface> superInterfaces = new ArrayList<Interface>();
	public ArrayList<Function> functions = new ArrayList<Function>();
	public String getName(){
		return this.name;
	}
}
