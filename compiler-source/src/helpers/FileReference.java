package helpers;

public class FileReference {
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
