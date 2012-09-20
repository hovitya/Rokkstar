package rokkstar.entities;

import java.util.ArrayList;

public interface IClassLike extends IPackageItem{
	public void addFunction(Function func);
	public ArrayList<Function> getFunctions();
}
