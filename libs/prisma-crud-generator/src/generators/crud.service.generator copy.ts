import { GeneratorSettings } from './../interfaces/generator.interface';
import { DMMF } from '@prisma/generator-helper';
import {
    crudServiceStub_old,
    crudServiceStubWithExceptions_old,
    get_neverThrow_old,
    getWithInclude_neverThrow_old,
    idMethods_neverThrow_old
} from './../stubs/crud.service.stub copy';
import * as path from 'path';
import { promises as fs } from 'fs';
import { lowerCaseFirstChar } from '../utils/utils';
import { FieldNameAndType, PrismaHelper } from '../helpers/prisma.helper';

export class CrudServiceGenerator_old {

    private prismaHelper: PrismaHelper;

    constructor(
        private config: GeneratorSettings,
        private model: DMMF.Model,
        private className: string,
    ) {
        this.prismaHelper = PrismaHelper.getInstance();
     }

    public async generateContent() {
        let crudServiceContent: string;

        if (this.config.CRUDAddExceptions === 'true') {
            crudServiceContent = crudServiceStubWithExceptions_old;
            crudServiceContent = crudServiceContent.replace(
                /#{getMethod_neverThrow}/g,
                this.prismaHelper.modelContainsObjectReference(this.model) ? getWithInclude_neverThrow_old: get_neverThrow_old);
        } else {
            crudServiceContent = crudServiceStub_old;
        }

        if (this.config.CRUDStubFile) {
            const stubFullPath = path.join(
                this.config.schemaPath,
                this.config.CRUDStubFile,
            );
            console.log(`Loading Stubs from ${stubFullPath}`);

            const customStub = await fs.readFile(stubFullPath, { encoding: 'utf-8' });
            crudServiceContent = customStub.toString();
        }

        crudServiceContent = crudServiceContent.replace(/#{PrismaServiceImportPath}/g, this.config.PrismaServiceImportPath)

        const idFieldAndType = this.prismaHelper.getIdFieldNameAndType(this.model);

        // if the model has a unique ID field we insert '...byId' methods:
        if (idFieldAndType) {
            crudServiceContent = crudServiceContent.replace(
                /#{byIdMethods}/g,
                idMethods_neverThrow_old
            );
            crudServiceContent = this.replaceInIdMethods(crudServiceContent, idFieldAndType);
        } else {
            crudServiceContent = crudServiceContent.replace(
                /#{byIdMethods}/g,
                ''
            );

            let compoundkey = PrismaHelper.getInstance().getUniqueInputPropertyName(this.model);
            let compoundType = PrismaHelper.getInstance().getUniqueInputType(this.model);
            let prismaCompoundInputType = `Prisma.${this.model.name}${compoundType}CompoundUniqueInput`;

            crudServiceContent = crudServiceContent.replace(
                /#{uniqueInputType}/g,
                prismaCompoundInputType
            );

            crudServiceContent = crudServiceContent.replace(
                /#{uniqueKeyAndVal}/g,
                `{${compoundkey}: uniqueProps}`
            );
        }

        crudServiceContent = crudServiceContent.replace(
            /#{CrudServiceClassName}/g,
            this.className,
        );

        crudServiceContent = crudServiceContent.replace(
            /#{Model}/g,
            this.model.name,
        );
        crudServiceContent = crudServiceContent.replace(
            /#{MODEL}/g,
            this.model.name.toUpperCase(),
        );
        crudServiceContent = crudServiceContent.replace(
            /#{model}/g,
            this.model.name.toLowerCase(),
        );
        crudServiceContent = crudServiceContent.replace(
            /#{moDel}/g,
            lowerCaseFirstChar(this.model.name),
        );
        return crudServiceContent;
    }

    replaceInIdMethods(content: string, fieldNameAndType: FieldNameAndType) {
        content = content.replace(
            /#{idName}/g,
            fieldNameAndType.name
        );

        content = content.replace(
            /#{idType}/g,
            fieldNameAndType.type
        );

        content = content.replace(
            /#{uniqueInputType}/g,
            `Prisma.${this.model.name}WhereUniqueInput`
        );

        content = content.replace(
            /#{uniqueKeyAndVal}/g,
            "uniqueProps"
        );
        return content;
    }
}


