"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generator_helper_1 = require("@prisma/generator-helper");
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
const writeFileSafely_1 = require("./utils/writeFileSafely");
const enum_generators_1 = require("./generators/enum.generators");
const dart_generator_1 = require("./generators/dart.generator");
const { version } = require('../package.json');
const defaultOptions = {
    strict: 'false',
    dryRun: 'false',
    schemaPath: '',
    EnumPath: 'enums',
    GenerateDart: 'false',
    DartExportAbsolutePath: 'data/dart'
};
(0, generator_helper_1.generatorHandler)({
    onManifest() {
        return {
            version,
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
            await this.generateDartModelFile(model);
        }
        for (const tEnum of options.dmmf.datamodel.enums) {
            console.log(`Processing Enum ${tEnum.name}`);
            await this.generateDartEnumFile(tEnum);
        }
        // create MODELS_LIBRARY file:
        if (settings.GenerateDart === 'true') {
            this.createDartLibraryFile();
        }
    }
    async generateDartEnumFile(tEnum) {
        let content = (0, enum_generators_1.generateDartEnum)(tEnum);
        const fileName = `${tEnum.name.toLowerCase()}.dart`;
        const filePath = path_1.default.join(this.settings.DartExportAbsolutePath, fileName);
        await this.writeFile(filePath, content);
        this.dartFiles.push(fileName);
    }
    async createDartLibraryFile() {
        let content = this.dartFiles.reduce((acc, val) => acc + `export './${val}';\n`, "");
        const filePath = path_1.default.join(this.settings.DartExportAbsolutePath, `models_library.dart`);
        await this.writeFile(filePath, content);
    }
    async generateDartModelFile(model) {
        const dartGenerator = new dart_generator_1.DartGenerator(this.settings, model);
        const dartContent = dartGenerator.generateContent();
        const fileName = `${model.name.toLowerCase()}.dart`;
        const filePath = path_1.default.join(this.settings.DartExportAbsolutePath, fileName);
        this.dartFiles.push(fileName);
        await this.writeFile(filePath, dartContent);
    }
}
//# sourceMappingURL=generator.js.map