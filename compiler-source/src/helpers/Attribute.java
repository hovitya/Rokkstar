package helpers;

import java.util.Vector;

public class Attribute {
	public Attribute(String name,FileReference reference){
		this.name=name;
		this.fileReference=reference;
	}
	
	public Attribute(String name,FileReference reference,String value){
		this.name=name;
		this.fileReference=reference;
		this.value.add(value);
	}
	
	public String name="";
	public FileReference fileReference=null;
	public Vector<Object> value=new Vector<Object>();
}
