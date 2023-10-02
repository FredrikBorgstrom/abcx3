import { DMMF, generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { convertBooleanStrings, convertEnvStrings, initEnv, outputToConsoleAsync, StringFns, writeFileSafelyAsync } from '@shared';
import { exec } from 'child_process';
import * as fs from 'fs';
import path from 'path';
import { GENERATOR_NAME } from './constants';
import { DartGeneratorSettings } from './dart_settings.interface';
import { DartGenerator } from './generators/dart.generator';
import { DartStoreGenerator } from './generators/dart_store.generator';
import { generateDartEnum } from './generators/enum.generators';
import { dartStoreLibrary } from './stubs/stores_library.stub';

const { version } = require('../package.json');

const defaultOptions: DartGeneratorSettings = {
    AutoGeneratedWarningText: '//***  AUTO-GENERATED FILE - DO NOT MODIFY ***// ',
    active: true,
    dryRun: false,
    schemaPath: '',
    EnumPath: 'enums',
    FormatWithDart: true,
    MakeAllPropsOptional: true,
    // ModelsImplementBaseClass: true,
    // CommonSourceDirectory: 'common',
    // ModelsBaseClassFileName: 'prisma_model.dart',
};

generatorHandler({
    onManifest() {
        console.log(`${GENERATOR_NAME}:Registered`);
        initEnv();
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

        const optionsWithEnvSettings = convertEnvStrings(options.generator.config);
        const optionsWithBooleanSettings = convertBooleanStrings(optionsWithEnvSettings);
        const settings: DartGeneratorSettings = {
            ...defaultOptions,
            ...optionsWithBooleanSettings,
            ...configOverwrites,
        };

        if (settings.active === true) {
            const mainGenerator = new MainGenerator(options, settings);
            await mainGenerator.generateFiles();
        } else {
            console.log('dart generator is not active');
        }
    }
})

class MainGenerator {

    //private dartFiles: string[] = [];
    private modelFiles: Record<string, string> = {};
    private dartStoreFiles: Record<string, string> = {};

    writeFile: (path: string, content: string) => Promise<void>;
    outputPath: string;

    constructor(private options: GeneratorOptions, private settings: DartGeneratorSettings) {
        this.writeFile = settings.dryRun ? outputToConsoleAsync : writeFileSafelyAsync;
        this.outputPath = this.options.generator.output?.value as string;
    }

    async generateFiles(options = this.options, settings = this.settings) {

        this.copyCommonSourceFiles();

        for (const model of options.dmmf.datamodel.models) {
            console.log(`Processing Model ${model.name}`);
            await this.generateDartModelFile(model);
            await this.generateDartStoreFile(model);
        }

        for (const tEnum of options.dmmf.datamodel.enums) {
            console.log(`Processing Enum ${tEnum.name}`);
            await this.generateDartEnumFile(tEnum);
        }



        await this.createDartLibraryFile();
        await this.generateStoreLibraryFile();

        if (this.settings.FormatWithDart) {
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



        console.log('Done!');
    }

    /*  async writeModelBaseFile() {
         const fileName = this.settings.ModelsBaseClassFileName;
         const filePath = path.join(this.outputPath, this.settings.CommonSourceDirectory, fileName);
         const code = dartInterfacesAndModelFunctionsStub;
         await this.writeFile(filePath, code);
     } */

    async copyCommonSourceFiles() {
        console.log('Copying dart source files');
        console.log('__dirname', __dirname);
        const sourcePath = path.join(__dirname, 'dart_source');
        this.copyDirectoryAndContent(sourcePath, this.outputPath);


        /* const common_src = path.join(sourcePath, 'common');
        const common_dest =  path.join(this.outputPath, 'common');
        await this.copyDirectoryAndContent(common_src, common_dest);

        const stores_common_src = path.join(sourcePath, 'stores_common');
        const stores_common_dest =  path.join(this.outputPath, 'stores_common');
        await this.copyDirectoryAndContent(stores_common_src, stores_common_dest); */
    }

    /* async copyDirectoryAndContent(source: string, target: string) {
        
        return await fs.cp(source, target, {recursive: true}, (err) => {
            if (err) {
                console.log('Error copying dart source files', err);
                return;
            }
            console.log(`${source} was copied to ${target}`);
        });
    } */
    copyDirectoryAndContent(source: string, target: string) {
        fs.cpSync(source, target, { recursive: true, force: true });
    }


    async generateDartEnumFile(tEnum: DMMF.DatamodelEnum) {
        let content = generateDartEnum(tEnum, this.settings.AutoGeneratedWarningText);
        const fileName = `${StringFns.snakeCase(tEnum.name)}.dart`;
        const filePath = path.join(this.outputPath, 'models', fileName);
        console.log(` > Generating enum for Model ${tEnum.name}`);
        await this.writeFile(filePath, content);
        this.modelFiles[tEnum.name] = 'models/' + fileName;
    }

    async createDartLibraryFile() {
        let content = Object.keys(this.modelFiles).reduce((acc, key) => acc + `export '${this.modelFiles[key]}';\n`, "");
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
            'models',
            fileName,
        );
        this.modelFiles[model.name] = 'models/' + fileName;
        console.log(` > Generating Dart class for Model ${model.name}`);
        await this.writeFile(filePath, dartContent);
    }

    async generateDartStoreFile(model: DMMF.Model) {

        const dartStoreGenerator = new DartStoreGenerator(this.settings, model, this.options);
        const dartContent = dartStoreGenerator.generateContent();
        const fileName = `${StringFns.snakeCase(model.name)}_store.dart`;
        const filePath = path.join(
            this.outputPath,
            'stores',
            fileName,
        );
        this.dartStoreFiles[model.name] = 'stores/' + fileName;
        console.log(` > Generating Dart Store class for Model ${model.name}`);
        await this.writeFile(filePath, dartContent);
    }

    async generateStoreLibraryFile() {
        let content = dartStoreLibrary;
        let partsContent = Object.keys(this.dartStoreFiles).reduce((acc, key) => acc + `part '${this.dartStoreFiles[key]}';\n`, "");
        content = content.replace(/#{StoreParts}/g, partsContent);
        const filePath = path.join(
            this.outputPath,
            `abcx3_stores_library.dart`
        );
        await this.writeFile(filePath, content);
    }
}
