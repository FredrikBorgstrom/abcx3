import { GeneratorSettings } from './../interfaces/generator.interface';
import { DMMF } from '@prisma/generator-helper';
import {
    crudServiceStub,
    crudServiceStubWithExceptions,
    idMethods_neverThrow
} from './../stubs/crud.service.stub';
import * as path from 'path';
import { promises as fs } from 'fs';
import { FieldNameAndType, PrismaHelper } from '../helpers/prisma.helper';
import { NameGenerator } from '../nameGenerator';
import { StringFns } from '../../../shared/src/stringFns';

export class CrudServiceGenerator {

    private prismaHelper: PrismaHelper;

    constructor(
        private settings: GeneratorSettings,
        private model: DMMF.Model
    ) {
        this.prismaHelper = PrismaHelper.getInstance();
    }

    public async generateContent() {
        let nameGen = NameGenerator.singleton;
        let content: string;

        if (this.settings?.CRUDAddExceptions) {
            content = crudServiceStubWithExceptions;
            /*  content = content.replace(
                 /#{getMethod_neverThrow}/g,
                 this.prismaHelper.modelContainsObjectReference(this.model) ? getWithInclude_neverThrow: get_neverThrow); */
        } else {
            content = crudServiceStub;
        }
        content = content.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);
        if (this.settings.CRUDStubFile) {
            const stubFullPath = path.join(this.settings.schemaPath, this.settings.CRUDStubFile);
            console.log(`Loading Stubs from ${stubFullPath}`);

            const customStub = await fs.readFile(stubFullPath, { encoding: 'utf-8' });
            content = customStub.toString();
        }

        content = content.replace(/#{PrismaServiceImportPath}/g, this.settings.PrismaServiceImportPath)

        const idFieldAndType = this.prismaHelper.getIdFieldNameAndType(this.model);

        // if the model has a unique ID field we insert '...byId' methods:
        if (idFieldAndType) {
            content = content.replace(/#{byIdMethods}/g, idMethods_neverThrow);
            content = this.replaceInIdMethods(content, idFieldAndType);
        } else {
            content = content.replace(/#{byIdMethods}/g, '');
        }

        content = content.replace(/#{CrudServiceClassName}/g, nameGen.getClassName(this.model, 'service'));

        content = content.replace(/#{Model}/g, this.model.name);
        content = content.replace(/#{MODEL}/g, this.model.name.toUpperCase());
        content = content.replace(/#{model}/g, this.model.name.toLowerCase());
        content = content.replace(/#{moDel}/g, StringFns.decapitalize(this.model.name));
        return content;
    }

    replaceInIdMethods(content: string, fieldNameAndType: FieldNameAndType) {
        content = content.replace(/#{idName}/g, fieldNameAndType.name);
        content = content.replace(/#{idType}/g, fieldNameAndType.type);
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