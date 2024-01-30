export const controllerStub = `
#{AutoGeneratedWarningText}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, } from '@nestjs/common';
import { #{ServiceName} } from './#{CrudServiceFileName}';
import { StorePostData} from '../store_common';
import { Prisma } from "@prisma/client";
#{ImportGuardClass}

interface #{Model}PostData {
	modelFilter?: Prisma.#{Model}WhereInput;
}

@Controller('#{moDel}')
export class #{ControllerClassName} {
  constructor(protected readonly service: #{ServiceName}) {}

#{getAll}

#{getByFieldValues}

// #{create}

// #{getFilteredPage}

// #{getUnique}
 
// #{update}
  
// #{getById}

// #{updateById}

// #{deleteById}

// #{referenceField}
  
}`;

export const controllerGetByFieldValuesStub = `
#{GuardDecorator}
    @Post('by#{FieldNameCapitalized}/:#{fieldName}')
    getBy#{FieldNameCapitalized}(@Req() req, @Param('#{fieldName}') #{fieldName}: string, @Body() data?: #{Model}PostData) {
        return this.service.getByFieldValues({#{fieldName}: #{convertToInt}#{fieldName}}, data?.modelFilter);
    }
`;

export const controllerGetManyByFieldValuesStub = `
#{GuardDecorator}
    @Post('by#{FieldNameCapitalized}/:#{fieldName}')
    getBy#{FieldNameCapitalized}(@Req() req, @Param('#{fieldName}') #{fieldName}: string, @Body() data?: #{Model}PostData) {
        return this.service.getManyByFieldValues({#{fieldName}: #{convertToInt}#{fieldName}}, data?.modelFilter);
    }
`;

export const controllerCreateStub = `
#{GuardDecorator}
  @Post('create')
  create(@Body() #{moDel}CreateInput: Prisma.#{Model}CreateInput) {
    return this.service.create(#{moDel}CreateInput);
  }
`;

export const controllerGetAllStub = `
#{GuardDecorator}
@Post()
getAll(@Body() data?: #{Model}PostData) {
  return this.service.getAll(data?.modelFilter);
}
`;

export const controllerGetFilteredPageStub = `
#{GuardDecorator}
  @Post('getFilteredPage')
  getFilteredPage(@Body() data: Prisma.#{Model}FindManyArgs) {
    return this.service.getFilteredPage(data);
  }
`;

export const controllerGetUniqueStub = `
#{GuardDecorator}
@Post('unique')
getUnique(@Body() body: Prisma.#{Model}FindUniqueOrThrowArgs) {
  return this.service.getUnique(body);
}
`;

export const controllerUpdateStub = `
#{GuardDecorator}
  @Post('update')
  update(@Body() body: {where: Prisma.#{Model}WhereUniqueInput; data: Prisma.#{Model}UpdateInput}) {
    return this.service.update({where: body.where, data: body.data});
  }
`;

export const controllerGetByIdStub = `
#{GuardDecorator}
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(#{convertToInt}id);
  }
`;

export const controllerUpdateByIdStub = `
#{GuardDecorator}
    @Patch(':id')
    updateById (@Param('id') id: string, @Body() data: Prisma.#{Model}UpdateInput) {
        return this.service.updateById(#{convertToInt}id, data);
    }
`;

export const controllerDeleteByIdStub = `
#{GuardDecorator}
    @Delete(':id')
    deleteById(@Param('id') id: string) {
        return this.service.deleteById(#{convertToInt}id);
    }
`;

export const controllerReferenceFieldStub = `
#{GuardDecorator}
  @Post('#{RelationFieldName}')
  get#{RelationFieldNameCapitalized}(@Body() body: Prisma.#{Model}WhereUniqueInput) {
    return this.service.get#{RelationFieldNameCapitalized}(body);
  }
`;

export const controllerMethodStubs = {
    getAll: controllerGetAllStub,
    // getByFieldValues: controllerGetByFieldValuesStub,
    // getManyByFieldValues: controllerGetManyByFieldValuesStub,
    // create: controllerCreateStub,
    // getFilteredPage: controllergetFilteredPageStub,
    // getUnique: controllerGetUniqueStub,
    // update: controllerUpdateStub,
    // getById: controllerGetByIdStub,
    // updateById: controllerUpdateByIdStub,
    // deleteById: controllerDeleteByIdStub,
    // referenceField: controllerReferenceFieldStub
}

export const controllerMethodNames = Object.keys(controllerMethodStubs);

/* export const controllerIdMethodsStub = `
#{GuardDecorator}
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(#{convertToInt}id);
  }

  #{GuardDecorator}
  @Patch(':id')
  updateById (@Param('id') id: string, @Body() data: Prisma.#{Model}UpdateInput) {
    return this.service.updateById(#{convertToInt}id, data);
  }

  #{GuardDecorator}
  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(#{convertToInt}id);
  }` */