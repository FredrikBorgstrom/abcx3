import { GeneratorInterface } from './../interfaces/generator.interface';
import { DMMF } from '@prisma/generator-helper';
import {
  crudServiceStub,
  crudServiceStubWithExceptions,
} from './../stubs/crud.service.stub';
import * as path from 'path';
import { promises as fs } from 'fs';
import { lowerCaseFirstChar } from '../utils/utils';
import { PrismaHelper } from '../helpers/prisma.helper';

export class CrudServiceGenerator {
  constructor(
    private config: GeneratorInterface,
    private model: DMMF.Model,
    private className: string,
  ) {}

  public async generateContent() {
    let crudServiceContent: string;

    if (this.config.CRUDAddExceptions === 'true') {
      crudServiceContent = crudServiceStubWithExceptions;
    } else {
      crudServiceContent = crudServiceStub;
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

    // isId
    
    // replace variables
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

    const idNameAndType = this.getIdFieldNameAndType(this.model);

    if (idNameAndType) {
        crudServiceContent = crudServiceContent.replace(
            /#{idName}/g,
            idNameAndType.name
        );

        crudServiceContent = crudServiceContent.replace(
            /#{idType}/g,
            idNameAndType.type
        );
    }
    

    return crudServiceContent;
  }

  

  private getIdFieldNameAndType(model: DMMF.Model): FieldNameAndType | null {
    const primaryKey = model.primaryKey;
    // const fieldType: Int;
    if (primaryKey?.fields) {
        // getMapTypeFromDMMF
    } else {
        const idField = model.fields.find(field => field.isId === true);
        if (idField) {
            const mapType = PrismaHelper.getInstance().getMapTypeFromDMMF(idField);
            const nameAndType = {
                name: idField.name,
                type: mapType.tsType
            };
            return nameAndType;
        }
    }
    return null;
  }
}

interface FieldNameAndType {
    name: string;
    type: string;
  }
