"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DartGenerator = exports.dartTypeMap = void 0;
const dart_stub_1 = require("../stubs/dart.stub");
const prisma_helper_1 = require("libs/shared/src/prisma.helper");
const stringFns_1 = require("libs/shared/src/stringFns");
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
        const parentClassInjection = '';
        content = content.replace(/#{ParentClass}/g, parentClassInjection);
        let constructorArgs = [];
        let properties = [];
        let fromJsonArgs = [];
        let toJsonKeyVals = [];
        for (const field of this.model.fields) {
            const commentDirectives = this.prismaHelper.parseDocumentation(field);
            if (commentDirectives.some(directive => directive.name === '@dart_omit')) {
                continue;
            }
            properties.push(this.generatePropertyContent(field));
            constructorArgs.push(this.generateConstructorArg(field));
            fromJsonArgs.push(this.generateFromJsonArgument(field));
            toJsonKeyVals.push(this.generateToJsonKeyVal(field));
        }
        const propertiesContent = properties.join('\n\t');
        const constructorContent = constructorArgs.join(',\n\t');
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
        let dartType = this.getDartType(field);
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
    generateImportStatements() {
        let result = '';
        const checkedTypes = [];
        this.model.fields.forEach(({ type }) => {
            if (!checkedTypes.includes(type)) {
                checkedTypes.push(type);
                if (this.isProprietaryType(type)) {
                    result += `import '${stringFns_1.StringFns.decapitalizeFileName(type, 'dart')}';\n`;
                }
            }
        });
        return result;
    }
}
exports.DartGenerator = DartGenerator;
//# sourceMappingURL=dart.generator.js.map