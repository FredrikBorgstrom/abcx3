#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const process = __importStar(require("process"));
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const path = require("path");
const fs = __importStar(require("fs"));
const warning_1 = require("./../ui/warning");
const prismerge_stub_1 = require("./../ui/prismerge.stub");
const process_1 = require("process");
const glob_1 = require("glob");
const bootstrap = () => {
    commander_1.program
        .version(require('../../package.json').version, '-v, --version', 'Output the current version.')
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
    const prisMergeContent = JSON.parse((0, fs_1.readFileSync)(inputPath, 'utf8'));
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