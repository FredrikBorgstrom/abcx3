import { DMMF } from '@prisma/generator-helper';
import { GeneratorSettings } from '../settings.interface';
import { PrismaHelper } from '../helpers/prisma.helper';
import {
    dartBaseClassStub,
    dartConstructorArgument,
    dartConstructorArgumentWithDefaultValue,
    dartFieldStub
} from '../stubs/dart.stub';
import { lowerCaseFirstChar } from '../utils/utils';

export const dartTypeMap = {
    bigint: 'BigInt',
    boolean: 'bool',
    bytes: 'ByteBuffer',
    datetime: 'DateTime',
    decimal: 'double',
    float: 'double',
    int: 'int',
    json: 'Map<String, dynamic>',
    string: 'String'
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
        content = content.replace(/#{NameBaseInput}/g, className);

        // ------------------------------------------
        // handle the parent class (extends)

        const parentClassInjection = '';
        content = content.replace(/#{ParentClass}/g, parentClassInjection);

        let fieldsContent = '';
        let constructorContent = '';

        for (const field of this.model.fields) {
            fieldsContent += '\t' + this.generateFieldContent(field) + '\n';
            constructorContent += this.generateConstructorArg(field) + ',\n\t\t';
        }
        if (constructorContent.length > 2) {
            constructorContent = constructorContent.slice(0, constructorContent.length - 2);
        } else {
            constructorContent = '';
        }

        content = content.replace(/#{Fields}/g, fieldsContent);
        content = content.replace(/#{ConstructorArgs}/g, constructorContent);

        return content;
    }

    // ConstructorArgs

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
        content = content.replace(/#{FieldName}/g, field.name);
        return content;
    }

    generateFieldContent(field: DMMF.Field) {
        let content = dartFieldStub;

        content = content.replace(/#{FieldName}/g, field.name);

        //let dartType = this.prismaHelper.getDartTypeFromDMMF(field);

        let dartType = dartTypeMap[field.type.toLowerCase() as DartTypeMapKey];
        if (!dartType) {
            dartType = field.type;
            this.addPackageToImport(dartType.toLowerCase() + '.dart');
        }
        let printedType = (field.isList) ? `List<${dartType}>` : dartType;
        content = content.replace(/#{Type}/g, printedType);
        content = content.replace(/#{Operator}/g, field.isRequired ? '' : '?');
        
        return content;
    }

    private addPackageToImport(packageName: string) {
        if (!this.importedPackages.some(name => name == packageName)) {
            this.importedPackages.push(packageName);
        }
    }

    private generateImportStatements(): string {
        let result = '';

        for (const packageName of this.importedPackages) {
            result += `import './${packageName}';\n`;
        }

        return result;
    }
}

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
