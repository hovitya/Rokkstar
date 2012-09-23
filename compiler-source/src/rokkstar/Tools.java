package rokkstar;

import helpers.FileReference;
import helpers.RokkstarOutput;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Tools {

	public static ArrayList<String> extractType(JSONObject obj,String type) throws JSONException{
		ArrayList<String> ret = new ArrayList<String>();
		//Maybe it is a simple string
		try{
			ret.add(obj.getString(type));
		}catch(JSONException ex){
			//Try to find name array
			JSONArray typeArray;
			try{
				typeArray = obj.getJSONObject(type).getJSONArray("names");
			}catch(JSONException ex2){
				typeArray = obj.getJSONArray(type);
			}
			for (int i = 0; i < typeArray.length(); i++) {
				ret.add(typeArray.getString(i));
			}
		}
		return ret;
	}

	public static String implode(String[] ary, String delim) {
		String out = "";
		for(int i=0; i<ary.length; i++) {
			if(i!=0) { out += delim; }
			out += ary[i];
		}
		return out;
	}

	public static String implode(Object[] ary, String delim) {
		String out = "";
		for(int i=0; i<ary.length; i++) {
			if(i!=0) { out += delim; }
			out += ary[i];
		}
		return out;
	}

	public static String deserializeString(File file)
			throws IOException {
		int len;
		char[] chr = new char[4096];
		final StringBuffer buffer = new StringBuffer();
		final FileReader reader = new FileReader(file);
		try {
			while ((len = reader.read(chr)) > 0) {
				buffer.append(chr, 0, len);
			}
		} finally {
			reader.close();
		}
		return buffer.toString();
	}

	public static void createDirs(String dir) {

		File file = new File(dir);

		if (file.exists()) {
			//System.out.println("Directory : " + dir + " already exists");
		} else {
			boolean retval = file.mkdirs();
			if (retval) {
			} else {
				RokkstarOutput.WriteError("Directory : " + dir + " creation failed", new FileReference("",0));
			}
		}

	}

	public static String substringBeforeLast(String str, String separator) {
		int pos = str.lastIndexOf(separator);
		if (pos == -1) {
			return str;
		}
		return str.substring(0, pos);
	}

	public static String substringBeforeFirst(String str, String separator) {
		int pos = str.indexOf(separator);
		if (pos == -1) {
			return str;
		}
		return str.substring(0, pos);
	}

	public static String substringAfterFirst(String str, String separator) {
		int pos = str.indexOf(separator);
		if (pos == -1) {
			return str;
		}
		return str.substring(pos+1, str.length());
	}


}
