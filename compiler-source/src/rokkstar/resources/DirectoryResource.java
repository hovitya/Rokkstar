package rokkstar.resources;

import java.io.File;
import java.io.IOException;

import exceptions.CompilerException;

import rokkstar.Tools;
import rokkstar.entities.IPackageItem;
import rokkstar.entities.Package;
import rokkstar.exceptions.JSDocException;

public class DirectoryResource extends FileResource {
	public Boolean isInitial = false;
	public DirectoryResource(String pathname) {
		super(pathname);
		// TODO Auto-generated constructor stub
	}
	
	public DirectoryResource(String pathname,Boolean initial) {
		super(pathname);
		this.isInitial = initial;
		// TODO Auto-generated constructor stub
	}
	/**
	 * 
	 */
	private static final long serialVersionUID = 6260049236879374435L;

	@Override
	public IPackageItem toEntity() throws IOException, JSDocException, CompilerException {
		Package pack = new Package(this.getName(),Tools.implode(this.packageHierarchy.toArray(), "."));
		pack.packageName=Tools.implode(this.packageHierarchy.toArray(), ".");
		for (File child : this.listFiles()) {
			if (".".equals(child.getName()) || "..".equals(child.getName()) || "_meta".equals(child.getName())) {
				continue;  // Ignore the self and parent aliases.
			}
			FileResource file = FileResource.factory(child);
			file.packageHierarchy.addAll(this.packageHierarchy);
			if(!this.isInitial) file.packageHierarchy.add(this.getName());
			IPackageItem item = file.toEntity();
			pack.addItem(item);
		}
		return pack;
	}

}
