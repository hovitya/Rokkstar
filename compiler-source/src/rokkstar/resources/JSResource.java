package rokkstar.resources;

import helpers.FileReference;
import helpers.RokkstarOutput;

import java.io.IOException;

import org.json.JSONException;
import org.json.JSONObject;

import com.sun.corba.se.impl.copyobject.JavaStreamObjectCopierImpl;

import rokkstar.Compiler;
import rokkstar.Tools;
import rokkstar.entities.IPackageItem;
import rokkstar.entities.Interface;
import rokkstar.entities.Type;
import rokkstar.exceptions.JSDocException;

public class JSResource extends FileResource {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7644868914306821156L;



	public JSResource(String arg0) {
		super(arg0);
		// TODO Auto-generated constructor stub
	}



	@Override
	public IPackageItem toEntity() throws IOException, JSDocException {
		//Look up jsdoc
		JSONObject jsData;
		try {
			jsData = Compiler.getInstance().classDefinitions.getJSONObject(this.getQualifiedClassName());
			if(jsData.getString("type").equals("interface")){
				return new Interface(this.getClassName(),Tools.deserializeString(this));
			}else{
				return new Type(this.getClassName(),Tools.deserializeString(this));
			}
		}catch(JSONException e){
			RokkstarOutput.WriteError("RokkDoc is not or incorrectly specified for class '"+this.getQualifiedClassName()+"'. @name and @package tag has to be specified correctly and type has to be marked as @class or @interface.", new FileReference(this.getPath(), 0));
			throw new JSDocException("Incorrect RokkDoc.");
		}
	}

}
