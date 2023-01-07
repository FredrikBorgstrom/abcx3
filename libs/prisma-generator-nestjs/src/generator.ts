import { DMMF, generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { outputToConsole, writeFileSafely } from '../../shared/src';
import { version } from './../package.json';
import { GENERATOR_NAME } from './constants';
import { ControllerGenerator } from './generators/controller.generator';
import { CrudServiceGenerator as ServiceGenerator } from './generators/crud.service.generator';
import { generateEnum } from './generators/enum.generator';
import { InputGenerator } from './generators/input.generator';
import { ModuleGenerator } from './generators/module.generator';
import { GeneratorSettings } from './interfaces/generator.interface';
import { NameGenerator } from './nameGenerator';

const defaultOptions: GeneratorSettings = {
    strict: false,
    dryRun: false,
    AutoGeneratedWarningText: '/*****    AUTO-GENERATED FILE - DO NOT MODIFY   *****/',
    schemaPath: '',
    GenerateServices: true,
    GenerateController: true,
    GenerateModule: true,
    GenerateInputs: false,
    GenerateInputSwagger: true,
    InputExportPath: 'data/inputs',
    InputSuffix: 'Input',
    InputValidatorPackage: 'class-validator',
    InputCreatePrefix: 'Create',
    InputUpdatePrefix: 'Update',
   
    CRUDAddExceptions: true,
    PrismaServiceImportPath: 'prisma/prisma.service',
    PrismaModuleName: 'PrismaModule',
    PrismaModuleImportPath: 'prisma/prisma.module',

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

    private writeFile: (path: string, content: string) => void;
    private nameGenerator: NameGenerator;

    constructor(private options: GeneratorOptions, private settings: GeneratorSettings) {
        this.writeFile = settings?.dryRun ? outputToConsole : writeFileSafely;
        this.nameGenerator = NameGenerator.singleton;
        this.nameGenerator.basePath = options.generator.output?.value || 'gen';
    }

    async generateFiles() {

        for (const model of this.options.dmmf.datamodel.models) {
            if (this.settings?.GenerateServices) await this.generateServiceFile(model);
            if (this.settings.GenerateInputs)  await this.generateInputFile(model);
            if (this.settings.GenerateController) await this.generateControllerFile(model);
            if (this.settings.GenerateModule) await this.generateModuleFile(model);
        }
        for (const tEnum of this.options.dmmf.datamodel.enums) {
            await this.generateEnumFile(tEnum);
        }
    }

    async generateEnumFile(tEnum: DMMF.DatamodelEnum) {
        let content = generateEnum(tEnum, this.settings);
        let filePath = this.nameGenerator.geFilePath(tEnum, 'enum');
        await this.writeFile(filePath, content);
    }

    async generateInputFile(model: DMMF.Model) {
        const inputGenerator = new InputGenerator(this.settings, model);
        const inputContent = await inputGenerator.generateContent();
        const filePath = this.nameGenerator.geFilePath(model, 'controller')
        await this.writeFile(filePath, inputContent);
    }

    async generateServiceFile(model: DMMF.Model) {
        console.log(` > Generating Service for Model ${model.name}`);
        const serviceGenerator = new ServiceGenerator(this.settings, model);
        const crudServiceContent = await serviceGenerator.generateContent();
        const filePath = this.nameGenerator.geFilePath(model, 'service');
        await this.writeFile(filePath, crudServiceContent);
    }

    async generateControllerFile(model: DMMF.Model) {
        const controllerGenerator = new ControllerGenerator(this.settings, model);
        const controllerContent = await controllerGenerator.generateContent();
        const filePath = this.nameGenerator.geFilePath(model, 'controller');
        await this.writeFile(filePath, controllerContent);
    }

    async generateModuleFile(model: DMMF.Model) {
        const moduleGenerator = new ModuleGenerator(model, this.settings);
        const content = moduleGenerator.generateContent();
        const filePath = this.nameGenerator.geFilePath(model, 'module');
        await this.writeFile(filePath, content);
    }
}

