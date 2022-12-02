"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DartGenerator = exports.dartTypeMap = void 0;
const prisma_helper_1 = require("../helpers/prisma.helper");
const dart_stub_1 = require("../stubs/dart.stub");
const utils_1 = require("../utils/utils");
exports.dartTypeMap = {
    BigInt: 'BigInt',
    Boolean: 'bool',
    Bytes: 'ByteBuffer',
    DateTime: 'DateTime',
    Decimal: 'double',
    Float: 'double',
    Int: 'int',
    Json: 'Map<String, dynamic>',
    String: 'String'
};
class DartGenerator {
    config;
    model;
    importedPackages = [];
    omitFields = [];
    prismaHelper;
    constructor(config, model) {
        this.config = config;
        this.model = model;
        this.prismaHelper = prisma_helper_1.PrismaHelper.getInstance();
    }
    generateContent() {
        let content = this.generateBaseInput();
        content = content.replace(/#{Imports}/g, this.generateImportStatements());
        return content;
    }
    generateBaseInput() {
        let content = dart_stub_1.dartBaseClassStub;
        const className = this.model.name;
        content = content.replace(/#{ClassName}/g, className);
        // ------------------------------------------
        // handle the parent class (extends)
        const parentClassInjection = '';
        content = content.replace(/#{ParentClass}/g, parentClassInjection);
        let constructorArgs = [];
        let properties = [];
        let fromJsonArgs = [];
        let toJsonKeyVals = [];
        for (const field of this.model.fields) {
            constructorArgs.push(this.generateConstructorArg(field));
            properties.push(this.generatePropertyContent(field));
            fromJsonArgs.push(this.generateFromJsonArgument(field));
            toJsonKeyVals.push(this.generateToJsonKeyVal(field));
        }
        const constructorContent = constructorArgs.join('\n\t');
        const propertiesContent = properties.join('\n\t');
        const fromJsonContent = fromJsonArgs.join(',\n\t');
        const toJsonContent = toJsonKeyVals.join(',\n\t');
        content = content.replace(/#{fromJsonArgs}/g, fromJsonContent);
        content = content.replace(/#{toJsonKeyValues}/g, toJsonContent);
        content = content.replace(/#{Properties}/g, propertiesContent);
        content = content.replace(/#{ConstructorArgs}/g, constructorContent);
        return content;
    }
    generateConstructorArg(field) {
        let content = '';
        if (field.hasDefaultValue && !(field.default instanceof Object)) {
            content = dart_stub_1.dartConstructorArgumentWithDefaultValue;
            let defValue = field.default;
            let valueStr;
            if (field.kind === 'enum') {
                valueStr = `${field.type}.${defValue}`;
            }
            else {
                valueStr = typeof defValue === 'string' ? `"${defValue}"` : defValue.toString();
            }
            content = content.replace(/#{DefaultValue}/g, valueStr);
            content = content.replace(/#{Required}/g, '');
        }
        else {
            content = dart_stub_1.dartConstructorArgument;
            content = content.replace(/#{Required}/g, field.isRequired ? 'required' : '');
        }
        content = content.replace(/#{PropName}/g, field.name);
        return content;
    }
    printDefaultValue(field) {
        if (field.hasDefaultValue && !(field.default instanceof Object)) {
            let defValue = field.default;
            let valueStr;
            if (field.kind === 'enum') {
                return `${field.type}.${defValue}`;
            }
            else {
                return typeof defValue === 'string' ? `"${defValue}"` : defValue.toString();
            }
        }
        else {
            return null;
        }
    }
    generateFromJsonArgument(field) {
        let content = (field.isList) ? dart_stub_1.dartFromJsonListArg : dart_stub_1.dartFromJsonArg;
        content = this.replacePropName(content, field);
        content = this.replaceNullable(content, field);
        content = this.replaceType(content, field);
        return content;
    }
    generateToJsonKeyVal(field) {
        let content = (field.isList) ? dart_stub_1.toJsonListPropertyStub : dart_stub_1.toJsonPropertyStub;
        content = this.replacePropName(content, field);
        content = this.replaceNullable(content, field);
        return content;
    }
    generatePropertyContent(field) {
        let content = dart_stub_1.dartPropertyStub;
        content = content.replace(/#{PropName}/g, field.name);
        //let dartType = this.prismaHelper.getDartTypeFromDMMF(field);
        let dartType = this.getDartType(field);
        /* let dartType = dartTypeMap[field.type as DartTypeMapKey];
        if (!dartType) {
            dartType = field.type;
            this.addPackageToImport(dartType + '.dart');
        } */
        let printedType = (field.isList) ? `List<${dartType}>` : dartType;
        content = content.replace(/#{Type}/g, printedType);
        content = this.replaceNullable(content, field);
        return content;
    }
    getDartType = (field) => exports.dartTypeMap[field.type] || field.type;
    isProprietaryType = (type) => exports.dartTypeMap[type] == null;
    replaceNullable = (content, field) => content.replace(/#{Nullable}/g, field.isRequired ? '' : '?');
    replacePropName = (content, field) => content.replace(/#{PropName}/g, field.name);
    replaceType = (content, field) => content.replace(/#{Type}/g, this.getDartType(field));
    // replaceType = (content: string, field: DMMF.Field) => content.replace(/#{Nullable}/g, field.isRequired ? '' : '?');
    generateImportStatements() {
        let result = '';
        const checkedTypes = [];
        this.model.fields.forEach(({ type }) => {
            if (!checkedTypes.includes(type)) {
                checkedTypes.push(type);
                if (this.isProprietaryType(type)) {
                    result += `import '${(0, utils_1.typeToFileName)(type)}';\n`;
                }
            }
        });
        // for (const packageName of this.importedPackages) {
        //     result += `import './${packageName}';\n`;
        // }
        return result;
    }
}
exports.DartGenerator = DartGenerator;
/*  private addPackageToImport(packageName: string) {
        if (!this.importedPackages.some(name => name == packageName)) {
            this.importedPackages.push(packageName);
        }
    } */
/* export const CellType: {
    startKey: 'start',
    letterx2: 'letterx2',
    letterx3: 'letterx3',
    wordx2: 'wordx2',
    wordx3: 'wordx3'
  };
  
export type KeyofTypeofCelltype = keyof typeof CellType;

export type CellType = (typeof CellType)[KeyofTypeofCelltype];
 */
//# sourceMappingURL=dart.generator.js.map