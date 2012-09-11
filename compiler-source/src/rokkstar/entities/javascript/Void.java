package rokkstar.entities.javascript;

public class Void extends BuiltinType {
	public Void(){
		this.name="void";
	}
	
	private static Void instance;
	
	public static Void getInstance(){
		if(Void.instance == null) {
			Void.instance = new Void();
		}
		return Void.instance;
	}
}
