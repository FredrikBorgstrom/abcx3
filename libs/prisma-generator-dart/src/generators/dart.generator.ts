import { DMMF } from '@prisma/generator-helper';
import { DartGeneratorSettings } from '../dart_settings.interface';
import {
    dartBaseClassStub,
    dartConstructorArgument,
    dartConstructorArgumentWithDefaultValue,
    dartPropertyStub,
    dartFromJsonArg,
    dartFromJsonListArg,
    toJsonPropertyStub,
    toJsonListPropertyStub,
    dartFromJsonEnumListArg,
    dartFromJsonEnumArg
} from '../stubs/dart.stub';
import { PrismaHelper, StringFns } from '@shared';

export const dartTypeMap = {
    BigInt: 'BigInt',
    Boolean: 'bool',
    Bytes: 'ByteBuffer',
    DateTime: 'DateTime',
    Decimal: 'double',
    Float: 'double',
    Int: 'int',
    Json: 'Map<String, dynamic>',
    String: 'String'
}

type DartTypeMapKey = keyof typeof dartTypeMap;


export function helloWorld(name: string): string {
    return name + "Hello World!";
}


export class DartGenerator {
    private importedPackages: string[] = [];
    private omitFields: string[] = [];
    private prismaHelper: PrismaHelper;

    constructor(private settings: DartGeneratorSettings, private model: DMMF.Model) {
        this.prismaHelper = PrismaHelper.getInstance();
    }

    generateContent() {
        let content = this.generateBaseInput();
       

        content = content.replace(/#{Imports}/g, this.generateImportStatements());
        return content;
    }

    private generateBaseInput() {
        let content = dartBaseClassStub;
        content = content.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);

        const className = this.model.name;
        content = content.replace(/#{ClassName}/g, className);

        // handle the parent class (extends)

        const parentClassInjection = '';
        content = content.replace(/#{ParentClass}/g, parentClassInjection);

        if (this.settings.ModelsImplementBaseClass) {
            content = content.replace(/#{ImplementedClass}/g, 'implements ModelBase ');
            content = content.replace(/#{OverrideAnnotation}/g, '@override');
        } else {
            content = content.replace(/#{ImplementedClass}/g, '');
            content = content.replace(/#{OverrideAnnotation}/g, '');
        }

        let constructorArgs: string[] = [];
        let properties: string[] = [];
        let fromJsonArgs: string[] = [];
        let toJsonKeyVals: string[] = [];

        for (const field of this.model.fields) {
            const commentDirectives = this.prismaHelper.parseDocumentation(field);
            if (commentDirectives.some(directive => directive.name === '@abcx3_omit')) {
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
        } else  {
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
            if (field.kind === 'enum') {
                code = dartFromJsonEnumListArg;
            } else {
                code = dartFromJsonListArg;
            }
        } else {
            if (field.kind === 'enum') {
                code = dartFromJsonEnumArg;
            } else {
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
        let content = (field.isList) ? toJsonListPropertyStub : toJsonPropertyStub;
        content = this.replacePropName(content, field);
        content = this.replaceNullable(content, field);
        return content;
    }

    generatePropertyContent(field: DMMF.Field) {
        let content = dartPropertyStub;

        content = content.replace(/#{PropName}/g, field.name);
        let dartType = this.getDartType(field);
        let printedType = (field.isList) ? `List<${dartType}>` : dartType;
        content = content.replace(/#{Type}/g, printedType);
        content = this.replaceNullable(content, field);
        
        if (this.settings.ModelsImplementBaseClass && field.name === 'id') {
            content = '@override\n' + content;
        }
        return content;
    }

    getDartType = (field: DMMF.Field) => dartTypeMap[field.type as DartTypeMapKey] || field.type;
    isProprietaryType = (type: string) => dartTypeMap[type as DartTypeMapKey] ==  null;
    

    replaceNullable = (content: string, field: DMMF.Field) => content.replace(/#{Nullable}/g, this.isFieldRequired(field) ? '' : '?');
    replacePropName = (content: string, field: DMMF.Field) => content.replace(/#{PropName}/g, field.name);
    replaceType = (content: string, field: DMMF.Field) => content.replace(/#{Type}/g, this.getDartType(field));

    private generateImportStatements(): string {
        let result = '';
        const checkedTypes: string[] = [];
        if (this.settings.ModelsImplementBaseClass) {
            result += `import '${this.settings.ModelsBaseClassFileName}';\n`;
        }

        this.model.fields.forEach(({type}) => {
            if (!checkedTypes.includes(type)) {
                checkedTypes.push(type);
                if (this.isProprietaryType(type)) {
                    result += `import '${StringFns.snakeCase(type)}.dart';\n`;
                }
            }
        });
        return result;
    }
}

