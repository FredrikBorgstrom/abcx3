"use strict";
var PrismaModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const prisma_service_1 = require("./prisma.service");
let PrismaModule = PrismaModule_1 = class PrismaModule {
    static forRoot(options = {}) {
        return {
            global: options.isGlobal,
            module: PrismaModule_1,
            providers: [
                {
                    provide: constants_1.PRISMA_SERVICE_OPTIONS,
                    useValue: options.prismaServiceOptions,
                },
            ],
        };
    }
    static forRootAsync(options) {
        return {
            global: options.isGlobal,
            module: PrismaModule_1,
            imports: options.imports || [],
            providers: this.createAsyncProviders(options),
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return this.createAsyncOptionsProvider(options);
        }
        if (options.useClass) {
            return [
                ...this.createAsyncOptionsProvider(options),
                {
                    provide: options.useClass,
                    useClass: options.useClass,
                },
            ];
        }
        return [...this.createAsyncOptionsProvider(options)];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return [
                {
                    provide: constants_1.PRISMA_SERVICE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
            ];
        }
        if (options.useExisting) {
            return [
                {
                    provide: constants_1.PRISMA_SERVICE_OPTIONS,
                    useFactory: (optionsFactory) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield optionsFactory.createPrismaOptions(); }),
                    inject: [options.useExisting],
                },
            ];
        }
        if (options.useClass) {
            return [
                {
                    provide: constants_1.PRISMA_SERVICE_OPTIONS,
                    useFactory: (optionsFactory) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield optionsFactory.createPrismaOptions(); }),
                    inject: [options.useClass],
                },
            ];
        }
        return [
            {
                provide: constants_1.PRISMA_SERVICE_OPTIONS,
                useFactory: (optionsFactory) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield optionsFactory.createPrismaOptions(); }),
                inject: [],
            },
        ];
    }
};
PrismaModule = PrismaModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);
exports.PrismaModule = PrismaModule;
//# sourceMappingURL=prisma.module.js.map