import * as fs from 'fs';
import * as path from 'path';
import { formatContent } from './formatFile';

export async function writeFileSafely(filePath: string, content: string) {
    if (filePath.match(/.ts$/)) {
        // content = await formatFile(content);
        content = formatContent(content);
    }
    fs.mkdirSync(path.dirname(filePath), {
        recursive: true,
    });
    fs.writeFileSync(filePath, content);

}

export async function outputToConsole(filePath: string, content: string) {
    if (filePath.match(/.ts$/)) {
        content = await formatContent(content);
    }
    console.log(content);
}
