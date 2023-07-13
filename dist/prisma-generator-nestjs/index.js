"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// libs/prisma-generator-nestjs/src/generator.ts
var import_generator_helper = require("@prisma/generator-helper");

// libs/prisma-generator-nestjs/package.json
var version = "1.0.0";

// libs/prisma-generator-nestjs/src/constants.ts
var GENERATOR_NAME = "prisma-generator-nestjs";

// libs/shared/src/writeFileSafely.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
async function writeFileSafely(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), {
    recursive: true
  });
  fs.writeFileSync(filePath, content);
}
async function outputToConsole(filePath, content) {
  console.log(content);
}

// libs/shared/src/stringFns.ts
var StringFns = class {
  static decapitalizeFileName(name, fileType) {
    return this.decapitalize(name) + "." + fileType;
  }
  static decapitalize(str) {
    return this.transformFirstCharCase(str, "toLowerCase");
  }
  static capitalize(str) {
    return this.transformFirstCharCase(str, "toUpperCase");
  }
  static transformFirstCharCase(str, fnName) {
    if (str == null || str.length === 0) {
      return "";
    } else {
      const firstChar = fnName === "toLowerCase" ? str[0].toLowerCase() : str[0].toUpperCase();
      return firstChar + str.substring(1);
    }
  }
  static snakeCase(str) {
    return str[0].toLowerCase() + str.substring(1).replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
  static snakeToCamelCase(str) {
    return str[0].toLowerCase() + str.substring(1).replace(/_[A-Z]/g, (letter) => `_${letter[1].toLowerCase()}`);
  }
};

// libs/shared/src/prisma.helper.ts
var PrismaTypeScriptTypeMap = {
  BigInt: "BigInt",
  Boolean: "boolean",
  Bytes: "Buffer",
  DateTime: "Date",
  Decimal: "number",
  Float: "number",
  Int: "number",
  Json: "object",
  String: "string"
};
var PrismaHelper = class _PrismaHelper {
  static instance;
  static getInstance() {
    if (_PrismaHelper.instance) {
      return _PrismaHelper.instance;
    }
    _PrismaHelper.instance = new _PrismaHelper();
    return _PrismaHelper.instance;
  }
  convertToTypescriptType(field) {
    let tsType = PrismaTypeScriptTypeMap[field.type];
    return tsType != null ? tsType : field.type;
  }
  getIdFieldNameAndType(model) {
    const idField = model.fields.find((field) => field.isId === true);
    if (idField) {
      return this.getFieldNameAndType(idField);
    } else {
      return null;
    }
  }
  getFieldNameAndType(field) {
    return {
      name: field.name,
      type: this.convertToTypescriptType(field)
    };
  }
  getReferingField(model, referedField) {
  }
  modelContainsObjectReference = (model) => model.fields.some((field) => field.kind === "object");
  getReferenceFields = (model) => model.fields.filter((field) => field.kind === "object");
  getUniqueReferenceFields = (model) => model.fields.reduce((acc, field) => {
    if (field.kind === "object" && !acc.some((f) => f.type === field.type))
      acc.push(field);
    return acc;
  }, []);
  //(field => field.kind === 'object');
  getUniqueInputPropertyName(model) {
    const primaryKey = model.primaryKey;
    if (primaryKey?.fields) {
      let compoundName = primaryKey.fields.reduce((acc, fieldName) => acc + "_" + fieldName, "");
      compoundName = compoundName.substring(1);
      return compoundName;
    } else {
      return null;
    }
  }
  getUniqueInputType(model) {
    const primaryKey = model.primaryKey;
    if (primaryKey?.fields) {
      let compoundName = primaryKey.fields.reduce((acc, fieldName) => acc + StringFns.capitalize(fieldName), "");
      return compoundName;
    } else {
      return null;
    }
  }
  parseDocumentation(field) {
    let documentation = field.documentation || "";
    documentation = documentation.replace(/(\r\n|\n|\r)/gm, " ");
    const comments = documentation.split(" ");
    const result = [];
    for (const comment of comments) {
      const argIndex = comment.indexOf("(");
      const argument = comment.substring(
        argIndex + 1,
        comment.lastIndexOf(")")
      );
      const directiveName = comment.substring(0, argIndex);
      const decorator = { name: directiveName, argument };
      result.push(decorator);
    }
    return result;
  }
};

// libs/shared/src/utils.ts
function convertBooleanStrings(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = convertBooleanString(obj[key]);
  }
  return result;
}
function convertBooleanString(value) {
  switch (value.toLowerCase()) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return value;
  }
}

