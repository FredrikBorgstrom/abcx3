import { DMMF, generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { GENERATOR_NAME } from './constants';
import { CrudServiceGenerator } from './generators/crud.service.generator';
import { GeneratorSettings } from './interfaces/generator.interface';
import { version } from './../package.json';
import { InputGenerator } from './generators/input.generator';
import { outputToConsole, writeFileSafely } from './utils/writeFileSafely';
import path = require('path');
import { lowerCaseFirstChar } from './utils/utils';
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

    EnumPath: 'enums'
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
    }
});


class MainGenerator {

    private dartFiles: string[] = [];

    private writeFile: (path: string, content: string) => void;

    constructor(private options: GeneratorOptions, private settings: GeneratorSettings) {
        this.writeFile = settings.dryRun === 'false' ? writeFileSafely : outputToConsole;
    }

    async generateFiles(options = this.options, settings = this.settings) {

        for (const model of options.dmmf.datamodel.models) {        
            console.log(`Processing Model ${model.name}`);
            if (settings.GenerateServices === 'true') {
                await this.generateCrudFile(model);
            }

            if (this.settings.GenerateInputs === 'true') {
                await this.generateInputFile(model);
            }
        }

        for (const tEnum of options.dmmf.datamodel.enums) {
            console.log(`Processing Enum ${tEnum.name}`);
            await this.generateEnumFile(tEnum);
        }
    }

    async generateEnumFile(tEnum: DMMF.DatamodelEnum) {
        let content = generateEnum(tEnum);
        let outputPath  = this.createBasePath(tEnum.name, this.options.generator.output?.value);
        const filePath = path.join(outputPath, this.settings.EnumPath, `${tEnum.name.toLowerCase()}.ts`);
        await this.writeFile(filePath, content);
    }

    

    async generateInputFile(model: DMMF.Model) {
        let basePath = this.createBasePath(model.name, this.options.generator.output?.value);
        const inputGenerator = new InputGenerator(this.settings, model);
        const inputContent = await inputGenerator.generateContent();
    
        const filePath = path.join(
            basePath,
            this.settings.InputExportPath,
            `${model.name.toLowerCase()}.input.ts`
        );
        await this.writeFile(filePath, inputContent);
    }

    async generateCrudFile(model: DMMF.Model) {
        let basePath = this.createBasePath(model.name, this.options.generator.output?.value);
        console.log(` > Generating CRUD Service for Model ${model.name}`);
        const crudServiceName = `${model.name}${this.settings.CRUDServiceSuffix}`;
        const crudServiceGenerator = new CrudServiceGenerator(
            this.settings,
            model,
            crudServiceName,
        );
        const crudServiceContent = await crudServiceGenerator.generateContent();
        const filePath = path.join(basePath, this.settings.CRUDServicePath,`${model.name.toLowerCase()}.crud.service.ts`);
        await this.writeFile(filePath, crudServiceContent);
    }

    private createBasePath(modelName: string, outputPath: string = '') {
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
}

