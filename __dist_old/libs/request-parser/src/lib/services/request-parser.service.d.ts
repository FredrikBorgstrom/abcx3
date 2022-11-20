import { ParsedQueryModel } from '../models/parsed-query.model';
import { RequestQueryOptions } from '../models/request-query.options';
export declare class RequestParserService {
    private query;
    private options;
    parseQuery(query: any, options?: Partial<RequestQueryOptions>): ParsedQueryModel;
    private parsePage;
    private parseLimit;
    private calculateSkip;
    private parseFilter;
    private parseSort;
}
