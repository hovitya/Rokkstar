package helpers;

import java.io.Serializable;

public class FileReference implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -1392099294187286418L;
	public String fileName="";
	public int line=0;
	public FileReference(String file,int line){
		this.line=line;
		this.fileName=file;
	}
	
	public String toString(){
		return "("+fileName+";"+line+")";
	}
}
