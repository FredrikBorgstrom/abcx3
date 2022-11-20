"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestParser = void 0;
const common_1 = require("@nestjs/common");
const request_parser_service_1 = require("../services/request-parser.service");
exports.RequestParser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return new request_parser_service_1.RequestParserService().parseQuery(request.query, data);
});
//# sourceMappingURL=request-parser.decorator.js.map