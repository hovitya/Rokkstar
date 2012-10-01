package rokkstar;

import java.io.File;

import helpers.FileReference;

public class Output {
	static public Boolean errorPrinted = false;
	
	static public void WriteWarning(String message,FileReference ref){
		System.out.println("[Warning] "+message+" "+ref.toString());
	}
	
	static public void WriteWarning(String message,String file, int line){
		FileReference ref = new FileReference(file, line);
		System.out.println("[Warning] "+message+" "+ref.toString());
	}
	
	static public void WriteError(String message,FileReference ref){
		Output.errorPrinted = true;
		System.out.println("[Error] "+message+" "+ref.toString());
	}
	
	static public void WriteError(String message,String file, int line){
		Output.errorPrinted = true;
		FileReference ref = new FileReference(file, line);
		System.out.println("[Error] "+message+" "+ref.toString());
	}
	
}
