import * as fs from 'fs';
import * as path from 'path';

export async function writeFileSafelyAsync(filePath: string, content: string): Promise<void> {
    try {
        await fs.promises.mkdir(path.dirname(filePath), {recursive: true});
        return await fs.promises.writeFile(filePath, content);
    } catch (err) {
        console.log(`Error writing file ${filePath}: ${err}`);
    }
}

export async function outputToConsoleAsync(filePath: string, content: string): Promise<void> {
    console.log(`Dryrun prevented writing the following content to file ${filePath}:`);
    console.log(content);
    return Promise.resolve();
}

export function writeFileSafely(filePath: string, content: string): void {
    try {
        fs.mkdirSync(path.dirname(filePath), {
            recursive: true,
        });
        fs.writeFileSync(filePath, content);
    } catch (err) {
        console.log(`Error writing file ${filePath}: ${err}`);
    }
}

export function outputToConsole(filePath: string, content: string): void {
    console.log(`Dryrun prevented writing the following content to file ${filePath}:`);
    console.log(content);
}

export async function copyCommonSourceFiles(sourcePath: string, destPath: string) {
    const fullSourcePath = path.join(__dirname, sourcePath);
    console.log(`Copying directory and content of ${fullSourcePath} to ${destPath}`);
    copyDirectoryAndContent(fullSourcePath, destPath);
}

function copyDirectoryAndContent(source: string, target: string) {
    fs.cpSync(source, target, { recursive: true, force: true });
}