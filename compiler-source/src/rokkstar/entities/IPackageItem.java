package rokkstar.entities;

import helpers.FileReference;

public interface IPackageItem extends IEntry{
	public String getName();
	public void setSource(FileReference file);
	public FileReference getSource();
}
