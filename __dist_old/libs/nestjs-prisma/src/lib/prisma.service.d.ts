import { INestApplication, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaServiceOptions } from './interfaces/prisma-module.options';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly prismaServiceOptions;
    constructor(prismaServiceOptions?: PrismaServiceOptions);
    onModuleInit(): Promise<void>;
    enableShutdownHooks(app: INestApplication): Promise<void>;
}
