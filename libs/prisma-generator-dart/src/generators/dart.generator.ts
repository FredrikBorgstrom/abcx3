import { DMMF } from '@prisma/generator-helper';
import { PrismaHelper } from '../helpers/prisma.helper';
import { GeneratorSettings } from '../settings.interface';
import {
    dartBaseClassStub,
    dartConstructorArgument,
    dartConstructorArgumentWithDefaultValue,
    dartPropertyStub,
    dartFromJsonArg,
    dartFromJsonListArg,
    toJsonPropertyStub,
    toJsonListPropertyStub
} from '../stubs/dart.stub';
import { typeToFileName } from '../utils/utils';

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

export class DartGenerator {
    private importedPackages: string[] = [];
    private omitFields: string[] = [];
    private prismaHelper: PrismaHelper;

    constructor(private config: GeneratorSettings, private model: DMMF.Model) {
        this.prismaHelper = PrismaHelper.getInstance();
    }

    generateContent() {
        let content = this.generateBaseInput();

        content = content.replace(/#{Imports}/g, this.generateImportStatements());
        return content;
    }

    private generateBaseInput() {
        let content = dartBaseClassStub;

        const className = this.model.name;
        content = content.replace(/#{ClassName}/g, className);

        // ------------------------------------------
        // handle the parent class (extends)

        const parentClassInjection = '';
        content = content.replace(/#{ParentClass}/g, parentClassInjection);

        let constructorArgs: string[] = [];
        let properties: string[] = [];
        let fromJsonArgs: string[] = [];
        let toJsonKeyVals: string[] = [];

        for (const field of this.model.fields) {
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

    generateConstructorArg(field: DMMF.Field): string {
        let content = '';
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
            content = content.replace(/#{Required}/g, field.isRequired ? 'required' : '');
        }
        content = content.replace(/#{PropName}/g, field.name);
        return content;
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
        let content = (field.isList) ? dartFromJsonListArg : dartFromJsonArg;
        content = this.replacePropName(content, field);
        content = this.replaceNullable(content, field);
        content = this.replaceType(content, field);
        return content;
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

    getDartType = (field: DMMF.Field) => dartTypeMap[field.type as DartTypeMapKey] || field.type;
    isProprietaryType = (type: string) => dartTypeMap[type as DartTypeMapKey] ==  null;
    

    replaceNullable = (content: string, field: DMMF.Field) => content.replace(/#{Nullable}/g, field.isRequired ? '' : '?');
    replacePropName = (content: string, field: DMMF.Field) => content.replace(/#{PropName}/g, field.name);
    replaceType = (content: string, field: DMMF.Field) => content.replace(/#{Type}/g, this.getDartType(field));

    // replaceType = (content: string, field: DMMF.Field) => content.replace(/#{Nullable}/g, field.isRequired ? '' : '?');

   

    private generateImportStatements(): string {
        let result = '';
        const checkedTypes: string[] = [];

        this.model.fields.forEach(({type}) => {
            if (!checkedTypes.includes(type)) {
                checkedTypes.push(type);
                if (this.isProprietaryType(type)) {
                    result += `import '${typeToFileName(type)}';\n`;
                }
            }
        });

        // for (const packageName of this.importedPackages) {
        //     result += `import './${packageName}';\n`;
        // }

        return result;
    }
}

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
