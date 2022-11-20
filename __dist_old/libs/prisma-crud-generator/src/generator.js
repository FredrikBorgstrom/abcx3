"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const generator_helper_1 = require("@prisma/generator-helper");
const constants_1 = require("./constants");
const crud_service_generator_1 = require("./generators/crud.service.generator");
const package_json_1 = require("./../package.json");
const input_generator_1 = require("./generators/input.generator");
const writeFileSafely_1 = require("./utils/writeFileSafely");
const path = require("path");
const utils_1 = require("./utils/utils");
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
    onGenerate: (options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const configOverwrites = {
            schemaPath: options.schemaPath,
        };
        const config = Object.assign(Object.assign(Object.assign({}, defaultOptions), options.generator.config), configOverwrites);
        for (const model of options.dmmf.datamodel.models) {
            console.log(`Processing Model ${model.name}`);
            let folderPath = ((_a = options.generator.output) === null || _a === void 0 ? void 0 : _a.value) + '';
            folderPath = folderPath === null || folderPath === void 0 ? void 0 : folderPath.replace(/#{Model}/g, model.name);
            folderPath = folderPath === null || folderPath === void 0 ? void 0 : folderPath.replace(/#{model}/g, model.name.toLowerCase());
            folderPath = folderPath === null || folderPath === void 0 ? void 0 : folderPath.replace(/#{MODEL}/g, model.name.toUpperCase());
            folderPath = folderPath === null || folderPath === void 0 ? void 0 : folderPath.replace(/#{moDel}/g, (0, utils_1.lowerCaseFirstChar)(model.name));
            const outputBasePath = folderPath;
            // ----------------------------------------
            // generate CRUD Service
            if (config.GenerateServices === 'true') {
                console.log(` > Generating CRUD Service for Model ${model.name}`);
                const crudServiceName = `${model.name}${config.CRUDServiceSuffix}`;
                const crudServiceGenerator = new crud_service_generator_1.CrudServiceGenerator(config, model, crudServiceName);
                const crudServiceContent = yield crudServiceGenerator.generateContent();
                yield (0, writeFileSafely_1.writeFileSafely)(config, path.join(outputBasePath, config.CRUDServicePath, `${model.name.toLowerCase()}.crud.service.ts`), crudServiceContent);
            }
            else {
                console.log(` > Skipping Generation of CRUD Service for Model ${model.name}`);
            }
            // ----------------------------------------
            // ----------------------------------------
            // generate INPUTS
            if (config.GenerateInputs === 'true') {
                const inputGenerator = new input_generator_1.InputGenerator(config, model);
                const inputContent = yield inputGenerator.generateContent();
                yield (0, writeFileSafely_1.writeFileSafely)(config, path.join(outputBasePath, config.InputExportPath, `${model.name.toLowerCase()}.input.ts`), inputContent);
            }
            // ----------------------------------------
        }
    }),
});
//# sourceMappingURL=generator.js.map