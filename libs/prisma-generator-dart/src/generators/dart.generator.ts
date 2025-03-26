import { DMMF } from '@prisma/generator-helper';
import { DartTypeMap, PrismaHelper, StringFns } from '@shared';
import { DartGeneratorSettings } from '../dart_settings.interface';
import {
    dartBaseClassStub,
    dartConstructorArgument,
    dartConstructorArgumentWithDefaultValue,
    dartCopyWithArg,
    dartCopyWithConstructorArg,
    dartCopyWithInstanceConstructorArg,
    dartEqualByIdStub,
    dartEqualStub,
    dartFromJsonArg,
    dartFromJsonBigIntArg,
    dartFromJsonDateTimeArg,
    dartFromJsonEnumArg,
    dartFromJsonEnumListArg,
    dartFromJsonFloatArg,
    dartFromJsonModelListArg,
    dartFromJsonRefArg,
    dartFromJsonScalarBigIntListArg,
    dartFromJsonScalarIntListArg,
    dartFromJsonScalarStringListArg,
    dartHashCodeKeyValue,
    dartListsEqualStub,
    dartPropertyStub,
    dartUIDStub,
    getPropertyValueFunctionStub,
    toJsonBigIntPropertyStub,
    toJsonDatePropertyStub,
    toJsonObjectListStub,
    toJsonObjectStub,
    toJsonPropertyStub,
    updateWithInstanceSetters
} from '../stubs/dart.stub';

/* export const DartTypeMap = {
    BigInt: 'BigInt',
    Boolean: 'bool',
    Bytes: 'ByteBuffer',
    DateTime: 'DateTime',
    Decimal: 'double',
    Float: 'double',
    Int: 'int',
    Json: 'Json',
    String: 'String'
} */

type DartTypeMapKey = keyof typeof DartTypeMap;


export class DartGenerator {
    private importedPackages: string[] = [];
    private omitFields: string[] = [];
    private prismaHelper: PrismaHelper;

    constructor(private settings: DartGeneratorSettings, private model: DMMF.Model) {
        this.prismaHelper = PrismaHelper.getInstance();
    }

