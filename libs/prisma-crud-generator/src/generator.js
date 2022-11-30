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
const dart_generator_1 = require("./generators/dart.generator");
const enum_generators_1 = require("./generators/enum.generators");
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
    GenerateDart: 'false',
    DartExportAbsolutePath: 'data/dart'
    // DartValidatorPackage: ''
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
    },
});
class MainGenerator {
    options;
    settings;
    dartModelFileNames = [];
    writeFile;
    constructor(options, settings) {
        this.options = options;
        this.settings = settings;
        this.writeFile = settings.dryRun === 'false' ? writeFileSafely_1.writeFileSafely : writeFileSafely_1.outputToConsole;
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
            let content = (0, enum_generators_1.generateEnum)(tEnum);
        }
        // create MODELS_LIBRARY file:
        if (settings.GenerateDart === 'true') {
            this.createDartLibraryFile();
        }
    }
    async createDartLibraryFile() {
        let content = this.dartModelFileNames.reduce((acc, val) => acc + `export './${val}';\n`, "");
        const filePath = path.join(this.settings.DartExportAbsolutePath, `models_library.dart`);
        await this.writeFile(filePath, content);
    }
    createOutputBasePath(modelName, outputPath = '') {
        let folderPath = outputPath;
        folderPath = folderPath?.replace(/#{Model}/g, modelName);
        folderPath = folderPath?.replace(/#{model}/g, modelName.toLowerCase());
        folderPath = folderPath?.replace(/#{MODEL}/g, modelName.toUpperCase());
        folderPath = folderPath?.replace(/#{moDel}/g, (0, utils_1.lowerCaseFirstChar)(modelName));
        return folderPath;
    }
    async generateDartModelFile(model) {
        const dartGenerator = new dart_generator_1.DartGenerator(this.settings, model);
        const dartContent = dartGenerator.generateContent();
        const fileName = `${model.name.toLowerCase()}.dart`;
        const filePath = path.join(this.settings.DartExportAbsolutePath, fileName);
        this.dartModelFileNames.push(fileName);
        await this.writeFile(filePath, dartContent);
    }
    async generateInputFile(model, outputBasePath) {
        const inputGenerator = new input_generator_1.InputGenerator(this.settings, model);
        const inputContent = await inputGenerator.generateContent();
        const filePath = path.join(outputBasePath, this.settings.InputExportPath, `${model.name.toLowerCase()}.input.ts`);
        await this.writeFile(filePath, inputContent);
    }
    async generateCrudFile(model, outputBasePath) {
        console.log(` > Generating CRUD Service for Model ${model.name}`);
        const crudServiceName = `${model.name}${this.settings.CRUDServiceSuffix}`;
        const crudServiceGenerator = new crud_service_generator_1.CrudServiceGenerator(this.settings, model, crudServiceName);
        const crudServiceContent = await crudServiceGenerator.generateContent();
        const filePath = path.join(outputBasePath, this.settings.CRUDServicePath, `${model.name.toLowerCase()}.crud.service.ts`);
        await this.writeFile(filePath, crudServiceContent);
    }
}
function createEnumFile(enumName) {
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
//# sourceMappingURL=generator.js.map