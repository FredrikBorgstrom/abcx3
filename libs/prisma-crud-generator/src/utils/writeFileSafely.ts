import { match } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { GeneratorInterface } from './../interfaces/generator.interface';
import { formatFile } from './formatFile';

export const writeFileSafely = async (
    config: GeneratorInterface,
    filePath: string,
    content: string,
) => {

    if (filePath.match(/.ts$/)) {
        content = await formatFile(content);
    }
    

    if (config.dryRun === 'true') {
        console.log(content);
    } else {
        fs.mkdirSync(path.dirname(filePath), {
            recursive: true,
        });
        fs.writeFileSync(filePath, content);
    }
};
