"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const constants_1 = require("./constants");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor(prismaServiceOptions = {}) {
        super(prismaServiceOptions.prismaOptions);
        this.prismaServiceOptions = prismaServiceOptions;
        if (this.prismaServiceOptions.middlewares) {
            this.prismaServiceOptions.middlewares.forEach((middleware) => this.$use(middleware));
        }
    }
    onModuleInit() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.prismaServiceOptions.explicitConnect) {
                yield this.$connect();
            }
        });
    }
    enableShutdownHooks(app) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.$on('beforeExit', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield app.close();
            }));
        });
    }
};
PrismaService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Optional)()),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.PRISMA_SERVICE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [Object])
], PrismaService);
exports.PrismaService = PrismaService;
//# sourceMappingURL=prisma.service.js.map