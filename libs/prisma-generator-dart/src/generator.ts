import { DMMF, generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { exec } from 'child_process';
import path from 'path';
import { GENERATOR_NAME } from './constants';
import { DartGenerator } from './generators/dart.generator';
import { generateDartEnum } from './generators/enum.generators';
import { DartGeneratorSettings } from './dart_settings.interface';
import { StringFns, outputToConsole, writeFileSafely, convertBooleanStrings } from '@shared';


const { version } = require('../package.json');

const defaultOptions: DartGeneratorSettings = {
    AutoGeneratedWarningText: '//***  AUTO-GENERATED FILE - DO NOT MODIFY ***// ',
    dryRun: false,
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

    const settings: DartGeneratorSettings = {
        ...defaultOptions,
        ...convertBooleanStrings(options.generator.config),
        ...configOverwrites,
    };

    console.log('hello from dart gen');
    const mainGenerator = new MainGenerator(options, settings);
    await mainGenerator.generateFiles();
  }
})

class MainGenerator {

    //private dartFiles: string[] = [];
    private dartFiles: Record<string, string> = {};

    writeFile: (path: string, content: string) => void;
    outputPath: string;

    constructor(private options: GeneratorOptions, private settings: DartGeneratorSettings) {
        this.writeFile = settings.dryRun ? outputToConsole : writeFileSafely;
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
                    console.log('dart format couldn\'t run. Make sure you have Dart installed properly by going to https://dart.dev/get-dart');
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
        let content = generateDartEnum(tEnum, this.settings.AutoGeneratedWarningText);
        const fileName = `${StringFns.snakeCase(tEnum.name)}.dart`;
        const filePath = path.join(this.outputPath, fileName);
        console.log(` > Generating enum for Model ${tEnum.name}`);
        await this.writeFile(filePath, content);
        this.dartFiles[tEnum.name] = fileName;
    }

    async createDartLibraryFile() {
        let content = Object.keys(this.dartFiles).reduce((acc, key) => acc + `export '${this.dartFiles[key]}';\n`, "");
        // let content = this.dartFiles.reduce((acc, val) => acc + `export '${val}';\n`, "");
        const filePath = path.join(
            this.outputPath,
            `models_library.dart`
        );
        await this.writeFile(filePath, content);
    }

    async generateDartModelFile(model: DMMF.Model) {
        const dartGenerator = new DartGenerator(this.settings, model);
        const dartContent = dartGenerator.generateContent();
        const fileName = `${StringFns.snakeCase(model.name)}.dart`;
        const filePath = path.join(
            this.outputPath,
            fileName,
        );
        this.dartFiles[model.name] = fileName;
        console.log(` > Generating Dart class for Model ${model.name}`);
        await this.writeFile(filePath, dartContent);
    }
}


