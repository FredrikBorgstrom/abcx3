import { DMMF, generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { GENERATOR_NAME } from './constants';
import { CrudServiceGenerator } from './generators/crud.service.generator';
import { GeneratorInterface as GeneratorSettings } from './interfaces/generator.interface';
import { version } from './../package.json';
import { InputGenerator } from './generators/input.generator';
import { outputToConsole, writeFileSafely } from './utils/writeFileSafely';
import path = require('path');
import { lowerCaseFirstChar } from './utils/utils';
import { DartGenerator } from './generators/dart.generator';
import { generateEnum } from './generators/enum.generators';

const defaultOptions: GeneratorSettings = {
    strict: 'false',
    dryRun: 'false',

    schemaPath: '',

    GenerateInputs: 'true',
    GenerateInputSwagger: 'true',
    InputExportPath: 'data/inputs',
    InputSuffix: 'Input',
    InputValidatorPackage: 'class-validator',

    InputParentClass: undefined,
    InputParentClassPath: undefined,

    InputCreatePrefix: 'Create',
    InputUpdatePrefix: 'Update',

    GenerateServices: 'true',
    CRUDServicePath: 'services',
    CRUDServiceSuffix: 'CrudService',
    CRUDStubFile: undefined,
    CRUDAddExceptions: 'true',

    GenerateDart: 'false',
    DartExportAbsolutePath: 'data/dart'
    // DartValidatorPackage: ''
};

generatorHandler({
    onManifest() {
        console.log(`${GENERATOR_NAME}:Registered`);
        return {
            version,
            defaultOutput: '../generated',
            prettyName: GENERATOR_NAME,
        };
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

        const mainGenerator = new MainGenerator(options, settings);
        await mainGenerator.generateFiles();
    },
});


class MainGenerator {

    private dartModelFileNames: string[] = [];

    private writeFile: (path: string, content: string) => void;

    constructor(private options: GeneratorOptions, private settings: GeneratorSettings) {
        this.writeFile = settings.dryRun === 'false' ? writeFileSafely : outputToConsole;
    }

    async generateFiles(options = this.options, settings = this.settings) {


        for (const model of options.dmmf.datamodel.models) {
            console.log(`Processing Model ${model.name}`);

            const outputBasePath = this.createOutputBasePath(model.name, options.generator.output?.value);

            if (settings.GenerateServices === 'true') {
                await this.generateCrudFile(model, outputBasePath);
            }

            if (this.settings.GenerateInputs === 'true') {
                await this.generateInputFile(model, outputBasePath);
            }

            if (settings.GenerateDart === 'true') {
                await this.generateDartModelFile(model);
            }
        }

        for (const tEnum of options.dmmf.datamodel.enums) {
            let content = generateEnum(tEnum);
        }

        // create MODELS_LIBRARY file:
        if (settings.GenerateDart === 'true') {
            this.createDartLibraryFile();
        }
    }

    async createDartLibraryFile() {
        let content = this.dartModelFileNames.reduce((acc, val) => acc + `export './${val}';\n`, "");
        const filePath = path.join(
            this.settings.DartExportAbsolutePath,
            `models_library.dart`
        );
        await this.writeFile(filePath, content);
    }

    createOutputBasePath(modelName: string, outputPath: string = '') {
        let folderPath = outputPath;
        folderPath = folderPath?.replace(/#{Model}/g, modelName);
        folderPath = folderPath?.replace(/#{model}/g, modelName.toLowerCase());
        folderPath = folderPath?.replace(/#{MODEL}/g, modelName.toUpperCase());
        folderPath = folderPath?.replace(
            /#{moDel}/g,
            lowerCaseFirstChar(modelName),
        );
        return folderPath;
    }

    async generateDartModelFile(model: DMMF.Model) {
        const dartGenerator = new DartGenerator(this.settings, model);
        const dartContent = dartGenerator.generateContent();
        const fileName = `${model.name.toLowerCase()}.dart`;
        const filePath = path.join(
            this.settings.DartExportAbsolutePath,
            fileName,
        );
        this.dartModelFileNames.push(fileName);
        await this.writeFile(filePath, dartContent);
    }

    async generateInputFile(model: DMMF.Model, outputBasePath: string) {
        const inputGenerator = new InputGenerator(this.settings, model);
        const inputContent = await inputGenerator.generateContent();
    
        const filePath = path.join(
            outputBasePath,
            this.settings.InputExportPath,
            `${model.name.toLowerCase()}.input.ts`
        );
        await this.writeFile(filePath, inputContent);
    }

    async generateCrudFile(model: DMMF.Model, outputBasePath: string) {
        console.log(` > Generating CRUD Service for Model ${model.name}`);
        const crudServiceName = `${model.name}${this.settings.CRUDServiceSuffix}`;
        const crudServiceGenerator = new CrudServiceGenerator(
            this.settings,
            model,
            crudServiceName,
        );
        const crudServiceContent = await crudServiceGenerator.generateContent();
        const filePath = path.join(outputBasePath, this.settings.CRUDServicePath,`${model.name.toLowerCase()}.crud.service.ts`);
        await this.writeFile(filePath, crudServiceContent);
    }
}

function createEnumFile(enumName: string) {

}
/* 
function createOutputBasePath(modelName: string, outputPath: string = '') {
    let folderPath = outputPath;
    folderPath = folderPath?.replace(/#{Model}/g, modelName);
    folderPath = folderPath?.replace(/#{model}/g, modelName.toLowerCase());
    folderPath = folderPath?.replace(/#{MODEL}/g, modelName.toUpperCase());
    folderPath = folderPath?.replace(
        /#{moDel}/g,
        lowerCaseFirstChar(modelName),
    );
    return folderPath;
}


async function generateDartModelFile(config: GeneratorSettings, model: DMMF.Model, dartModelFileNames: string[]) {
    const dartGenerator = new DartGenerator(config, model);
    const dartContent = dartGenerator.generateContent();
    const fileName = `${model.name.toLowerCase()}.dart`;
    const filePath = path.join(
        config.DartExportAbsolutePath,
        fileName,
    );
    dartModelFileNames.push(fileName);
    await writeFileSafely(
        config,
        filePath,
        dartContent
    );
}


async function generateInputFile(config: GeneratorSettings, model: DMMF.Model, outputBasePath: string) {
    const inputGenerator = new InputGenerator(config, model);
    const inputContent = await inputGenerator.generateContent();

    const filePath = path.join(
        outputBasePath,
        config.InputExportPath,
        `${model.name.toLowerCase()}.input.ts`
    );

    await writeFileSafely(
        config,
        filePath,
        inputContent,
    );
}

async function generateCrudFile(config: GeneratorSettings, model: DMMF.Model, outputBasePath: string) {
    console.log(` > Generating CRUD Service for Model ${model.name}`);
    const crudServiceName = `${model.name}${config.CRUDServiceSuffix}`;
    const crudServiceGenerator = new CrudServiceGenerator(
        config,
        model,
        crudServiceName,
    );
    const crudServiceContent = await crudServiceGenerator.generateContent();

    await writeFileSafely(
        config,
        path.join(
            outputBasePath,
            config.CRUDServicePath,
            `${model.name.toLowerCase()}.crud.service.ts`,
        ),
        crudServiceContent,
    );
} */