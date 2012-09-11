package rokkstar.resources;

import java.io.File;

import rokkstar.entities.IPackageItem;
import rokkstar.entities.Package;

public class DirectoryResource extends FileResource {

	public DirectoryResource(String pathname) {
		super(pathname);
		// TODO Auto-generated constructor stub
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 6260049236879374435L;

	@Override
	public IPackageItem toEntity() {
		Package pack = new Package(this.getName());
		for (File child : this.listFiles()) {
			if (".".equals(child.getName()) || "..".equals(child.getName()) || "_meta".equals(child.getName())) {
				continue;  // Ignore the self and parent aliases.
			}
			FileResource file = FileResource.factory(child);
			IPackageItem item = file.toEntity();
			pack.addItem(item);
		}
		return pack;
	}

}
