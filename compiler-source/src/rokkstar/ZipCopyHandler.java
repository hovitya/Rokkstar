package rokkstar;

import java.io.File;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipCopyHandler implements ICopyHandler {
	
	private ZipOutputStream out;
	
	public ZipCopyHandler(ZipOutputStream out){
		this.out = out;
	}
	
	
	@Override
	public void writeFile(String path, String name, String content) throws IOException {
		if(path.equals("")){
			this.out.putNextEntry(new ZipEntry(name));
		}else{
			this.out.putNextEntry(new ZipEntry(path+File.separator+name));
		}
		
		this.out.write(content.getBytes());
		this.out.closeEntry();
	}


	@Override
	public void openFile(String path, String name) throws IOException {
		if(path.equals("")){
			this.out.putNextEntry(new ZipEntry(name));
		}else{
			this.out.putNextEntry(new ZipEntry(path+File.separator+name));
		}
		
	}


	@Override
	public void write(String content) throws IOException {
		this.out.write(content.getBytes());
		
	}


	@Override
	public void closeFile() throws IOException {
		this.out.closeEntry();
		
	}

}