    generateContent() {
        let content = this.generateBaseInput();
        content = content.replace(/#{AdditionalImports}/g, this.generateImportStatements());
        return content;
    }

    private generateBaseInput() {
        let content = dartBaseClassStub;
        content = content.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);

        const className = this.model.name;
        const instanceName = StringFns.decapitalize(className);
        content = content.replace(/#{ClassName}/g, className);
        content = content.replace(/#{InstanceName}/g, instanceName);
        content = content.replace(/#{Model}/g, className);

        // handle the parent class (extends)

        const parentClassInjection = '';
        content = content.replace(/#{ParentClass}/g, parentClassInjection);

        // let implementsStr = '';
        /* if (this.settings.ModelsImplementBaseClass) {
            implementsStr = `implements PrismaModel<${className}> `;
        } */
        let constructorArgs: string[] = [];
        let properties: string[] = [];
        let fromJsonArgs: string[] = [];
        let toJsonKeyVals: string[] = [];
        let equalsKeyVals: string[] = [];
        let hashCodeKeyVals: string[] = [];
        let copyWithArgs: string[] = [];
        let copyWithConstructorArgs: string[] = [];
        let copyWithInstanceConstructorArgs: string[] = [];
        const updateWithInstanceSetters: string[] = [];
        let listFields: DMMF.Field[] = [];
        const getPropToValueFunction: string[] = [];
        let uidGetter = '';
        let equalById = '';

        for (const field of this.model.fields) {
            const commentDirectives = this.prismaHelper.parseDocumentation(field);
            if (commentDirectives.some(directive => directive.name === '@abcx3_omit')) {
                continue;
            }
            if (field.isId) {
                uidGetter = this.generateUIDGetter(field);
                equalById = this.generateEqualById(field);
                content = content.replace(/#{ImplementsPrismaModel}/g, `PrismaModel<${this.getDartType(field)}, ${className}>`);
                content = content.replace(/#{ImplementsId}/g, (field.name == 'id') ? `, Id<${this.getDartType(field)}>` : '');
            }

            properties.push(this.generatePropertyContent(field));
            constructorArgs.push(this.generateConstructorArg(field));
            fromJsonArgs.push(this.generateFromJsonArgument(field));
            toJsonKeyVals.push(this.generateToJsonKeyVal(field));
            equalsKeyVals.push(this.generateEqualsKeyValue(field));
            hashCodeKeyVals.push(this.generateHashCodeValue(field));
            copyWithArgs.push(this.generateCopyWithArg(field));
            copyWithConstructorArgs.push(this.generateCopyWithConstructorArg(field));
            copyWithInstanceConstructorArgs.push(this.generateCopyWithInstanceConstructorArg(field, instanceName));
            updateWithInstanceSetters.push(this.generateUpdateWithInstanceSetter(field, instanceName));
            getPropToValueFunction.push(this.generatePropertyToValFunction(field));
            if (field.isList) {
                listFields.push(field);
            }
        }

        for (const listField of listFields) {
            properties.push(`int? $${listField.name}Count;`);
            constructorArgs.push(`this.$${listField.name}Count`);
            fromJsonArgs.push(`$${listField.name}Count: json['_count']?['${listField.name}'] as int?`);
            equalsKeyVals.push(`$${listField.name}Count == other.$${listField.name}Count`);
            hashCodeKeyVals.push(`$${listField.name}Count.hashCode`);
            copyWithArgs.push(`int? $${listField.name}Count`);
            copyWithConstructorArgs.push(`$${listField.name}Count: $${listField.name}Count ?? this.$${listField.name}Count`);
            copyWithInstanceConstructorArgs.push(`$${listField.name}Count: ${instanceName}.$${listField.name}Count ?? $${listField.name}Count`);
            // toJsonKeyVals.push(`if($${listField.name}Count != null) '${listField.name}': $${listField.name}Count`);
        }

        const propertiesContent = properties.join('\n\t');
        const constructorContent = constructorArgs.join(',\n\t') + ',';
        const fromJsonContent = fromJsonArgs.join(',\n\t');
        let toJsonContent = toJsonKeyVals.join(',\n\t');

        if (listFields.length > 0) {
            let countToJsonStr = 'if (';
            countToJsonStr = listFields.reduce((prev, curr) => prev + `$${curr.name}Count != null || `, countToJsonStr).slice(0, -4);
            countToJsonStr += ") '_count': { \n\t\t";
            for (const listField of listFields) {
                countToJsonStr += `if ($${listField.name}Count != null) '${listField.name}': $${listField.name}Count, \n\t\t`;
            }
            toJsonContent += ',\n\t\t' + countToJsonStr + '},';
        }
        const equalsContent = equalsKeyVals.join(' &&\n\t\t');
        const hashCodeContent = hashCodeKeyVals.join(' ^\n\t\t');
        const copyWithArgsContent = copyWithArgs.join(',\n\t\t') + ',';
        const copyWithConstructorArgsContent = copyWithConstructorArgs.join(',\n\t\t');
        const copyWithInstanceConstructorArgsContent = copyWithInstanceConstructorArgs.join(',\n\t\t');
        const updateWithInstanceSettersContent = updateWithInstanceSetters.join(';\n\t\t') + ';';
        //if (this.settings.ModelsImplementBaseClass) {
        // content = content.replace(/#{ImplementsUniqueId}/g, implementsStr + ' ');
        content = content.replace(/#{OverrideAnnotation}/g, '@override');
        // } else {
        //     content = content.replace(/#{ImplementsUniqueId}/g, '');
        //     content = content.replace(/#{OverrideAnnotation}/g, '');
        // }

        content = content.replace(/#{UIDGetter}/g, uidGetter);
        content = content.replace(/#{GetPropertyValueFunctions}/g, getPropToValueFunction.join('\n\n\t'));
        content = content.replace(/#{EqualById}/g, equalById);
        content = content.replace(/#{fromJsonArgs}/g, fromJsonContent);
        content = content.replace(/#{toJsonKeyValues}/g, toJsonContent);
        content = content.replace(/#{Properties}/g, propertiesContent);
        content = content.replace(/#{ConstructorArgs}/g, constructorContent);

        content = content.replace(/#{equalsKeyValues}/g, equalsContent);
        content = content.replace(/#{hashCodeKeyValues}/g, hashCodeContent);

        content = content.replace(/#{CopyWithArgs}/g, copyWithArgsContent);
        content = content.replace(/#{CopyWithConstructorArgs}/g, copyWithConstructorArgsContent);

        content = content.replace(/#{CopyWithInstanceConstructorArgs}/g, copyWithInstanceConstructorArgsContent);
        content = content.replace(/#{UpdateWithInstanceSetters}/g, updateWithInstanceSettersContent);

        return content;
    }

    generatePropertyToValFunction(field: DMMF.Field) {
        let content = getPropertyValueFunctionStub;
        return this.replaceAllVariables(content, field);
    }

    generateUIDGetter(field: DMMF.Field): string {
        let content = dartUIDStub;
        content = content.replace(/#{OverrideAnnotation}/g, '@override');
        content = content.replace(/#{Type}/g, this.getDartType(field));
        content = content.replace(/#{PropName}/g, field.name);
        content = this.replaceNullable(content, field);
        return content;
    }

    generateEqualById(field: DMMF.Field): string {
        let content = dartEqualByIdStub;
        content = content.replace(/#{OverrideAnnotation}/g, '@override');
        content = content.replace(/#{Type}/g, this.getDartType(field));
        return content;
    }

    generateCopyWithArg(field: DMMF.Field): string {
        let content = dartCopyWithArg;
        content = content.replace(/#{Type}/g, this.getDartType(field));
        content = content.replace(/#{PropName}/g, field.name);
        content = this.replaceNullable(content, field);
        return content;
    }

    generateCopyWithConstructorArg(field: DMMF.Field): string {
        let content = dartCopyWithConstructorArg;
        content = content.replace(/#{PropName}/g, field.name);
        return content;
    }

    generateCopyWithInstanceConstructorArg(field: DMMF.Field, instanceName: string): string {
        let content = dartCopyWithInstanceConstructorArg;
        content = content.replace(/#{PropName}/g, field.name);
        content = content.replace(/#{InstanceName}/g, instanceName);
        return content;
    }

    generateUpdateWithInstanceSetter(field: DMMF.Field, instanceName: string): string {
        let content = updateWithInstanceSetters;
        content = content.replace(/#{PropName}/g, field.name);
        content = content.replace(/#{InstanceName}/g, instanceName);
        return content;
    }

    generateEqualsKeyValue(field: DMMF.Field): string {
        let content = (field.isList) ? dartListsEqualStub : dartEqualStub;
        content = content.replace(/#{PropName}/g, field.name);
        return content;
    }

    generateHashCodeValue(field: DMMF.Field): string {
        let content = dartHashCodeKeyValue;
        content = content.replace(/#{PropName}/g, field.name);
        return content;
    }

    generateConstructorArg(field: DMMF.Field): string {
        let content = '';

        // Does the field have a default value?
        if (field.hasDefaultValue && !(field.default instanceof Object)) {
            content = dartConstructorArgumentWithDefaultValue;
            let defValue = field.default!;
            let valueStr: string;
            if (field.kind === 'enum') {
                valueStr = `${field.type}.${defValue}`;
            } else {
                valueStr = typeof defValue === 'string' ? `"${defValue}"` : defValue.toString();
            }
            content = content.replace(/#{DefaultValue}/g, valueStr);
            content = content.replace(/#{Required}/g, '');
        } else {
            content = dartConstructorArgument;
            content = content.replace(/#{Required}/g, this.isFieldRequired(field) ? 'required' : '');
        }
        content = content.replace(/#{PropName}/g, field.name);
        return content;
    }

    isFieldRequired(field: DMMF.Field): boolean {
        return false; //field.isRequired && field.type !== 'DateTime' && fi;
    }

    printDefaultValue(field: DMMF.Field): string | null {
        if (field.hasDefaultValue && !(field.default instanceof Object)) {
            let defValue = field.default!;
            let valueStr: string;
            if (field.kind === 'enum') {
                return `${field.type}.${defValue}`;
            } else {
                return typeof defValue === 'string' ? `"${defValue}"` : defValue.toString();
            }
        } else {
            return null;
        }
    }

    generateFromJsonArgument(field: DMMF.Field) {
        let code: string;

        if (field.isList) {

            switch (field.kind) {
                case 'object':
                    code = dartFromJsonModelListArg;
                    break;
                case 'enum':
                    code = dartFromJsonEnumListArg;
                    break;
                case 'scalar':
                    if (field.type === 'Int') {
                        code = dartFromJsonScalarIntListArg;
                    } else if (field.type === 'String') {
                        code = dartFromJsonScalarStringListArg;
                    } else if (field.type === 'BigInt') {
                        code = dartFromJsonScalarBigIntListArg;
                    } else {
                        code = dartFromJsonScalarStringListArg;
                    }
                    break;
                default:
                    code = dartFromJsonArg;
                    break;
            }
        } else {
            // console.log(field.type, field.kind);
            if (field.kind === 'enum') {
                code = dartFromJsonEnumArg;
            } else if (field.type === 'DateTime') {
                code = dartFromJsonDateTimeArg;
            } else if (field.kind === "object") {
                code = dartFromJsonRefArg;
            } else if (field.type === "BigInt") {
                code = dartFromJsonBigIntArg;
            } else if (field.type === 'Float') {
                code = dartFromJsonFloatArg;
            }else {
                code = dartFromJsonArg;
            }
        }
        // let content = (field.isList) ? dartFromJsonListArg : dartFromJsonArg;
        code = this.replacePropName(code, field);
        code = this.replaceNullable(code, field);
        code = this.replaceType(code, field);
        return code;
    }

    generateToJsonKeyVal(field: DMMF.Field) {
        let content: string;
        if (field.type === 'DateTime') {
            content = toJsonDatePropertyStub;
        } else if (field.kind === 'object' || field.kind === 'enum') {
            content = field.isList ? toJsonObjectListStub : toJsonObjectStub;
        } else if (field.type === 'BigInt') {
            content = toJsonBigIntPropertyStub;
        } else {
            content = toJsonPropertyStub;
        }

        content = this.replacePropName(content, field);
        content = this.replaceNullable(content, field);
        return content;
    }


    generatePropertyContent(field: DMMF.Field) {
        let content = dartPropertyStub;

        content = content.replace(/#{PropName}/g, field.name);
        content = content.replace(/#{Type}/g, this.getDartType(field));
        content = this.replaceNullable(content, field);

        if (field.name === 'id' && field.isId) {
            content = '@override\n' + content;
        }
        return content;
    }

    getDartType(field: DMMF.Field) {
        let dartType = this.getDartBaseType(field);
        return (field.isList) ? `List<${dartType}>` : dartType;
    }

    getDartBaseType = (field: DMMF.Field) => DartTypeMap[field.type as DartTypeMapKey] || field.type;
    isProprietaryType = (type: string) => DartTypeMap[type as DartTypeMapKey] == null;


    replaceNullable = (content: string, field: DMMF.Field) => content.replace(/#{Nullable}/g, this.isFieldRequired(field) ? '' : '?');
    replacePropName = (content: string, field: DMMF.Field) => content.replace(/#{PropName}/g, field.name);
    replaceType = (content: string, field: DMMF.Field) => content.replace(/#{Type}/g, this.getDartBaseType(field));

    private generateImportStatements(): string {
        let result = '';
        const checkedTypes: string[] = [];
        // result += `import '${this.settings.CommonSourceDirectory}/utils.dart';\n`;
        // result += `import '${this.settings.CommonSourceDirectory}/model_interfaces.dart';\n`;
        /*  if (this.settings.ModelsImplementBaseClass) {
             result += `import '${this.settings.CommonSourceDirectory}/${this.settings.ModelsBaseClassFileName}';\n`;
         } */

        this.model.fields.forEach(({ type }) => {
            if (!checkedTypes.includes(type)) {
                checkedTypes.push(type);
                if (this.isProprietaryType(type)) {
                    result += `import '${StringFns.snakeCase(type)}.dart';\n`;
                }
            }
        });
        return result;
    }

    replaceAllVariables(content: string, field?: DMMF.Field) {
        if (field) {
            content = content.replace(/#{FieldType}/g, this.getDartBaseType(field));
            content = content.replace(/#{DartType}/g, this.getDartType(field));
            content = content.replace(/#{IncludeType}/g, `List<${field.type}Include>?`);
            content = content.replace(/#{fieldName}/g, field.name);
            content = content.replace(/#{FieldName}/g, StringFns.capitalize(field.name));
        }
        content = content.replace(/#{Nullable}/g, '?');
        // content = content.replace(/#{model}/g, StringFns.decapitalize(this.model.name));
        content = content.replace(/#{moDel}/g, StringFns.decapitalize(this.model.name));
        content = content.replace(/#{Model}/g, this.model.name);
        return content;
    }
}

/*  const documentation = field.documentation;
        let customDecoratorsContent = '';
        if (documentation) {
            // we need to process this properly
            const customDecorators = this.parseDocumentation(field);

            for (const customDecorator of customDecorators) {
                // check, if the current field has an @Omit() decorator, so we skip everything
                if (customDecorator.name === 'Omit') {
                    this.omitFields.push(field.name);
                    continue;
                }

                // if the element has an @Relation() decorator
                if (customDecorator.name === 'Relation') {
                    // for now, we do nothing
                    this.omitFields.push(field.name);
                    continue;
                }

                // if the element has an @RelationId() decorator
                if (customDecorator.name === 'RelationId') {
                    // for now, we do nothing
                    this.omitFields.push(field.name);
                    continue;
                }

                customDecoratorsContent =
                    customDecoratorsContent + customDecorator.generateContent();
                this.addDecoratorToImport(customDecorator);
            }
        } */