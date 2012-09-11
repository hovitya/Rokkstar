package rokkstar;

import helpers.FileReference;

public class Output {
	static public void WriteWarning(String message,FileReference ref){
		System.out.println("[Warning] "+message+" "+ref.toString());
	}
	
	static public void WriteError(String message,FileReference ref){
		System.out.println("[Error] "+message+" "+ref.toString());
	}
}
