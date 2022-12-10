export declare const controllerStub = "\n/*\n-----------------------------------------------------\nTHIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n-----------------------------------------------------\n*/\n\nimport { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';\nimport { Prisma } from '@prisma/client';\nimport { #{CrudServiceName} } from './#{CrudServiceFileName}';\n#{ImportGuardClass}\n\n@Controller('#{model}')\nexport class #{ControllerClassName} {\n  constructor(private readonly service: #{CrudServiceName}) {}\n\n  #{GuardDecorator}\n  @Post()\n  create(@Body() #{moDel}CreateInput: Prisma.#{Model}CreateInput) {\n    return this.service.create(#{moDel}CreateInput);\n  }\n\n  #{GuardDecorator}\n  @Get()\n  getAll() {\n    return this.service.getAll();\n  }\n\n  #{GuardDecorator}\n  @Post()\n  getFiltered(@Body() data: Prisma.#{Model}FindManyArgs) {\n    return this.service.getFiltered(data);\n  }\n\n  #{GuardDecorator}\n  @Post()\n  getUnique(@Body() body: Prisma.#{Model}FindUniqueOrThrowArgs) {\n    return this.service.getUnique(body);\n  }\n\n  #{GuardDecorator}\n  @Post()\n  update(@Body() body: {where: Prisma.#{Model}WhereUniqueInput; data: Prisma.#{Model}UpdateInput}) {\n    return this.service.update( body.where, body.data);\n  }\n\n  #{GuardDecorator}\n  @Get(':id')\n  getById(@Param('id') id: string) {\n    return this.service.getById(+id);\n  }\n\n  #{GuardDecorator}\n  @Patch(':id')\n  updateById (@Param('id') id: string, @Body() data: Prisma.#{Model}UpdateInput) {\n    return this.service.updateById(+id, data);\n  }\n\n  #{GuardDecorator}\n  @Delete(':id')\n  deleteById(@Param('id') id: string) {\n    return this.service.deleteById(+id);\n  }\n}";
//# sourceMappingURL=controller.stub.d.ts.map