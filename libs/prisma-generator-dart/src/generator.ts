import { DMMF, generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { exec } from 'child_process';
import path from 'path';
import { GENERATOR_NAME } from './constants';
import { DartGenerator } from './generators/dart.generator';
import { generateDartEnum } from './generators/enum.generators';
import { GeneratorSettings } from './settings.interface';

import { StringFns } from '../../shared/src/stringFns';
import { outputToConsole, writeFileSafely } from '../../shared/src/writeFileSafely';

// import {w} from '@prisma-tools/shared';

const { version } = require('../package.json');

const defaultOptions: GeneratorSettings = {
    dryRun: 'false',
    schemaPath: '',
    EnumPath: 'enums',
    FormatWithDart: 'true',
    makeAllPropsOptional: 'true'
};

generatorHandler({
  onManifest() {
    console.log(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    }
  },
  onGenerate: async (options: GeneratorOptions) => {
    const configOverwrites = {
        schemaPath: options.schemaPath,
    };

    const settings: GeneratorSettings = {
        ...defaultOptions,
        ...options.generator.config,
        ...configOverwrites,
    };

    console.log('hello from dart gen');
    const mainGenerator = new MainGenerator(options, settings);
    await mainGenerator.generateFiles();
  }
})

class MainGenerator {

    private dartFiles: string[] = [];

    writeFile: (path: string, content: string) => void;
    outputPath: string;

    constructor(private options: GeneratorOptions, private settings: GeneratorSettings) {
        this.writeFile = settings.dryRun === 'false' ? writeFileSafely : outputToConsole;
        this.outputPath = this.options.generator.output?.value as string;
    }

    async generateFiles(options = this.options, settings = this.settings) {

        for (const model of options.dmmf.datamodel.models) {        
            console.log(`Processing Model ${model.name}`); 
            await this.generateDartModelFile(model);
        }

        for (const tEnum of options.dmmf.datamodel.enums) {
            console.log(`Processing Enum ${tEnum.name}`);
            await this.generateDartEnumFile(tEnum);
        }
        await this.createDartLibraryFile();
        if (this.settings.FormatWithDart === 'true') {
            const outputPath = options.generator.output?.value;
            exec(`dart format "${outputPath}"`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        }
    }

    async generateDartEnumFile(tEnum: DMMF.DatamodelEnum) {
        let content = generateDartEnum(tEnum);
        const fileName = `${StringFns.decapitalizeFileName(tEnum.name, 'dart')}`;
        const filePath = path.join(this.outputPath, fileName);
        console.log(` > Generating enum for Model ${tEnum.name}`);
        await this.writeFile(filePath, content);
        this.dartFiles.push(fileName);
    }

    async createDartLibraryFile() {
        let content = this.dartFiles.reduce((acc, val) => acc + `export '${val}';\n`, "");
        const filePath = path.join(
            this.outputPath,
            `models_library.dart`
        );
        await this.writeFile(filePath, content);
    }

    async generateDartModelFile(model: DMMF.Model) {
        const dartGenerator = new DartGenerator(this.settings, model);
        const dartContent = dartGenerator.generateContent();
        const fileName = `${StringFns.decapitalizeFileName(model.name, 'dart')}`;
        const filePath = path.join(
            this.outputPath,
            fileName,
        );
        this.dartFiles.push(fileName);
        console.log(` > Generating Dart class for Model ${model.name}`);
        await this.writeFile(filePath, dartContent);
    }
}