// libs/prisma-generator-nestjs/src/nameGenerator.ts
var path2 = require("path");
var NameGenerator = class _NameGenerator {
  static _singleton;
  basePath = "gen";
  prefix = "";
  static get singleton() {
    if (!_NameGenerator._singleton) {
      _NameGenerator._singleton = new _NameGenerator();
    }
    return _NameGenerator._singleton;
  }
  constructor() {
  }
  getClassName = (model, fileType) => StringFns.capitalize(this.prefix) + model.name + StringFns.capitalize(fileType);
  getFileName = (model, fileType) => this.prefix !== "" ? StringFns.snakeCase(this.prefix) + "_" + StringFns.snakeCase(model.name) + "." + fileType : StringFns.snakeCase(model.name) + "." + fileType;
  // StringFns.decapitalizeFileName(model.name, fileType);
  geFilePath = (model, fileType) => path2.join(this.basePath, this.getModelPath(model), this.getFileName(model, fileType) + ".ts");
  getModelPath = (model) => StringFns.decapitalize(model.name);
};

// libs/prisma-generator-nestjs/src/stubs/controller.stub.ts
var controllerStub = `
#{AutoGeneratedWarningText}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, } from '@nestjs/common';
import { #{ServiceName} } from './#{CrudServiceFileName}';
#{ImportGuardClass}

@Controller('#{model}')
export class #{ControllerClassName}<T extends #{ServiceName}> {
  constructor(protected readonly service: T) {}

#{getAll}

#{getByFieldValues}

// #{create}

// #{getFilteredPage}

// #{getUnique}
 
// #{update}
  
// #{getById}

// #{updateById}

// #{deleteById}

// #{referenceField}
  
}`;
var controllerGetByFieldValuesStub = `
#{GuardDecorator}
    @Get('by#{FieldNameCapitalized}/:#{fieldName}')
    getBy#{FieldNameCapitalized}(@Req() req, @Param('#{fieldName}') #{fieldName}: string) {
        return this.service.getByFieldValues({#{fieldName}: #{convertToInt}#{fieldName}});
    }
`;
var controllerGetManyByFieldValuesStub = `
#{GuardDecorator}
    @Get('by#{FieldNameCapitalized}/:#{fieldName}')
    getBy#{FieldNameCapitalized}(@Req() req, @Param('#{fieldName}') #{fieldName}: string) {
        return this.service.getManyByFieldValues({#{fieldName}: #{convertToInt}#{fieldName}});
    }
`;
var controllerGetAllStub = `
#{GuardDecorator}
@Get()
getAll() {
  return this.service.getAll();
}
`;
var controllerReferenceFieldStub = `
#{GuardDecorator}
  @Post('#{RelationFieldName}')
  get#{RelationFieldNameCapitalized}(@Body() body: Prisma.#{Model}WhereUniqueInput) {
    return this.service.get#{RelationFieldNameCapitalized}(body);
  }
`;
var controllerMethodStubs = {
  getAll: controllerGetAllStub
  // getByFieldValues: controllerGetByFieldValuesStub,
  // getManyByFieldValues: controllerGetManyByFieldValuesStub,
  // create: controllerCreateStub,
  // getFilteredPage: controllergetFilteredPageStub,
  // getUnique: controllerGetUniqueStub,
  // update: controllerUpdateStub,
  // getById: controllerGetByIdStub,
  // updateById: controllerUpdateByIdStub,
  // deleteById: controllerDeleteByIdStub,
  // referenceField: controllerReferenceFieldStub
};
var controllerMethodNames = Object.keys(controllerMethodStubs);

