package rokkstar;

import java.io.IOException;

public interface ICopyHandler {
	public void writeFile(String path,String name,String content) throws IOException; 
	public void openFile(String path,String name) throws IOException;
	public void write(String content) throws IOException;
	public void closeFile() throws IOException;
}
