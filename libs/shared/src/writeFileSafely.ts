import * as fs from 'fs';
import * as path from 'path';



export async function writeFileSafely(filePath: string, content: string) {
    
    fs.mkdirSync(path.dirname(filePath), {
        recursive: true,
    });
    fs.writeFileSync(filePath, content);

}

export async function outputToConsole(filePath: string, content: string) {
    console.log(content);
}