// libs/prisma-generator-nestjs/src/generators/controller.generator.ts
var ControllerGenerator = class {
  constructor(settings, model) {
    this.settings = settings;
    this.model = model;
    this.prismaHelper = PrismaHelper.getInstance();
  }
  prismaHelper;
  methodStubs = controllerMethodStubs;
  async generateContent() {
    let nameGen = NameGenerator.singleton;
    let content = controllerStub;
    content = content.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);
    const idFieldAndType = PrismaHelper.getInstance().getIdFieldNameAndType(this.model);
    const commentDirectives = this.prismaHelper.parseDocumentation(this.model);
    const methodsToApply = this.getMethodsToApply(commentDirectives);
    content = this.applyMethods(content, methodsToApply, idFieldAndType);
    content = content.replace(/#{ControllerClassName}/g, nameGen.getClassName(this.model, "controller"));
    content = content.replace(/#{Model}/g, this.model.name);
    content = content.replace(/#{model}/g, this.model.name.toLowerCase());
    content = content.replace(/#{moDel}/g, StringFns.decapitalize(this.model.name));
    content = content.replace(/#{ServiceName}/g, nameGen.getClassName(this.model, "service"));
    content = content.replace(/#{CrudServiceFileName}/g, nameGen.getFileName(this.model, "service"));
    content = content.replace(/#{getByFieldValues}/g, this.createFieldRoutes());
    let guardImportContent, guardsContent;
    if (this.settings?.GuardClass) {
      guardImportContent = `import {${this.settings.GuardClass}} from '${this.settings.GuardImportPath}';`;
      guardsContent = `@UseGuards(${this.settings.GuardClass})`;
    } else {
      guardImportContent = "";
      guardsContent = "";
    }
    content = content.replace(/#{ImportGuardClass}/g, guardImportContent);
    content = content.replace(/#{GuardDecorator}/g, guardsContent);
    return content;
  }
  createFieldRoutes() {
    let code = "";
    this.model.fields.forEach((field) => {
      if (field.kind != "object") {
        let content = field.isUnique || field.isId ? controllerGetByFieldValuesStub : controllerGetManyByFieldValuesStub;
        content = content.replace(/#{GuardDecorator}/g, this.settings?.GuardClass ? `@UseGuards(${this.settings.GuardClass})` : "");
        const tsType = this.prismaHelper.convertToTypescriptType(field);
        content = content.replace(/#{convertToInt}/g, tsType === "number" ? "+" : "");
        content = content.replace(/#{FieldType}/g, tsType);
        content = content.replace(/#{fieldName}/g, field.name);
        content = content.replace(/#{FieldNameCapitalized}/g, StringFns.capitalize(field.name));
        code += content + "\n\n";
      }
    });
    return code;
  }
  addReferenceFieldMethods() {
    let code = "";
    const referenceFields = this.prismaHelper.getReferenceFields(this.model);
    referenceFields.forEach((field) => {
      let stub = controllerReferenceFieldStub;
      stub = stub.replace(/#{RelationMethodReturnType}/g, field.isList ? `${field.type}[]` : field.type);
      stub = stub.replace(/#{RelationFieldType}/g, field.type);
      stub = stub.replace(/#{RelationFieldName}/g, field.name);
      stub = stub.replace(/#{RelationFieldNameCapitalized}/g, StringFns.capitalize(field.name));
      code += stub;
    });
    return code;
  }
  applyMethods(content, methodNames, idFieldAndType) {
    methodNames.forEach((methodName) => {
      let methodStub = this.methodStubs[methodName];
      if (methodName.includes("ById")) {
        if (idFieldAndType) {
          methodStub = methodStub.replace(/#{convertToInt}/g, idFieldAndType.type === "number" ? "+" : "");
        } else {
          methodStub = "";
        }
      }
      if (methodName === "referenceField") {
        methodStub = this.addReferenceFieldMethods();
      }
      content = content.replace(new RegExp(`#{${methodName}}`, "g"), methodStub);
    });
    const allMethodNames = [...controllerMethodNames];
    allMethodNames.forEach((method) => content = content.replace(new RegExp(`#{${method}}`, "g"), ""));
    return content;
  }
  getMethodsToApply(commentDirectives) {
    const methodNames = [...controllerMethodNames];
    const appliedMethodNames = [...methodNames];
    commentDirectives.forEach((directive) => {
      if (directive.name === "@abcx3_disableControllers") {
        const disabledMethods = directive.argument?.split(",");
        disabledMethods?.forEach((methodName) => {
          const idx = appliedMethodNames.indexOf(methodName);
          if (idx > -1) {
            appliedMethodNames.splice(idx, 1);
          }
        });
      } else if (false) {
      } else {
      }
    });
    return appliedMethodNames;
  }
};

// libs/prisma-generator-nestjs/src/stubs/service.stub.ts
var ServiceStub = `
#{AutoGeneratedWarningText}

import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, #{Model} #{RelatedFieldTypesImport} } from '@prisma/client';
import {
    PaginationInterface,
    PrismaService,
} from '#{PrismaServiceImportPath}';
#{NeverthrowImport}

@Injectable()
export class #{ServiceClassName} {
    constructor(protected readonly prismaService: PrismaService) {}

    async getAll(): Promise<#{Model}[] | Error> {
        try {
            const result = await this.prismaService.#{moDel}.findMany();
            return result;
        } catch (e) {
            return new InternalServerErrorException(
                \`Could not get all #{Model}.\`
            );
        }
    }

    async getByFieldValues(fieldsAndValues: Record<string, number | string>): Promise<#{Model} | Error> {
        try {
            const result = await this.prismaService.#{moDel}.findFirst({
                where: fieldsAndValues
            });
            return result;
        } catch (e) {
            return new InternalServerErrorException(
                \`Could not get one #{Model} by \${this.printObject(fieldsAndValues)}}\`
            );
        }
    }

    async getManyByFieldValues(fieldsAndValues: Record<string, number | string>): Promise<#{Model}[] | Error> {
        try {
            const result = await this.prismaService.#{moDel}.findMany({
                where: fieldsAndValues
            });
            return result;
        } catch (e) {
            return new InternalServerErrorException(
                \`Could not get any #{Model} by \${this.printObject(fieldsAndValues)}}\`
            );
        }
    }

    // get by id methods

    #{byIdMethods}

    // relation fields methods

    #{relationFieldMethods}

    printObject = (obj: any) => JSON.stringify(obj, null, 2);

}
`;
var NeverthrowImport = `import { err, ok, Result } from 'neverthrow';`;
var crudRelationFieldStub = `
async get#{RelationFieldNameCapitalized}(where: Prisma.#{Model}WhereUniqueInput): Promise<#{RelationMethodReturnType} | Error> {
    try {
        const result = await this.prismaService.#{moDel}.findUnique({
            where,
            include: { #{RelationFieldName} : true },
        });
        return result.#{RelationFieldName};
    } catch (e) {
        return new InternalServerErrorException(\`Could not get #{RelationFieldName} for #{Model}\`);
    }
}
`;
var idMethods_neverThrow = `
async getById(#{idName}: #{idType}): Promise<#{Model} | Error> {
    try {
    const result = await this.prismaService.#{moDel}.findUniqueOrThrow({
        where: { #{idName} }
    });
    return result;
    } catch(e) {
    return new NotFoundException(\`#{Model} Resource \${id} was not found\`);
    }
}

async updateById(#{idName}: #{idType}, data: Prisma.#{Model}UpdateInput): Promise<#{Model} | Error> {
    try {
        const result = await this.prismaService.#{moDel}.update({
            where: { #{idName} },
            data: data,
        });
        return result;
    } catch (e) {
        return new InternalServerErrorException(\`Could not update #{Model} Resource \${#{idName}}\`);
    }
}

async deleteById(#{idName}: #{idType}): Promise<#{Model} | Error> {
    try {
        const result = await this.prismaService.#{moDel}.delete({ where: { #{idName} } });
        return result;
    } catch (e) {
        return new InternalServerErrorException(\`Could not delete #{Model} Resource \${#{idName}}\`);
    }
}
`;

// libs/prisma-generator-nestjs/src/generators/service.generator.ts
var path3 = __toESM(require("path"));
var import_fs = require("fs");
var ServiceGenerator = class {
  constructor(settings, model) {
    this.settings = settings;
    this.model = model;
    this.prismaHelper = PrismaHelper.getInstance();
  }
  prismaHelper;
  async generateContent() {
    let nameGen = NameGenerator.singleton;
    let code = ServiceStub;
    code = code.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);
    code = code.replace(/#{ServiceClassName}/g, nameGen.getClassName(this.model, "service"));
    if (this.settings.CRUDStubFile) {
      const stubFullPath = path3.join(this.settings.schemaPath, this.settings.CRUDStubFile);
      const customStub = await import_fs.promises.readFile(stubFullPath, { encoding: "utf-8" });
      code = customStub.toString();
    }
    code = code.replace(/#{PrismaServiceImportPath}/g, this.settings.PrismaServiceImportPath);
    code = code.replace(/#{byIdMethods}/g, this.addIdFieldMethods());
    code = code.replace(/#{relationFieldMethods}/g, this.addReferenceFieldMethods());
    code = code.replace(/#{RelatedFieldTypesImport}/g, this.addReferenceFieldImports());
    if (this.settings.WrapWithNeverthrow) {
      code = code.replace(/#{NeverthrowImport}/g, NeverthrowImport);
      code = this.addNeverthrow(code);
    } else {
      code = code.replace(/#{NeverthrowImport}/g, "");
    }
    code = code.replace(/#{Model}/g, this.model.name);
    code = code.replace(/#{MODEL}/g, this.model.name.toUpperCase());
    code = code.replace(/#{model}/g, this.model.name.toLowerCase());
    code = code.replace(/#{moDel}/g, StringFns.decapitalize(this.model.name));
    return code;
  }
  addNeverthrow(code) {
    code = code.replace(
      /Promise<.*>/g,
      (str) => `Promise<Result<${str.substring(8, str.length - 8)}, Error>>`
    );
    code = code.replace(
      /return result.*(?=;)/g,
      (str) => `return ok(${str.substring(7)});`
    );
    code = code.replace(
      /new .*Exception\(.*(?=\))/g,
      (str) => `err(new ${str.substring(4)})`
    );
    return code;
  }
  addReferenceFieldMethods() {
    let code = "";
    const referenceFields = this.prismaHelper.getReferenceFields(this.model);
    referenceFields.forEach((field) => {
      let stub = crudRelationFieldStub;
      stub = stub.replace(/#{RelationMethodReturnType}/g, field.isList ? `${field.type}[]` : field.type);
      stub = stub.replace(/#{RelationFieldType}/g, field.type);
      stub = stub.replace(/#{RelationFieldName}/g, field.name);
      stub = stub.replace(/#{RelationFieldNameCapitalized}/g, StringFns.capitalize(field.name));
      code += stub;
    });
    return code;
  }
  addReferenceFieldImports() {
    let content = "";
    const referenceFields = this.prismaHelper.getUniqueReferenceFields(this.model);
    referenceFields.forEach((fieldNameAndType) => content += `, ${fieldNameAndType.type}`);
    return content;
  }
  addIdFieldMethods() {
    let content = "";
    const idField = this.prismaHelper.getIdFieldNameAndType(this.model);
    if (idField) {
      content = idMethods_neverThrow;
      content = this.replaceIdMethodTags(content, idField);
    }
    return content;
  }
  replaceIdMethodTags(content, field) {
    content = content.replace(/#{idName}/g, field.name);
    content = content.replace(/#{idType}/g, field.type);
    content = content.replace(/#{uniqueInputType}/g, `Prisma.${this.model.name}WhereUniqueInput`);
    return content;
  }
};

// libs/prisma-generator-nestjs/src/generators/enum.generator.ts
var generateEnum = ({ name, values }, settings) => {
  const enumValues = values.map(({ name: name2 }) => `${name2}="${name2}"`).join(",\n");
  return `
${settings.AutoGeneratedWarningText}

enum ${name} { 
${enumValues}
 }`;
};

// libs/prisma-generator-nestjs/src/stubs/module.stub.ts
var moduleStub = `
#{AutoGeneratedWarningText}

import { Module } from '@nestjs/common';
import { #{ServiceName} } from './#{ServiceFileName}';
import { #{PrismaModuleName} } from '#{PrismaModuleImportPath}';
#{ImportControllerClass}
@Module({
  controllers: [#{ControllerName}],
  providers: [#{ServiceName}],
  imports: [#{PrismaModuleName}],
  exports: [#{ServiceName}]
})
export class #{ModuleName} {}`;
var importControllerStub = `import { #{ControllerName} } from './#{ControllerFileName}';`;

// libs/prisma-generator-nestjs/src/generators/module.generator.ts
var ModuleGenerator = class {
  constructor(model, settings) {
    this.model = model;
    this.settings = settings;
  }
  generateContent() {
    let nameGen = NameGenerator.singleton;
    let content = moduleStub;
    content = content.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);
    content = content.replace(/#{PrismaModuleName}/g, this.settings.PrismaModuleName);
    content = content.replace(/#{PrismaModuleImportPath}/g, this.settings.PrismaModuleImportPath);
    if (this.settings.GenerateControllers) {
      content = content.replace(/#{ImportControllerClass}/g, importControllerStub);
      content = content.replace(/#{ControllerName}/g, nameGen.getClassName(this.model, "controller"));
      content = content.replace(/#{ControllerFileName}/g, nameGen.getFileName(this.model, "controller"));
    } else {
      content = content.replace(/#{ImportControllerClass}/g, "");
      content = content.replace(/#{ControllerName}/g, "");
    }
    content = content.replace(/#{ServiceName}/g, nameGen.getClassName(this.model, "service"));
    content = content.replace(/#{ServiceFileName}/g, nameGen.getFileName(this.model, "service"));
    content = content.replace(/#{ModuleName}/g, nameGen.getClassName(this.model, "module"));
    return content;
  }
};

// libs/prisma-generator-nestjs/src/generator.ts
var import_prettier = require("prettier");
var defaultOptions = {
  strict: false,
  dryRun: false,
  AutoGeneratedWarningText: "/*****    AUTO-GENERATED FILE - DO NOT MODIFY   *****/",
  prefix: "gen",
  schemaPath: "",
  GenerateServices: true,
  GenerateControllers: false,
  GenerateModule: true,
  // InputExportPath: 'data/inputs',
  // InputSuffix: 'Input',
  // InputValidatorPackage: 'class-validator',
  // InputCreatePrefix: 'Create',
  // InputUpdatePrefix: 'Update',
  WrapWithNeverthrow: true,
  PrismaServiceImportPath: "prisma/prisma.service",
  PrismaModuleName: "PrismaModule",
  PrismaModuleImportPath: "prisma/prisma.module",
  EnumPath: "enums"
};
(0, import_generator_helper.generatorHandler)({
  onManifest() {
    console.log(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: "../generated",
      prettyName: GENERATOR_NAME
    };
  },
  onGenerate: async (options) => {
    const configOverwrites = {
      schemaPath: options.schemaPath
    };
    const settings = {
      ...defaultOptions,
      ...convertBooleanStrings(options.generator.config),
      ...configOverwrites
    };
    const mainGenerator = new MainGenerator(options, settings);
    await mainGenerator.generateFiles();
  }
});
var MainGenerator = class {
  constructor(options, settings) {
    this.options = options;
    this.settings = settings;
    this.writeFile = settings?.dryRun ? async (path4, content) => await outputToConsole(path4, this.formatContent(path4, content)) : async (path4, content) => await writeFileSafely(path4, this.formatContent(path4, content));
    this.nameGenerator = NameGenerator.singleton;
    this.nameGenerator.prefix = settings.prefix ?? "";
    this.nameGenerator.basePath = options.generator.output?.value || "gen";
  }
  writeFile;
  nameGenerator;
  formatContent(filePath, content) {
    if (filePath.match(/.ts$/)) {
      return (0, import_prettier.format)(content, { useTabs: true, tabWidth: 4, parser: "typescript" });
    } else {
      return content;
    }
  }
  async generateFiles() {
    await this.generateFilesForAllModels();
    if (this.settings?.secondaryOutputPath) {
      this.nameGenerator.prefix = "";
      this.nameGenerator.basePath = this.settings.secondaryOutputPath;
      this.settings.AutoGeneratedWarningText = "";
      await this.generateFilesForAllModels();
    }
  }
  async generateFilesForAllModels() {
    for (const model of this.options.dmmf.datamodel.models) {
      if (this.settings?.GenerateServices)
        await this.generateServiceFile(model);
      if (this.settings.GenerateControllers)
        await this.generateControllerFile(model);
      if (this.settings.GenerateModule)
        await this.generateModuleFile(model);
    }
  }
  async generateEnumFile(tEnum) {
    let content = generateEnum(tEnum, this.settings);
    let filePath = this.nameGenerator.geFilePath(tEnum, "enum");
    await this.writeFile(filePath, content);
  }
  /* async generateInputFile(model: DMMF.Model) {
      const inputGenerator = new InputGenerator(this.settings, model);
      const inputContent = await inputGenerator.generateContent();
      const filePath = this.nameGenerator.geFilePath(model, 'controller')
      await this.writeFile(filePath, inputContent);
  } */
  async generateServiceFile(model) {
    console.log(` > Generating Service for Model ${model.name}`);
    const serviceGenerator = new ServiceGenerator(this.settings, model);
    const crudServiceContent = await serviceGenerator.generateContent();
    const filePath = this.nameGenerator.geFilePath(model, "service");
    await this.writeFile(filePath, crudServiceContent);
  }
  async generateControllerFile(model) {
    const controllerGenerator = new ControllerGenerator(this.settings, model);
    const controllerContent = await controllerGenerator.generateContent();
    const filePath = this.nameGenerator.geFilePath(model, "controller");
    await this.writeFile(filePath, controllerContent);
  }
  async generateModuleFile(model) {
    const moduleGenerator = new ModuleGenerator(model, this.settings);
    const content = moduleGenerator.generateContent();
    const filePath = this.nameGenerator.geFilePath(model, "module");
    await this.writeFile(filePath, content);
  }
};
