#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const process = require("process");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const path = require("path");
const fs = require("fs");
const warning_1 = require("./../ui/warning");
const prismerge_stub_1 = require("./../ui/prismerge.stub");
const process_1 = require("process");
const glob_1 = require("glob");
const bootstrap = () => {
    commander_1.program
        .version(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../../package.json').version, '-v, --version', 'Output the current version.')
        .description('Merge all defined prisma *.schema files into one big prisma.schema file.')
        .option('-i, --input <path>', 'Path to the PrisMerge File, relative to the current working directory.', './prismerge.json')
        .option('-g, --generate', 'Generate an initial default file first.')
        .option('-eA, --excludeApps <apps...>', 'Select the apps you want to exclude from the generation process.')
        .option('-nF, --no-format', 'Format the Prisma File after generation.')
        .parse(process.argv);
    const options = commander_1.program.opts();
    const basePath = path.join(process.cwd());
    const inputPath = path.join(basePath, options.input);
    const excludeApps = options.excludeApps || [];
    // check, if we need to generate the prismerge file
    if (options.generate) {
        if (!(0, fs_1.existsSync)(inputPath)) {
            fs.writeFileSync(inputPath, JSON.stringify(prismerge_stub_1.prismergeFileStub), {
                encoding: 'utf-8',
            });
            console.log(`File ${inputPath} was successfully created; exiting PrisMerge!`);
            (0, process_1.exit)(0);
        }
        else {
            console.log(`File ${inputPath} does already exist; exiting PrisMerge!`);
            (0, process_1.exit)(1);
        }
    }
    if (!(0, fs_1.existsSync)(inputPath)) {
        console.log(`Cannot read file ${inputPath}; exiting PrisMerge!`);
        (0, process_1.exit)(1);
    }
    // now we have everything ready
    const prisMergeContent = JSON.parse((0, fs_1.readFileSync)(inputPath, 'utf8'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(prisMergeContent).forEach(([app, content]) => {
        if (excludeApps.includes(app)) {
            console.log(`Skipping app: ${app}`);
            return;
        }
        console.log(`Processing app: ${app}...`);
        const prismaSchemaInputFiles = content.inputs || [];
        const prismaSchemaFragmentFiles = content.fragments || {};
        const prismaSchemaOutputFile = content.output;
        let prismaContent = '';
        prismaContent = prismaContent + warning_1.warningString;
        prismaSchemaInputFiles.forEach((schemaEntry) => {
            const schemaFilePaths = glob_1.glob.sync(schemaEntry);
            console.log(schemaFilePaths);
            schemaFilePaths.forEach((schemaFilePath) => {
                const content = (0, fs_1.readFileSync)(schemaFilePath, 'utf8');
                prismaContent = prismaContent + content;
            });
        });
        Object.entries(prismaSchemaFragmentFiles).forEach(([key, filePath]) => {
            // find key and replace with content from value
            const content = (0, fs_1.readFileSync)(filePath, 'utf8');
            const regEx = new RegExp(`[.]{3}${key}`, 'g');
            prismaContent = prismaContent.replace(regEx, content);
        });
        (0, fs_1.writeFileSync)(prismaSchemaOutputFile, prismaContent, {
            encoding: 'utf8',
        });
        if (options.format) {
            console.log(`Formatting file ${content.output}`);
            (0, child_process_1.execSync)(`npx prisma format --schema=${prismaSchemaOutputFile}`);
        }
        console.log(`Done processing app ${app}`);
    });
};
bootstrap();
//# sourceMappingURL=prismerge.js.map