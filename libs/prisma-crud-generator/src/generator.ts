import { DMMF, generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { GENERATOR_NAME } from './constants';
import { CrudServiceGenerator as ServiceGenerator } from './generators/crud.service.generator';
import { GeneratorSettings } from './interfaces/generator.interface';
import { version } from './../package.json';
import { InputGenerator } from './generators/input.generator';
import { outputToConsole, writeFileSafely } from './utils/writeFileSafely';
import path = require('path');
import { lowerCaseFirstChar, upperCaseFirstChar } from './utils/utils';
import { generateEnum } from './generators/enum.generator';
import { ControllerGenerator } from './generators/controller.generator';
import { ModuleGenerator } from './generators/module.generator';
import { NameGenerator } from './nameGenerator';

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
    GenerateController: 'true',
    GenerateModule: 'true',
    ServiceSuffix: 'Service',
    CRUDStubFile: undefined,
    CRUDAddExceptions: 'true',
    PrismaServiceImportPath: '@modded-prisma-utils/nestjs-prisma',

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
    private nameGenerator: NameGenerator;

    constructor(private options: GeneratorOptions, private settings: GeneratorSettings) {
        this.writeFile = settings.dryRun === 'false' ? writeFileSafely : outputToConsole;
        this.nameGenerator = new NameGenerator(options.generator.output?.value || 'gen');
    }

    getServiceClassName = (model: DMMF.Model) => `${model.name}${this.settings.ServiceSuffix}`;
    getServiceFileName = (model: DMMF.Model) => `${lowerCaseFirstChar(model.name)}.service`;
    getServiceFilePath = (model: DMMF.Model) => path.join(this.getModelPath(model.name), this.getServiceFileName(model) + '.ts');
    getControllerName = (model: DMMF.Model) => `${model.name}Controller`;
    getControllerFileName = (model: DMMF.Model) => `${lowerCaseFirstChar(model.name)}.controller`;
    getModuleName = (model: DMMF.Model) => `${model.name}Module`;

    

    async generateFiles(options = this.options, settings = this.settings) {

        for (const model of options.dmmf.datamodel.models) {        
            console.log(`Processing Model ${model.name}`);
            if (settings.GenerateServices === 'true') {
                await this.generateCrudFile(model);
            }

            if (this.settings.GenerateInputs === 'true') {
                await this.generateInputFile(model);
            }

            if (this.settings.GenerateController?.toLowerCase() === 'true') {
                await this.generateControllerFile(model);
            }
        }

        for (const tEnum of options.dmmf.datamodel.enums) {
            console.log(`Processing Enum ${tEnum.name}`);
            await this.generateEnumFile(tEnum);
        }
    }

    async generateEnumFile(tEnum: DMMF.DatamodelEnum) {
        let content = generateEnum(tEnum);
        let outputPath  = this.getModelPath(tEnum.name);
        const filePath = path.join(outputPath, this.settings.EnumPath, `${tEnum.name.toLowerCase()}.ts`);
        await this.writeFile(filePath, content);
    }

    async generateInputFile(model: DMMF.Model) {
        let basePath = this.getModelPath(model.name);
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
        console.log(` > Generating CRUD Service for Model ${model.name}`);
        const serviceName = this.getServiceClassName(model);
        const serviceGenerator = new ServiceGenerator(
            this.settings,
            model,
            serviceName,
        );
        const crudServiceContent = await serviceGenerator.generateContent();
        const filePath = this.getServiceFilePath(model);
        await this.writeFile(filePath, crudServiceContent);
    }

    async generateControllerFile(model: DMMF.Model) {
        const controllerClassName = this.getControllerName(model);
        const controllerGenerator = new ControllerGenerator(
            this.settings,
            model,
            controllerClassName,
            this.getServiceClassName(model),
            this.getServiceFileName(model)
        );
        const controllerContent = await controllerGenerator.generateContent();
        const filePath = path.join(this.getModelPath(model.name), `${lowerCaseFirstChar(model.name)}.controller.ts`);
        await this.writeFile(filePath, controllerContent);
    }

    async generateModuleFile(model: DMMF.Model) {
        const moduleName = this.getControllerName(model);
        const moduleGenerator = new ModuleGenerator({
            model,
            settings: this.settings,
            moduleName: this.getModuleName(model),
            serviceName: this.getServiceClassName(model),
            serviceFileName: this.getServiceFileName(model)
        });
        const content = await moduleGenerator.generateContent();
        const filePath = path.join(this.getModelPath(model.name), `${lowerCaseFirstChar(model.name)}.module.ts`);
        await this.writeFile(filePath, content);
    }


    private getModelPath(modelName: string) {
        let tPath = this.options.generator.output?.value;
        tPath = tPath?.replace(/#{Model}/g, modelName);
        tPath = tPath?.replace(/#{model}/g, modelName.toLowerCase());
        tPath = tPath?.replace(/#{MODEL}/g, modelName.toUpperCase());
        tPath = tPath?.replace(/#{moDel}/g,lowerCaseFirstChar(modelName));
        return tPath || '';
    }
}

