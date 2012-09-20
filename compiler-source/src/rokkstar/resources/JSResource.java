package rokkstar.resources;

import helpers.FileReference;
import helpers.RokkstarOutput;

import java.io.IOException;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.mozilla.javascript.BaseFunction;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.FunctionObject;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import rokkstar.Compiler;
import rokkstar.Output;
import rokkstar.Tools;
import rokkstar.entities.Function;
import rokkstar.entities.IClassLike;
import rokkstar.entities.IPackageItem;
import rokkstar.entities.Interface;
import rokkstar.entities.Parameter;
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
			//Create file to compile
			String content = "";
			String packageN = "";
			for(int i =0; i < this.packageHierarchy.toArray().length;i++){
				packageN = packageN + this.packageHierarchy.toArray()[i];
				String cpack = packageN;
				if(i==0){
					cpack = "var " + packageN;
				}
				content = content + "/**\r\n * @namespace\r\n */\r\n" + cpack + "={};\r\n";
				packageN = packageN + ".";
			}
			content += Tools.deserializeString(this);
			
			
			jsData = Compiler.getInstance().runJSDoc(Compiler.getInstance().writeWorkDir(content, "current_source.r.js")).getJSONObject("classes").getJSONObject(this.getQualifiedClassName());
			IClassLike object; 
			if(jsData.getString("type").equals("interface")){
				object = new Interface(this.getClassName(),Tools.deserializeString(this));
			}else{
				String extend = null;
				//Looking for super class
				if(jsData.has("extends") &&  jsData.getJSONArray("extends").length()==1){
					extend = jsData.getJSONArray("extends").getString(0);
				}else if(jsData.has("extends") &&  jsData.getJSONArray("extends").length()>1){
					Output.WriteWarning("Class is extending more than one class: "+this.getQualifiedClassName(), this.getPath(),-1);
				}
				object = new Type(this.getClassName(),Tools.deserializeString(this),Tools.implode(this.packageHierarchy.toArray(), "."),extend,jsData.getString("description"),jsData.getString("access"));
				this.parseType((Type) object);
				//Parsing interfaces
				if(jsData.has("implements")){
					JSONArray impls = jsData.getJSONArray("implements");
					for(int i = 0;i<impls.length();i++){
						((Type) object).addInterface(impls.getString(i));
					}
				}
			}
			
			//Parsing functions
			/*if(jsData.has("functions")){

				JSONArray funcs = jsData.getJSONArray("functions");
				for (int i = 0; i < funcs.length(); i++) {
					JSONObject funcData = funcs.getJSONObject(i);

					String access = funcData.getString("access");
					String description = funcData.getString("description");
					String name = funcData.getString("name");
					ArrayList<String> returnType = new ArrayList<String>();
					try{
						returnType.add(funcData.getJSONObject("returns").getString("type"));
					}catch(JSONException e){
						//Maybe it has multiple type
						JSONArray tmpType = funcData.getJSONObject("returns").getJSONArray("type");
						for(int j = 0;j < tmpType.length();j++){
							returnType.add(tmpType.getString(j));
						}
					}
					String returnTypeDescription = funcData.getJSONObject("returns").getString("description");
					//parsing parameters
					ArrayList<Parameter> parameters = new ArrayList<Parameter>();
					if(funcData.has("parameters")){
						JSONArray params = funcData.getJSONArray("parameters");
						for(int j = 0;j < params.length();j++){
							JSONObject paramData = params.getJSONObject(j);
							ArrayList<String> type = new ArrayList<String>();
							try{
								returnType.add(paramData.getString("type"));
							}catch(JSONException e){
								//Maybe it has multiple type
								JSONArray tmpType = paramData.getJSONArray("type");
								for(int h = 0;h < tmpType.length();h++){
									type.add(tmpType.getString(h));
								}
							}
							parameters.add(new Parameter(paramData.getString("name"), !paramData.getBoolean("optional"), paramData.getString("default"), type, paramData.getString("description")));
						}
					}
					
					Function func = new Function(name, parameters, returnType ,returnTypeDescription, access, access.equals("static"), description);
					if(object instanceof Type && name.equals("construct")){
						((Type) object).construct=func;	
					}else{
						object.addFunction(func);
					}
					
					
				}
			}*/
			return object;
		}catch(JSONException e){
			RokkstarOutput.WriteError("RokkDoc is not or incorrectly specified for class '"+this.getQualifiedClassName()+"'. Type has to be marked as @class or @interface.", new FileReference(this.getPath(), 0));
			throw new JSDocException("Incorrect RokkDoc.");
		}
	}
	
	protected void parseType(Type type){
        // Creates and enters a Context. The Context stores information
        // about the execution environment of a script.
        Context cx = Context.enter();
        //try {
            // Initialize the standard objects (Object, Function, etc.)
            // This must be done before scripts can be executed. Returns
            // a scope object that we use in later calls.
            Scriptable scope = cx.initStandardObjects();

            cx.setLanguageVersion(Context.VERSION_1_2);

            // Now evaluate the string we've colected.
            Object result;
			try {
				result = cx.evaluateString(scope, "Rokkstar={createComponent:''}; core={}; "+Tools.deserializeString(this)+"; obj = new "+this.getQualifiedClassName()+"();", "<cmd>", 1, null);
				ScriptableObject obj = (ScriptableObject) scope.get("obj", scope);
				Object[] keys = obj.getAllIds();
				for (int i = 0; i < keys.length; i++) {
					Object value = obj.get(keys[i]);
					if(value == null){
						//null parameter
					}else if(value instanceof ScriptableObject && ((ScriptableObject) value).getTypeOf().equals("function")){
						//Parse as function
						int param=((BaseFunction) value).getArity();
						
						System.out.println(cx.decompileFunction((BaseFunction) value,10));
						
						ArrayList<Parameter> parameters = new ArrayList<Parameter>();
						for(int j=0;j<param;j++){
							ArrayList<String> types = new ArrayList<String>();
							types.add("*");
							parameters.add(new Parameter("arg"+j, false, "", types, ""));
						}
						
						ArrayList<String> returnType = new ArrayList<String>();
						returnType.add("*");
						Function func = new Function(keys[i].toString(), parameters , returnType , "", "public", false, "");
						func.payload=cx.decompileFunction((BaseFunction) value,10); 
						type.addFunction(func);
					}else{
						//Parse as property
					}
				}
				System.out.println(obj.getClassName());
				System.out.println(obj.toString());
			} catch (IOException e) {
				e.printStackTrace();
			}

            // Convert the result to a string and print it.
            //System.err.println(Context.toString(result));

        //}
            // Exit from the context.
            Context.exit();
        
	}

}
