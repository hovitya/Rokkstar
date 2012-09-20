package rokkstar;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class FSCopyHandler implements ICopyHandler {
	public String pathBase;
	
	
	public FSCopyHandler(String pathBase) {
		super();
		this.pathBase = pathBase;
	}


	@Override
	public void writeFile(String path,String name, String content) throws IOException {
		Tools.createDirs(this.pathBase+File.separator+path);
		FileWriter fw=new FileWriter(this.pathBase+File.separator+path+File.separator+name);
		fw.write(content);
		fw.flush();
		fw.close();
	}

	private FileWriter fw;
	@Override
	public void openFile(String path, String name) throws IOException {
		Tools.createDirs(this.pathBase+File.separator+path);
		this.fw=new FileWriter(this.pathBase+File.separator+path+File.separator+name);
		
	}


	@Override
	public void write(String content) throws IOException {
		this.fw.write(content);
		this.fw.flush();
		
	}


	@Override
	public void closeFile() throws IOException {
		this.fw.close();
		
	}
	
	

}
