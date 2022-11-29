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
        const config = {
            ...defaultOptions,
            ...options.generator.config,
            ...configOverwrites,
        };
        let dartModelFileNames = [];
        for (const model of options.dmmf.datamodel.models) {
            console.log(`Processing Model ${model.name}`);
            let folderPath = options.generator.output?.value + '';
            folderPath = folderPath?.replace(/#{Model}/g, model.name);
            folderPath = folderPath?.replace(/#{model}/g, model.name.toLowerCase());
            folderPath = folderPath?.replace(/#{MODEL}/g, model.name.toUpperCase());
            folderPath = folderPath?.replace(/#{moDel}/g, (0, utils_1.lowerCaseFirstChar)(model.name));
            const outputBasePath = folderPath;
            // ----------------------------------------
            // generate CRUD Service
            if (config.GenerateServices === 'true') {
                console.log(` > Generating CRUD Service for Model ${model.name}`);
                const crudServiceName = `${model.name}${config.CRUDServiceSuffix}`;
                const crudServiceGenerator = new crud_service_generator_1.CrudServiceGenerator(config, model, crudServiceName);
                const crudServiceContent = await crudServiceGenerator.generateContent();
                await (0, writeFileSafely_1.writeFileSafely)(config, path.join(outputBasePath, config.CRUDServicePath, `${model.name.toLowerCase()}.crud.service.ts`), crudServiceContent);
            }
            else {
                console.log(` > Skipping Generation of CRUD Service for Model ${model.name}`);
            }
            // ----------------------------------------
            // ----------------------------------------
            // generate INPUTS
            if (config.GenerateInputs === 'true') {
                const inputGenerator = new input_generator_1.InputGenerator(config, model);
                const inputContent = await inputGenerator.generateContent();
                const filePath = path.join(outputBasePath, config.InputExportPath, `${model.name.toLowerCase()}.input.ts`);
                await (0, writeFileSafely_1.writeFileSafely)(config, filePath, inputContent);
            }
            // ----------------------------------------
            // ----------------------------------------
            // generate DART
            if (config.GenerateDart === 'true') {
                const dartGenerator = new dart_generator_1.DartGenerator(config, model);
                const dartContent = await dartGenerator.generateContent();
                const fileName = `${model.name.toLowerCase()}.dart`;
                const filePath = path.join(config.DartExportAbsolutePath, fileName);
                dartModelFileNames.push(fileName);
                // generate DART model files
                await (0, writeFileSafely_1.writeFileSafely)(config, filePath, dartContent);
            }
        }
        if (config.GenerateDart === 'true') {
            let content = dartModelFileNames.reduce((acc, val) => acc + `export './${val}';\n`, "");
            const filePath = path.join(config.DartExportAbsolutePath, `models_library.dart`);
            await (0, writeFileSafely_1.writeFileSafely)(config, filePath, content);
        }
    },
});
//# sourceMappingURL=generator.js.map