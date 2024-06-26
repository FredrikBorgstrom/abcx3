import { DMMF } from '@prisma/generator-helper';
import { FieldNameAndType, PrismaHelper, StringFns } from '@shared';
import { promises as fs } from 'fs';
import * as path from 'path';
import { NameGenerator } from '../nameGenerator';
import { NestGeneratorSettings } from '../nest_settings.interface';
import {
    NeverthrowImport,
    ServiceStub,
    crudRelationFieldStub,
    idMethods_neverThrow
} from '../stubs/service.stub';

export class ServiceGenerator {

    private prismaHelper: PrismaHelper;

    constructor(
        private settings: NestGeneratorSettings,
        private model: DMMF.Model
    ) {
        this.prismaHelper = PrismaHelper.getInstance();
    }

    public async generateContent() {
        let nameGen = NameGenerator.singleton;
        let code = ServiceStub;
        code = code.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);
        code = code.replace(/#{ServiceClassName}/g, nameGen.getClassName(this.model, 'service'));
       
        
        if (this.settings.CRUDStubFile) {
            const stubFullPath = path.join(this.settings.schemaPath, this.settings.CRUDStubFile);
            const customStub = await fs.readFile(stubFullPath, { encoding: 'utf-8' });
            code = customStub.toString();
        }

        code = code.replace(/#{PrismaServiceImportPath}/g, this.settings.PrismaServiceImportPath)
        code = code.replace(/#{byIdMethods}/g, this.addIdFieldMethods());

        code = code.replace(/#{relationFieldMethods}/g, this.addReferenceFieldMethods());
        code = code.replace(/#{RelatedFieldTypesImport}/g, this.addReferenceFieldImports());

        if (this.settings.WrapWithNeverthrow) {
            code = code.replace(/#{NeverthrowImport}/g, NeverthrowImport);
            code = this.addNeverthrow(code);
        } else {
            code = code.replace(/#{NeverthrowImport}/g, '');
        }

        
        code = code.replace(/#{Model}/g, this.model.name);
        code = code.replace(/#{MODEL}/g, this.model.name.toUpperCase());
        code = code.replace(/#{model}/g, this.model.name.toLowerCase());
        code = code.replace(/#{moDel}/g, StringFns.decapitalize(this.model.name));
        return code;
    }
    addNeverthrow(code: string): string {
        // ((?<=Promise<).*(?=\|))

        code = code.replace(/Promise<.*>/g, str => 
            `Promise<Result<${str.substring(8, str.length - 8)}, Error>>`
        );
        code = code.replace(/return result.*(?=;)/g, str => 
             `return ok(${str.substring(7)});`
        );
        code = code.replace(/new .*Exception\(.*(?=\))/g, str => 
            `err(new ${str.substring(4)})`
        );

       return code;
    }

    addReferenceFieldMethods() {
        let code = '';
        const referenceFields = this.prismaHelper.getReferenceFields(this.model);
        referenceFields.forEach(field => {
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
        let content = '';
        const referenceFields = this.prismaHelper.getUniqueReferenceFields(this.model);
        referenceFields.forEach((fieldNameAndType) => content += `, ${fieldNameAndType.type}`);
        return content;
    }

    addIdFieldMethods() {
        let content = '';
        const idField = this.prismaHelper.getIdFieldNameAndType(this.model);
        if (idField) {
            content = idMethods_neverThrow;
            content = this.replaceIdMethodTags(content, idField);
        }
        return content;
    }

    replaceIdMethodTags(content: string, field: FieldNameAndType) {
        content = content.replace(/#{idName}/g, field.name);
        content = content.replace(/#{idType}/g, field.type);
        content = content.replace(/#{uniqueInputType}/g, `Prisma.${this.model.name}WhereUniqueInput`);
        return content;
    }
}



/*  let compoundkey = PrismaHelper.getInstance().getUniqueInputPropertyName(this.model);
            let compoundType = PrismaHelper.getInstance().getUniqueInputType(this.model);
            let prismaCompoundInputType = `Prisma.${this.model.name}${compoundType}CompoundUniqueInput`;
 
            crudServiceContent = crudServiceContent.replace(
                /#{uniqueInputType}/g,
                prismaCompoundInputType
            );
 */
/* crudServiceContent = crudServiceContent.replace(
    /#{uniqueKeyAndVal}/g,
    `{${compoundkey}: uniqueProps}`
); */