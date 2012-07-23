package exceptions;
import helpers.FileReference;


public class CompilerException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3696685172317271920L;


	public FileReference reference=null;


	public CompilerException(String message,FileReference ref) {
		super(message);
		this.reference=ref;
	}
	
	public CompilerException() {
		super();
	}	

}
