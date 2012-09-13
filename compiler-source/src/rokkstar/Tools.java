package rokkstar;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class Tools {

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

}
