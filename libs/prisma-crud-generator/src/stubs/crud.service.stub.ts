export const crudServiceStubWithExceptions = `/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, #{Model} } from '@prisma/client';
import {
    PaginationInterface,
    PrismaService,
} from '@modded-prisma-utils/nestjs-prisma';
import { err, ok, Result } from 'neverthrow';

@Injectable()
export class #{CrudServiceClassName} {
    constructor(private readonly prismaService: PrismaService) {}

    getPrisma() {
        return this.prismaService;
    }

    async create(data: Prisma.#{Model}CreateInput): Promise<Result<#{Model}, Error>> {
        try {
            const result = await this.prismaService.#{moDel}.create({ data: data });
            return ok(result);
        } catch (e) {
            return err(new InternalServerErrorException(\`Could not create #{Model} Resource.\`));
        }
    }

    async getAll(
        filter?: Prisma.#{Model}FindManyArgs,
    ): Promise<Result<PaginationInterface<#{Model}>, Error>> {
        try {
            const [items, count] = await this.prismaService.$transaction([
                this.prismaService.#{moDel}.findMany(filter),
                this.prismaService.#{moDel}.count({ where: filter?.where }),
            ]);

            const take = filter?.take ? filter?.take : count;
            const skip = filter?.skip ? filter?.skip : 0;

            return ok({
                items: items,
                meta: {
                totalItems: count,
                items: items.length,
                totalPages: Math.ceil(count / take),
                page: skip / take + 1,
                },
            });
        }
        catch(e) {
            return err(new InternalServerErrorException(\`Could not get #{Model} Resources.\`));
        }
    }

    async get(uniqueProps: Prisma.#{Model}WhereUniqueInput, include?: Prisma.#{Model}Include): Promise<Result<#{Model}, Error>> {
        try {
            const result = await this.prismaService.#{moDel}.findUniqueOrThrow({
                where: uniqueProps,
                include
            });
        return ok(result);
            } catch(e) {
            return err(new NotFoundException(\`#{Model} Resource with properties \${uniqueProps} was not found.\`));
        }
    }

    async update(
        uniqueProps: Prisma.#{Model}WhereUniqueInput | #{Model},
        data: Prisma.#{Model}UpdateInput,
    ): Promise<Result<#{Model}, Error>> {
        try {
            const result = await this.prismaService.#{moDel}.update({
                where: uniqueProps,
                data: data,
            });
            return ok(result);
        } catch (e) {
            return err(new InternalServerErrorException(
                \`Could not update #{Model} Resource \${uniqueProps}.\`,
            ));
        }
    }

    async delete(uniqueProps: Prisma.#{Model}WhereUniqueInput | #{Model}): Promise<Result<#{Model}, Error>> {
        try {
            const result = await this.prismaService.#{moDel}.delete({ where: uniqueProps });
            return ok(result);
        } catch (e) {
            return err(new InternalServerErrorException(
                \`Could not delete #{Model} Resource \${uniqueProps}.\`,
            ));
        }
    }

    #{byIdMethods}

}
`;

export const idMethods_neverThrow = `
async getById(#{idName}: #{idType}): Promise<Result<#{Model}, Error>> {
    try {
    const result = await this.prismaService.#{moDel}.findUniqueOrThrow({
        where: { #{idName} }
    });
    return ok(result);
    } catch(e) {
    return err(new NotFoundException(\`#{Model} Resource \${id} was not found.\`));
    }
}

async updateById(#{idName}: #{idType}, data: Prisma.#{Model}UpdateInput): Promise<Result<#{Model}, Error>> {
    try {
        const result = await this.prismaService.#{moDel}.update({
            where: { #{idName} },
            data: data,
        });
        return ok(result);
    } catch (e) {
        return err(new InternalServerErrorException(
            \`Could not update #{Model} Resource \${#{idName}}.\`,
        ));
    }
}

async deleteById(#{idName}: #{idType}): Promise<Result<#{Model}, Error>> {
    try {
        const result = await this.prismaService.#{moDel}.delete({ where: { #{idName} } });
        return ok(result);
    } catch (e) {
        return err(new InternalServerErrorException(
            \`Could not delete #{Model} Resource \${#{idName}}.\`,
    ));
    }
}
`;

export const crudServiceStub = `/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { Injectable } from '@nestjs/common';
import { Prisma, #{Model} } from '@prisma/client';
import {
  PaginationInterface,
  PrismaService,
} from '@prisma-utils/nestjs-prisma';

@Injectable()
export class #{CrudServiceClassName} {
  constructor(private readonly prismaService: PrismaService) {}

  getPrisma() {
    return this.prismaService;
  }

  async getAll(
    filter?: Prisma.#{Model}FindManyArgs,
  ): Promise<PaginationInterface<#{Model}>> {
    const [items, count] = await this.prismaService.$transaction([
      this.prismaService.#{moDel}.findMany(filter),
      this.prismaService.#{moDel}.count({ where: filter?.where }),
    ]);

    const take = filter?.take ? filter?.take : count;
    const skip = filter?.skip ? filter?.skip : 0;

    return {
      items: items,
      meta: {
        totalItems: count,
        items: items.length,
        totalPages: Math.ceil(count / take),
        page: skip / take + 1,
      },
    };
  }

  async getById(#{idName}: #{idType}): Promise<#{Model}> {
    const result = await this.prismaService.#{moDel}.findUniqueOrThrow({
      where: { #{idName} }
    });
    return result;
  }

  async create(data: Prisma.#{Model}CreateInput): Promise<#{Model}> {
    const result = await this.prismaService.#{moDel}.create({ data: data });
    return result;
  }

  async update(
    #{idName}: #{idType},
    data: Prisma.#{Model}UpdateInput,
  ): Promise<#{Model}> {
    return await this.prismaService.#{moDel}.update({
      where: { #{idName} },
      data: data,
    });
  }

  async delete(#{idName}: #{idType}): Promise<#{Model}> {
    return await this.prismaService.#{moDel}.delete({ where: { #{idName} } });
  }
}
`;
