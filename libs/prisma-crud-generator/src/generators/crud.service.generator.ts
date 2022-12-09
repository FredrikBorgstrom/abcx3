import { GeneratorSettings } from './../interfaces/generator.interface';
import { DMMF } from '@prisma/generator-helper';
import {
    crudServiceStub,
    crudServiceStubWithExceptions,
    idMethods_neverThrow
} from './../stubs/crud.service.stub';
import * as path from 'path';
import { promises as fs } from 'fs';
import { lowerCaseFirstChar } from '../utils/utils';
import { FieldNameAndType, PrismaHelper } from '../helpers/prisma.helper';

export class CrudServiceGenerator {

    private prismaHelper: PrismaHelper;

    constructor(
        private config: GeneratorSettings,
        private model: DMMF.Model,
        private className: string,
    ) {
        this.prismaHelper = PrismaHelper.getInstance();
     }

    public async generateContent() {
        let content: string;

        if (this.config.CRUDAddExceptions === 'true') {
            content = crudServiceStubWithExceptions;
           /*  content = content.replace(
                /#{getMethod_neverThrow}/g,
                this.prismaHelper.modelContainsObjectReference(this.model) ? getWithInclude_neverThrow: get_neverThrow); */
        } else {
            content = crudServiceStub;
        }

        if (this.config.CRUDStubFile) {
            const stubFullPath = path.join(
                this.config.schemaPath,
                this.config.CRUDStubFile,
            );
            console.log(`Loading Stubs from ${stubFullPath}`);

            const customStub = await fs.readFile(stubFullPath, { encoding: 'utf-8' });
            content = customStub.toString();
        }

        content = content.replace(/#{PrismaServiceImportPath}/g, this.config.PrismaServiceImportPath)

        const idFieldAndType = this.prismaHelper.getIdFieldNameAndType(this.model);

        // if the model has a unique ID field we insert '...byId' methods:
        if (idFieldAndType) {
            content = content.replace(
                /#{byIdMethods}/g,
                idMethods_neverThrow
            );
            content = this.replaceInIdMethods(content, idFieldAndType);
        } else {
            content = content.replace(
                /#{byIdMethods}/g,
                ''
            );

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
        }

        content = content.replace(
            /#{CrudServiceClassName}/g,
            this.className,
        );

        content = content.replace(
            /#{Model}/g,
            this.model.name,
        );
        content = content.replace(
            /#{MODEL}/g,
            this.model.name.toUpperCase(),
        );
        content = content.replace(
            /#{model}/g,
            this.model.name.toLowerCase(),
        );
        content = content.replace(
            /#{moDel}/g,
            lowerCaseFirstChar(this.model.name),
        );
        return content;
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

        /* content = content.replace(
            /#{uniqueKeyAndVal}/g,
            "uniqueProps"
        ); */
        return content;
    }
}


