package rokkstar;

import java.io.File;

import com.google.javascript.rhino.head.ErrorReporter;
import com.google.javascript.rhino.head.EvaluatorException;

import helpers.FileReference;

public class Output implements ErrorReporter{
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

	protected Output(){
		
	}
	
	static private Output instance;
	
	static public Output getInstance(){
		if(Output.instance==null) Output.instance = new Output();
		return Output.instance;
	}

	@Override
	public void error(String arg0, String arg1, int arg2, String arg3, int arg4) {
		Output.WriteError(arg0, arg1, arg2);
		
	}

	@Override
	public EvaluatorException runtimeError(String arg0, String arg1, int arg2,
			String arg3, int arg4) {
		Output.WriteError(arg0, arg1, arg2);
		return null;
	}

	@Override
	public void warning(String arg0, String arg1, int arg2, String arg3,
			int arg4) {
		Output.WriteWarning(arg0, arg1, arg2);
		
	}
	
}
