package rokkstar.entities;

import java.io.IOException;

import rokkstar.ICopyHandler;
import helpers.FileReference;

public interface IPackageItem extends IEntry{
	public String getName();
	public void setSource(FileReference file);
	public FileReference getSource();
	public String parse();
	public void copy(ICopyHandler handler) throws IOException;
}
