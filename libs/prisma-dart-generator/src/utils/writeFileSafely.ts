import * as fs from 'fs';
import * as path from 'path';
import { formatFile } from './formatFile';

export async function writeFileSafely(filePath: string, content: string) {
    if (filePath.match(/.ts$/)) {
        content = await formatFile(content);
    }
    fs.mkdirSync(path.dirname(filePath), {
        recursive: true,
    });
    fs.writeFileSync(filePath, content);

}

export async function outputToConsole(filePath: string, content: string) {
    if (filePath.match(/.ts$/)) {
        content = await formatFile(content);
    }
    console.log(content);
}
