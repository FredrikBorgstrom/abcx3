import { DynamicModule } from '@nestjs/common';
import { PrismaModuleAsyncOptions, PrismaModuleOptions } from './interfaces/prisma-module.options';
export declare class PrismaModule {
    static forRoot(options?: PrismaModuleOptions): DynamicModule;
    static forRootAsync(options: PrismaModuleAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
