package rokkstar.entities;

import java.util.ArrayList;

import exceptions.CompilerException;

public interface IClassLike extends IPackageItem{
	public void addFunction(Function func);
	public ArrayList<Function> getFunctions(Library lib) throws CompilerException;
	

	Boolean hasFunction(String name, Library lib) throws CompilerException;
}
