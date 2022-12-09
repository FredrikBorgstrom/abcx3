export const controllerStub = `
/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { #{GuardClass} } from '#{GuardImportPath}';
import { DictionaryService } from './dictionary.service';

@Controller('dictionaries')
export class #{ControllerClassName} {
  constructor(private readonly dictionaryService: DictionaryService) {}

  #{GuardDecorator}
  @Post()
  create(@Body() dictionaryCreateInput: Prisma.DictionaryCreateInput) {
    return this.dictionaryService.create(dictionaryCreateInput);
  }

  #{GuardDecorator}
  @Get()
  getAll() {
    return this.dictionaryService.getAll();
  }

  #{GuardDecorator}
  @Post()
  getFiltered(@Body() data: Prisma.DictionaryFindManyArgs) {
    return this.dictionaryService.getFiltered(data);
  }

  #{GuardDecorator}
  @Post()
  getUnique(@Body() body: Prisma.DictionaryFindUniqueOrThrowArgs) {
    return this.dictionaryService.getUnique(body);
  }

  #{GuardDecorator}
  @Post()
  update(@Body() body: {where: Prisma.DictionaryWhereUniqueInput; data: Prisma.DictionaryUpdateInput}) {
    return this.dictionaryService.update( body.where, body.data);
  }

  #{GuardDecorator}
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dictionaryService.getById(+id);
  }

  #{GuardDecorator}
  @Patch(':id')
  updateById (@Param('id') id: string, @Body() data: Prisma.DictionaryUpdateInput) {
    return this.dictionaryService.updateById(+id, data);
  }

  #{GuardDecorator}
  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.dictionaryService.deleteById(+id);
  }
}`