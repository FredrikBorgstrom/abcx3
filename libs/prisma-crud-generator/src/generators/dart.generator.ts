import { DMMF } from '@prisma/generator-helper';
import { DecoratorHelper } from '../helpers/decorator.helper';
import { PrismaHelper } from '../helpers/prisma.helper';
import { GeneratorInterface } from '../interfaces/generator.interface';
import {
    dartBaseClassStub,
    dartConstructorArgument,
    dartConstructorArgumentWithDefaultValue,
    dartFieldStub
} from '../stubs/dart.stub';

export class DartGenerator {
    private importedPackages: string[] = [];
    private omitFields: string[] = [];
    private prismaHelper: PrismaHelper;

    constructor(private config: GeneratorInterface, private model: DMMF.Model) {
        this.prismaHelper = PrismaHelper.getInstance();
    }

    async generateContent() {
        let content = await this.generateBaseInput();

        content = content.replace(/#{Imports}/g, this.generateImportStatements());
        return content;
    }


    private async generateBaseInput() {
        let content = dartBaseClassStub;

        const className = this.getBaseInputClassName();
        content = content.replace(/#{NameBaseInput}/g, className);

        // ------------------------------------------
        // handle the parent class (extends)

        const parentClassInjection = this.config.InputParentClass ? `extends ${this.config.InputParentClass}` : '';
        content = content.replace(/#{ParentClass}/g, parentClassInjection);

        if (this.config.InputParentClassPath) {
            this.addPackageToImport(this.config.InputParentClassPath + '');
        }

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
            content = content.replace(/#{DefaultValue}/g, field.default!.toString());
            content = content.replace(/#{Required}/g, '');
        } else {
            content = dartConstructorArgument;
            let required = field.isRequired ? 'required' : '';
            content = content.replace(/#{Required}/g, required);
        }
        content = content.replace(/#{FieldName}/g, field.name);
        return content;
    }

    generateFieldContent(field: DMMF.Field) {
        let content = dartFieldStub;

        content = content.replace(/#{FieldName}/g, field.name);

        const dartType = this.prismaHelper.getDartTypeFromDMMF(field);

        content = content.replace(/#{Type}/g, dartType);

        if (field.isRequired === false) {
            content = content.replace(/#{Operator}/g, '?');
        } else {
            if (this.config.strict === 'true') {
                content = content.replace(/#{Operator}/g, '!');
            } else {
                content = content.replace(/#{Operator}/g, '');
            }
        }
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
            result = `${result}import {${packageName}};\n`;
        }

        return result;
    }

    private parseDocumentation(field: DMMF.Field): DecoratorHelper[] {
        let documentation = field.documentation || '';

        documentation = documentation.replace(/(\r\n|\n|\r)/gm, ' ');

        const customDecorators = documentation.split(' ');

        const result: DecoratorHelper[] = [];

        for (const customDecorator of customDecorators) {
            const decoratorParamsIndex = customDecorator.indexOf('(');
            const decoratorParams = customDecorator.substring(
                decoratorParamsIndex + 1,
                customDecorator.lastIndexOf(')'),
            );

            const decoratorName = customDecorator.substring(0, decoratorParamsIndex);

            const decorator = new DecoratorHelper(
                decoratorName,
                this.config.InputValidatorPackage,
                decoratorParams,
            );

            result.push(decorator);
        }

        return result;
    }

    private getBaseInputClassName() {
        return `${this.model.name}${this.config.InputSuffix}`;
    }

    private getCreateInputClassName() {
        return `${this.config.InputCreatePrefix}${this.model.name}${this.config.InputSuffix}`;
    }

    private getUpdateInputClassName() {
        return `${this.config.InputUpdatePrefix}${this.model.name}${this.config.InputSuffix}`;
    }

}
