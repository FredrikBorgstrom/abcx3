export declare const crudServiceStubWithExceptions = "/*\n-----------------------------------------------------\nTHIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n-----------------------------------------------------\n*/\n\nimport {\n    Injectable,\n    InternalServerErrorException,\n    NotFoundException,\n} from '@nestjs/common';\nimport { Prisma, #{Model} } from '@prisma/client';\nimport {\n    PaginationInterface,\n    PrismaService,\n} from '#{PrismaServiceImportPath}';\nimport { err, ok, Result } from 'neverthrow';\n\n@Injectable()\nexport class #{CrudServiceClassName} {\n    constructor(private readonly prismaService: PrismaService) {}\n\n    getPrisma() {\n        return this.prismaService;\n    }\n\n    async create(data: Prisma.#{Model}CreateInput): Promise<Result<#{Model}, Error>> {\n        try {\n            const result = await this.prismaService.#{moDel}.create({ data: data });\n            return ok(result);\n        } catch (e) {\n            return err(new InternalServerErrorException(`Could not create #{Model} Resource.`));\n        }\n    }\n\n    getAll = async () => await this.getFiltered();\n\n    async getFiltered(\n        filter?: Prisma.#{Model}FindManyArgs,\n    ): Promise<Result<PaginationInterface<#{Model}>, Error>> {\n        try {\n            const [items, count] = await this.prismaService.$transaction([\n                this.prismaService.#{moDel}.findMany(filter),\n                this.prismaService.#{moDel}.count({ where: filter?.where }),\n            ]);\n\n            const take = filter?.take ? filter?.take : count;\n            const skip = filter?.skip ? filter?.skip : 0;\n\n            return ok({\n                items: items,\n                meta: {\n                totalItems: count,\n                items: items.length,\n                totalPages: Math.ceil(count / take),\n                page: skip / take + 1,\n                },\n            });\n        }\n        catch(e) {\n            return err(new InternalServerErrorException(`Could not get #{Model} Resources.`));\n        }\n    }\n\n    async getUnique(uniqueArgs: Prisma.#{Model}FindUniqueOrThrowArgs): Promise<Result<#{Model}, Error>> {\n        try {\n            const result = await this.prismaService.#{moDel}.findUniqueOrThrow(uniqueArgs);\n        return ok(result);\n            } catch(e) {\n            return err(new NotFoundException(`Get operation ${uniqueArgs} on #{Model} failed.`));\n        }\n    }\n\n    async update(\n        where: Prisma.#{Model}WhereUniqueInput,\n        data: Prisma.#{Model}UpdateInput,\n    ): Promise<Result<#{Model}, Error>> {\n        try {\n            const result = await this.prismaService.#{moDel}.update({\n                where,\n                data\n            });\n            return ok(result);\n        } catch (e) {\n            return err(new InternalServerErrorException(\n                `Could not update #{Model} where ${where} with data ${data}.`,\n            ));\n        }\n    }\n\n    async delete(where: Prisma.#{Model}WhereUniqueInput): Promise<Result<#{Model}, Error>> {\n        try {\n            const result = await this.prismaService.#{moDel}.delete({ where });\n            return ok(result);\n        } catch (e) {\n            return err(new InternalServerErrorException(\n                `Could not delete #{Model} where ${where}.`,\n            ));\n        }\n    }\n    #{byIdMethods}\n}\n";
export declare const idMethods_neverThrow = "\nasync getById(#{idName}: #{idType}): Promise<Result<#{Model}, Error>> {\n    try {\n    const result = await this.prismaService.#{moDel}.findUniqueOrThrow({\n        where: { #{idName} }\n    });\n    return ok(result);\n    } catch(e) {\n    return err(new NotFoundException(`#{Model} Resource ${id} was not found.`));\n    }\n}\n\nasync updateById(#{idName}: #{idType}, data: Prisma.#{Model}UpdateInput): Promise<Result<#{Model}, Error>> {\n    try {\n        const result = await this.prismaService.#{moDel}.update({\n            where: { #{idName} },\n            data: data,\n        });\n        return ok(result);\n    } catch (e) {\n        return err(new InternalServerErrorException(\n            `Could not update #{Model} Resource ${#{idName}}.`,\n        ));\n    }\n}\n\nasync deleteById(#{idName}: #{idType}): Promise<Result<#{Model}, Error>> {\n    try {\n        const result = await this.prismaService.#{moDel}.delete({ where: { #{idName} } });\n        return ok(result);\n    } catch (e) {\n        return err(new InternalServerErrorException(\n            `Could not delete #{Model} Resource ${#{idName}}.`,\n    ));\n    }\n}\n";
export declare const crudServiceStub = "/*\n-----------------------------------------------------\nTHIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n-----------------------------------------------------\n*/\n\nimport { Injectable } from '@nestjs/common';\nimport { Prisma, #{Model} } from '@prisma/client';\nimport {\n  PaginationInterface,\n  PrismaService,\n} from '@prisma-utils/nestjs-prisma';\n\n@Injectable()\nexport class #{CrudServiceClassName} {\n  constructor(private readonly prismaService: PrismaService) {}\n\n  getPrisma() {\n    return this.prismaService;\n  }\n\n  async getAll(\n    filter?: Prisma.#{Model}FindManyArgs,\n  ): Promise<PaginationInterface<#{Model}>> {\n    const [items, count] = await this.prismaService.$transaction([\n      this.prismaService.#{moDel}.findMany(filter),\n      this.prismaService.#{moDel}.count({ where: filter?.where }),\n    ]);\n\n    const take = filter?.take ? filter?.take : count;\n    const skip = filter?.skip ? filter?.skip : 0;\n\n    return {\n      items: items,\n      meta: {\n        totalItems: count,\n        items: items.length,\n        totalPages: Math.ceil(count / take),\n        page: skip / take + 1,\n      },\n    };\n  }\n\n  async getById(#{idName}: #{idType}): Promise<#{Model}> {\n    const result = await this.prismaService.#{moDel}.findUniqueOrThrow({\n      where: { #{idName} }\n    });\n    return result;\n  }\n\n  async create(data: Prisma.#{Model}CreateInput): Promise<#{Model}> {\n    const result = await this.prismaService.#{moDel}.create({ data: data });\n    return result;\n  }\n\n  async update(\n    #{idName}: #{idType},\n    data: Prisma.#{Model}UpdateInput,\n  ): Promise<#{Model}> {\n    return await this.prismaService.#{moDel}.update({\n      where: { #{idName} },\n      data: data,\n    });\n  }\n\n  async delete(#{idName}: #{idType}): Promise<#{Model}> {\n    return await this.prismaService.#{moDel}.delete({ where: { #{idName} } });\n  }\n}\n";
//# sourceMappingURL=crud.service.stub.d.ts.map