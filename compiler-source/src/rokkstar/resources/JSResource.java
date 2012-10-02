package rokkstar.resources;

import helpers.FileReference;
import helpers.RokkstarOutput;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.mozilla.javascript.BaseFunction;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import exceptions.CompilerException;

import rokkstar.Compiler;
import rokkstar.Output;
import rokkstar.Tools;
import rokkstar.entities.Function;
import rokkstar.entities.IClassLike;
import rokkstar.entities.IPackageItem;
import rokkstar.entities.Interface;
import rokkstar.entities.Parameter;
import rokkstar.entities.Property;
import rokkstar.entities.Type;
import rokkstar.exceptions.JSDocException;

public class JSResource extends FileResource {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7644868914306821156L;

	public JSResource(String arg0) {
		super(arg0);
	}

	@Override
	public IPackageItem toEntity() throws IOException, JSDocException,
			CompilerException {
		System.out.print(this.getQualifiedClassName() + ": ");
		File cache = Compiler.getInstance().readFromWorkDir(
				this.getQualifiedClassName().replaceAll("\\.", "_"));
		if (!cache.exists() || cache.lastModified() < this.lastModified()) {
			System.out.print("reading file, ");
			// Look up jsdoc
			JSONObject jsData;
			try {
				// Create file to compile
				String content = "";
				String packageN = "";
				for (int i = 0; i < this.packageHierarchy.toArray().length; i++) {
					packageN = packageN + this.packageHierarchy.toArray()[i];
					String cpack = packageN;
					if (i == 0) {
						cpack = "var " + packageN;
					}
					content = content + "/**\r\n * @namespace\r\n */\r\n"
							+ cpack + "={};\r\n";
					packageN = packageN + ".";
				}
				content += Tools.deserializeString(this);

				jsData = Compiler
						.getInstance()
						.runJSDoc(
								Compiler.getInstance().writeWorkDir(content,
										"current_source.r.js"))
						.getJSONObject("classes")
						.getJSONObject(this.getQualifiedClassName());
				IClassLike object;
				
				if (jsData.getBoolean("isInterface")) {
					object = new Interface(this.getClassName(),
							Tools.deserializeString(this),Tools.implode(
									this.packageHierarchy.toArray(), ".") );
					if (jsData.has("extends")) {
						ArrayList<String> extend = Tools.extractType(jsData, "extends");
						for (int i = 0; i < extend.size(); i++) {
							((Interface) object).superInterfaces.add(extend.get(i));
						}
					} 
					this.parseInterface((Interface) object, jsData, Compiler.getInstance().readFromWorkDir("current_source.r.js"));
				} else {
					String extend = null;
					// Looking for super class
					if (jsData.has("extends")) {
						
						if (Tools.extractType(jsData,"extends").size() > 1) {
							Output.WriteWarning(
									"Class is extending more than one class: "
											+ this.getQualifiedClassName() + " Extensions omitted.",
									this.getPath(), -1);
							extend = Tools.extractType(jsData,"extends").get(0);
						}else if(Tools.extractType(jsData,"extends").size() == 1){
							extend = Tools.extractType(jsData,"extends").get(0);
						}
					}
					object = new Type(this.getClassName(),
							Tools.deserializeString(this), Tools.implode(
									this.packageHierarchy.toArray(), "."),
							extend, jsData.getString("description"),
							jsData.getString("access"));

					this.parseType((Type) object, jsData, Compiler.getInstance().readFromWorkDir("current_source.r.js"));
					// Parsing interfaces
					if (jsData.has("impls")) {
						JSONArray impls = jsData.getJSONArray("impls");
						for (int i = 0; i < impls.length(); i++) {
							((Type) object).addInterface(impls.getString(i));
						}
					}
				}
				object.setSource(new FileReference(this.getPath(), 0));
				FileOutputStream fileOut = new FileOutputStream(cache);
				ObjectOutputStream out = new ObjectOutputStream(fileOut);
				out.writeObject(object);
				out.close();
				fileOut.close();
				System.out.println("done.");
				return object;
			} catch (JSONException e) {
				RokkstarOutput.WriteError(
								"RokkDoc is not or incorrectly specified for class '"
										+ this.getQualifiedClassName()
										+ "'. Type has to be marked as @class or @interface.",
								new FileReference(this.getPath(), 0));
				throw new JSDocException("Incorrect RokkDoc.");
			}
		} else {
			System.out.println("from cache.");
			try {
		  FileInputStream fileIn =
                    new FileInputStream(cache);
	      ObjectInputStream in = new ObjectInputStream(fileIn);
	      IPackageItem e;
		
			e = (IPackageItem) in.readObject();
		      in.close();
		      fileIn.close();
		      return e;
		} catch (ClassNotFoundException e1) {
			// Corrupted cache file
			cache.delete();
			return this.toEntity();
		}

		}
	}
	
