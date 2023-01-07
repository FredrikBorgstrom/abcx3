import * as fs from 'fs';
import * as path from 'path';
import { format } from 'prettier';


export async function writeFileSafely(filePath: string, content: string) {
    if (filePath.match(/.ts$/)) {
        content = format(content, {useTabs: true, tabWidth: 4, parser: 'typescript'});
    }
    fs.mkdirSync(path.dirname(filePath), {
        recursive: true,
    });
    fs.writeFileSync(filePath, content);

}

export async function outputToConsole(filePath: string, content: string) {
    if (filePath.match(/.ts$/)) {
        content = await format(content, {parser: 'typescript'});
    }
    console.log(content);
}