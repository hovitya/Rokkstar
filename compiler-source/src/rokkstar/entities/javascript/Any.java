package rokkstar.entities.javascript;


public class Any extends BuiltinType {
	public Any() {
		this.name="*";
	}
	
	private static Any instance;
	
	public static Any getInstance(){
		if(Any.instance == null) {
			Any.instance = new Any();
		}
		return Any.instance;
	}
}
