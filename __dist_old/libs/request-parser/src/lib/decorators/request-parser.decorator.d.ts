import { RequestQueryOptions } from '../models/request-query.options';
export declare const RequestParser: (...dataOrPipes: (Partial<RequestQueryOptions> | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
