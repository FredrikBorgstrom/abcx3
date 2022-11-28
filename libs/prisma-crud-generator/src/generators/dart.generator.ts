import { DMMF } from '@prisma/generator-helper';
import { DecoratorHelper } from '../helpers/decorator.helper';
import { PrismaHelper } from '../helpers/prisma.helper';
import { GeneratorInterface } from '../interfaces/generator.interface';
import {
    dartBaseClassStub,
    dartConstructorArgument,
    dartConstructorArgumentWithDefaultValue,
    dartCreateClassStub,
    dartFieldStub,
    dartUpdateClassStub,
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

        const createInputStub = this.generateCreateInput();
        content = content.replace(/#{CreateClassStub}/g, createInputStub);

        const createUpdateStub = this.generateUpdateInput();
        content = content.replace(/#{UpdateClassStub}/g, createUpdateStub);

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
            const fieldContent = await this.generateFieldContent(field);
            fieldsContent = fieldsContent + fieldContent;
        }

        content = content.replace(/#{Fields}/g, fieldsContent);

        return content;
    }

    // ConstructorArgs

    generateConstructorArg(field: DMMF.Field) {
        let content = field.hasDefaultValue ? dartConstructorArgumentWithDefaultValue : dartConstructorArgument;
        
        let operator = field.isRequired ? 'required' : '';
        content = content.replace(/#{Operator}/g, operator);

        content = content.replace(/#{Type}/g, this.prismaHelper.getDartTypeFromDMMF(field));

    }



    private generateCreateInput() {
        let content = dartCreateClassStub;

        const parentClassName = this.getBaseInputClassName();
        const className = this.getCreateInputClassName();

        content = content.replace(/#{NameParentInput}/g, parentClassName);
        content = content.replace(/#{NameCreateInput}/g, className);

        const omitFieldString = this.omitFields
            .map((field) => `'${field}'`)
            .join(',');
        content = content.replace(/#{OmitFields}/g, omitFieldString);

        return content;
    }

    private generateUpdateInput() {
        let content = dartUpdateClassStub;

        const parentClassName = this.getCreateInputClassName();
        const className = this.getUpdateInputClassName();

        content = content.replace(/#{NameParentInput}/g, parentClassName);
        content = content.replace(/#{NameUpdateInput}/g, className);


        return content;
    }

    async generateFieldContent(field: DMMF.Field) {
        let content = dartFieldStub;

        content = content.replace(/#{FieldName}/g, field.name);

        const dartType = this.prismaHelper.getDartTypeFromDMMF(field);

        content = content.replace(/#{Type}/g, dartType);

        let isOptionalDecorator = '';

        if (field.isRequired === false) {
            content = content.replace(/#{Operator}/g, '?');
        } else {
            if (this.config.strict === 'true') {
                content = content.replace(/#{Operator}/g, '!');
            } else {
                content = content.replace(/#{Operator}/g, '');
            }
        }

        let openApiDecoratorsContent = '';

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