	protected void parseInterface(Interface iface, JSONObject rokkDoc, File file) throws JSONException{
		Context cx = Context.enter();
		Scriptable scope = cx.initStandardObjects();
		cx.setLanguageVersion(Context.VERSION_1_2);
		@SuppressWarnings("unused")
		Object result;
		try {
			result = cx.evaluateString(
					scope,
					       Tools.deserializeString(file) + "; obj = new "
							+ this.getQualifiedClassName() + "();", this.getPath(), 1,
					null);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		ScriptableObject obj = (ScriptableObject) scope.get("obj", scope);
		Object[] keys = obj.getAllIds();

		// Parsing parameters
		JSONObject funcs = new JSONObject();
		if (rokkDoc.has("functions")) {
			funcs = rokkDoc.getJSONObject("functions");
		}
		
		for (int i = 0; i < keys.length; i++) {
			Object value = obj.get(keys[i]);
			if(value instanceof ScriptableObject
						&& ((ScriptableObject) value).getTypeOf().equals(
								"function")) {
				// Parse as function
				int param = ((BaseFunction) value).getArity();
				// Looking for documentation
				JSONObject functionDoc = null;
				if (funcs.has(keys[i].toString())) {
					functionDoc = funcs.getJSONObject(keys[i].toString());
				}

				ArrayList<Parameter> parameters = new ArrayList<Parameter>();
				for (int j = 0; j < param; j++) {
					ArrayList<String> types = new ArrayList<String>();

					if (functionDoc != null
							&& functionDoc.has("parameters")
							&& functionDoc.getJSONArray("parameters")
									.length() > j) {
						// Get parameter types
						types = Tools.extractType(
								functionDoc.getJSONArray("parameters")
										.getJSONObject(j), "type");
						parameters.add(new Parameter("arg" + j,
								!functionDoc.getJSONArray("parameters")
										.getJSONObject(j)
										.getBoolean("optional"),
								functionDoc.getJSONArray("parameters")
										.getJSONObject(j)
										.getString("default"), types,
								functionDoc.getJSONArray("parameters")
										.getJSONObject(j)
										.getString("description")));
					} else {
						// Undocumented parameter
						types.add("*");
						parameters.add(new Parameter("arg" + j, false, "",
								types, ""));
					}

				}

				Function func;
				ArrayList<String> returnType = new ArrayList<String>();
				if (functionDoc == null) {
					returnType.add("void");
					func = new Function(keys[i].toString(), parameters,
							returnType, "", "public", false, "", false);
				} else {
					String retDesc = "";
					if (functionDoc.has("returns")) {
						retDesc = functionDoc.getJSONObject("returns")
								.getString("description");
						returnType = Tools.extractType(
								functionDoc.getJSONObject("returns"),
								"type");
					} else {
						returnType.add("void");
					}
					
					String access = functionDoc.getString("access");
					if(access.equals("private")){
						access = "protected";
						Output.WriteWarning("Interface function access cannot be private. "+this.getQualifiedClassName()+"#"+keys[i].toString()+" is private. Access is modified to protected.", this.getPath(), 0);
					}

					func = new Function(keys[i].toString(), parameters,
							returnType, retDesc,
							access,
							functionDoc.getBoolean("static"),
							functionDoc.getString("description"),
							functionDoc.getBoolean("isOverride"));
				}

				func.payload = cx
						.decompileFunction((BaseFunction) value, 0);
				func.payloadBody = cx.decompileFunctionBody(
						(BaseFunction) value, 0);
				iface.addFunction(func);

			} else {
				Output.WriteWarning("Interfaces can contain only function definitions. "+this.getQualifiedClassName()+"#"+keys[i].toString() + "is not a function. Declaration omitted.", this.getPath(), 0);
			}
		}
	}

	protected void parseType(Type type, JSONObject rokkDoc, File file)
			throws JSONException, CompilerException {
		// Creates and enters a Context. The Context stores information
		// about the execution environment of a script.
		Context cx = Context.enter();
		// try {
		// Initialize the standard objects (Object, Function, etc.)
		// This must be done before scripts can be executed. Returns
		// a scope object that we use in later calls.
		Scriptable scope = cx.initStandardObjects();

		cx.setLanguageVersion(Context.VERSION_1_2);

		// Now evaluate the string we've colected.
		@SuppressWarnings("unused")
		Object result;
		try {
			result = cx.evaluateString(
					scope,
					       Tools.deserializeString(file) + "; obj = new "
							+ this.getQualifiedClassName() + "();", this.getPath(), 1,
					null);
			ScriptableObject obj = (ScriptableObject) scope.get("obj", scope);
			Object[] keys = obj.getAllIds();

			// Parsing parameters
			JSONObject funcs = new JSONObject();
			if (rokkDoc.has("functions")) {
				funcs = rokkDoc.getJSONObject("functions");
			}

			JSONObject props = new JSONObject();
			if (rokkDoc.has("properties")) {
				props = rokkDoc.getJSONObject("properties");
			}

			for (int i = 0; i < keys.length; i++) {
				Object value = obj.get(keys[i]);
				if (value == null) {
					ArrayList<String> types = new ArrayList<String>();

					if (props.has(keys[i].toString())) {
						JSONObject propDoc = props.getJSONObject(keys[i]
								.toString());
						types = Tools.extractType(propDoc, "type");
						type.addProperty(new Property(keys[i].toString(),
								propDoc.getBoolean("static"), null, types,
								propDoc.getString("access"), propDoc
										.getString("description"),"null",propDoc.getBoolean("notNull"), propDoc.getBoolean("bindable"), 
										propDoc.getString("getter"),propDoc.getString("setter")));
					} else {
						types.add("*");
						type.addProperty(new Property(keys[i].toString(),
								false, null, types, "public", "","null",false,false,"",""));
					}
				} else if (value instanceof ScriptableObject
						&& ((ScriptableObject) value).getTypeOf().equals(
								"function")) {
					// Parse as function
					int param = ((BaseFunction) value).getArity();
					// Looking for documentation
					JSONObject functionDoc = null;
					if (funcs.has(keys[i].toString())) {
						functionDoc = funcs.getJSONObject(keys[i].toString());
					}

					ArrayList<Parameter> parameters = new ArrayList<Parameter>();
					for (int j = 0; j < param; j++) {
						ArrayList<String> types = new ArrayList<String>();

						if (functionDoc != null
								&& functionDoc.has("parameters")
								&& functionDoc.getJSONArray("parameters")
										.length() > j) {
							// Get parameter types
							types = Tools.extractType(
									functionDoc.getJSONArray("parameters")
											.getJSONObject(j), "type");
							parameters.add(new Parameter("arg" + j,
									!functionDoc.getJSONArray("parameters")
											.getJSONObject(j)
											.getBoolean("optional"),
									functionDoc.getJSONArray("parameters")
											.getJSONObject(j)
											.getString("default"), types,
									functionDoc.getJSONArray("parameters")
											.getJSONObject(j)
											.getString("description")));
						} else {
							// Undocumented parameter
							types.add("*");
							parameters.add(new Parameter("arg" + j, false, "",
									types, ""));
						}

					}

					Function func;
					ArrayList<String> returnType = new ArrayList<String>();
					if (functionDoc == null) {
						returnType.add("void");
						func = new Function(keys[i].toString(), parameters,
								returnType, "", "public", false, "", false);
					} else {
						String retDesc = "";
						if (functionDoc.has("returns")) {
							retDesc = functionDoc.getJSONObject("returns")
									.getString("description");
							returnType = Tools.extractType(
									functionDoc.getJSONObject("returns"),
									"type");
						} else {
							returnType.add("void");
						}

						func = new Function(keys[i].toString(), parameters,
								returnType, retDesc,
								functionDoc.getString("access"),
								functionDoc.getBoolean("static"),
								functionDoc.getString("description"),
								functionDoc.getBoolean("isOverride"));
					}

					func.payload = cx
							.decompileFunction((BaseFunction) value, 0);
					func.payloadBody = cx.decompileFunctionBody(
							(BaseFunction) value, 0);
					type.addFunction(func);
				} else if (value instanceof ScriptableObject) {

					if (value instanceof NativeArray) {
						if (((NativeArray) value).getLength() != 0) {
							Output.WriteError(
									"Complex initial value for property:"
											+ keys[i]
											+ "Use only primitive types for initialization (Number, Boolean, String, Empty array, Empty object).",
									this.getPath(), 0);
							throw new CompilerException("Compilation error.",
									new FileReference(this.getPath(), 0));
						}
						ArrayList<String> types = new ArrayList<String>();

						if (props.has(keys[i].toString())) {
							JSONObject propDoc = props.getJSONObject(keys[i]
									.toString());
							types = Tools.extractType(propDoc, "type");
							type.addProperty(new Property(
									keys[i].toString(), propDoc
											.getBoolean("static"), null,
									types, propDoc.getString("access"), propDoc
											.getString("description"), "array", propDoc.getBoolean("notNull"), propDoc.getBoolean("bindable"), 
											propDoc.getString("getter"),propDoc.getString("setter")));
						} else {
							types.add("*");
							type.addProperty(new Property(
									keys[i].toString(), false, null, types,
									"public", "", "array", false, false, "", ""));
						}
					} else if (value instanceof NativeObject) {
						if (!((NativeObject) value).isEmpty()) {
							Output.WriteError(
									"Complex initial value for property:"
											+ keys[i]
											+ "Use only primitive types for initialization (Number, Boolean, String, null, Empty array, Empty object).",
									this.getPath(), 0);
							throw new CompilerException("Compilation error.",
									new FileReference(this.getPath(), 0));
						}
						ArrayList<String> types = new ArrayList<String>();
						if (props.has(keys[i].toString())) {
							JSONObject propDoc = props.getJSONObject(keys[i]
									.toString());
							types = Tools.extractType(propDoc, "type");
							type.addProperty(new Property(
									keys[i].toString(), propDoc
											.getBoolean("static"),
									"", types, propDoc
											.getString("access"), propDoc
											.getString("description"),"object",propDoc.getBoolean("notNull"), propDoc.getBoolean("bindable"), 
											propDoc.getString("getter"),propDoc.getString("setter")));
						} else {
							types.add("*");
							type.addProperty(new Property(
									keys[i].toString(), false, "",
									types, "public", "","object",false,false,"",""));
						}
					} else {
						Output.WriteError(
								"Complex initial value for property:"
										+ keys[i]
										+ "Use only primitive types for initialization (Number, Boolean, String, null, Empty array, Empty object).",
								this.getPath(), 0);
						throw new CompilerException("Compilation error.",
								new FileReference(this.getPath(), 0));
					}
				} else {
					if (!(value instanceof String)
							&& !(value instanceof Boolean)
							&& !(value instanceof Number)) {
						Output.WriteError(
								"Complex initial value for property:"
										+ keys[i]
										+ "Use only primitive types for initialization (Number, Boolean, String, null, Empty array, Empty object).",
								this.getPath(), 0);
						throw new CompilerException("Compilation error.",
								new FileReference(this.getPath(), 0));
					}
					String typ;
					String val;
					
					if(value instanceof Boolean){
						typ="boolean";
						val=value.toString();
					}else if(value instanceof Number){
						typ="number";
						val=value.toString();
					}else{
						typ="string";
						val=(String) value;
					}
					ArrayList<String> types = new ArrayList<String>();
					if (props.has(keys[i].toString())) {
						JSONObject propDoc = props.getJSONObject(keys[i]
								.toString());
						types = Tools.extractType(propDoc, "type");
						type.addProperty(new Property(keys[i].toString(),
								propDoc.getBoolean("static"), val, types,
								propDoc.getString("access"), propDoc
										.getString("description"),typ,propDoc.getBoolean("notNull"), propDoc.getBoolean("bindable"), 
										propDoc.getString("getter"),propDoc.getString("setter")));
					} else {
						types.add("*");
						type.addProperty(new Property(keys[i].toString(),
								false, val, types, "public", "", typ,false,false,"",""));
					}
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		// Convert the result to a string and print it.
		// System.err.println(Context.toString(result));

		// }
		// Exit from the context.
		Context.exit();

	}

}
