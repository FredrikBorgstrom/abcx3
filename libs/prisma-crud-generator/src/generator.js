"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_helper_1 = require("@prisma/generator-helper");
const constants_1 = require("./constants");
const crud_service_generator_1 = require("./generators/crud.service.generator");
const package_json_1 = require("./../package.json");
const input_generator_1 = require("./generators/input.generator");
const writeFileSafely_1 = require("./utils/writeFileSafely");
const path = require("path");
const utils_1 = require("./utils/utils");
const enum_generator_1 = require("./generators/enum.generator");
const defaultOptions = {
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
    PrismaServiceImportPath: '@modded-prisma-utils/nestjs-prisma',
    EnumPath: 'enums'
};
(0, generator_helper_1.generatorHandler)({
    onManifest() {
        console.log(`${constants_1.GENERATOR_NAME}:Registered`);
        return {
            version: package_json_1.version,
            defaultOutput: '../generated',
            prettyName: constants_1.GENERATOR_NAME,
        };
    },
    onGenerate: async (options) => {
        const configOverwrites = {
            schemaPath: options.schemaPath,
        };
        const settings = {
            ...defaultOptions,
            ...options.generator.config,
            ...configOverwrites,
        };
        const mainGenerator = new MainGenerator(options, settings);
        await mainGenerator.generateFiles();
    }
});
class MainGenerator {
    options;
    settings;
    dartFiles = [];
    writeFile;
    constructor(options, settings) {
        this.options = options;
        this.settings = settings;
        this.writeFile = settings.dryRun === 'false' ? writeFileSafely_1.writeFileSafely : writeFileSafely_1.outputToConsole;
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
    async generateEnumFile(tEnum) {
        let content = (0, enum_generator_1.generateEnum)(tEnum);
        let outputPath = this.createBasePath(tEnum.name, this.options.generator.output?.value);
        const filePath = path.join(outputPath, this.settings.EnumPath, `${tEnum.name.toLowerCase()}.ts`);
        await this.writeFile(filePath, content);
    }
    async generateInputFile(model) {
        let basePath = this.createBasePath(model.name, this.options.generator.output?.value);
        const inputGenerator = new input_generator_1.InputGenerator(this.settings, model);
        const inputContent = await inputGenerator.generateContent();
        const filePath = path.join(basePath, this.settings.InputExportPath, `${model.name.toLowerCase()}.input.ts`);
        await this.writeFile(filePath, inputContent);
    }
    async generateCrudFile(model) {
        let basePath = this.createBasePath(model.name, this.options.generator.output?.value);
        console.log(` > Generating CRUD Service for Model ${model.name}`);
        const crudServiceName = `${model.name}${this.settings.CRUDServiceSuffix}`;
        const crudServiceGenerator = new crud_service_generator_1.CrudServiceGenerator(this.settings, model, crudServiceName);
        const crudServiceContent = await crudServiceGenerator.generateContent();
        const filePath = path.join(basePath, this.settings.CRUDServicePath, `${model.name.toLowerCase()}.crud.service.ts`);
        await this.writeFile(filePath, crudServiceContent);
    }
    createBasePath(modelName, outputPath = '') {
        let folderPath = outputPath;
        folderPath = folderPath?.replace(/#{Model}/g, modelName);
        folderPath = folderPath?.replace(/#{model}/g, modelName.toLowerCase());
        folderPath = folderPath?.replace(/#{MODEL}/g, modelName.toUpperCase());
        folderPath = folderPath?.replace(/#{moDel}/g, (0, utils_1.lowerCaseFirstChar)(modelName));
        return folderPath;
    }
}
//# sourceMappingURL=generator.js.map