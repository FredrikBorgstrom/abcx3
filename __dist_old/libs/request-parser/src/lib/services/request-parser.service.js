"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestParserService = void 0;
const common_1 = require("@nestjs/common");
const defaultRequestQueryOptions = {
    limitParamName: 'limit',
    limitDefaultValue: 20,
    maxLimit: 100,
    filterParamName: 'filter',
    filterDefaultValue: {},
    pageParamName: 'page',
    pageDefaultValue: 1,
    orderParamName: 'sort',
    orderDefaultValue: 'id',
};
class RequestParserService {
    constructor() {
        this.options = defaultRequestQueryOptions;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseQuery(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query, options = {}) {
        if (typeof query !== 'object') {
            throw new common_1.BadRequestException('Malformed QueryString');
        }
        this.options = Object.assign(Object.assign({}, defaultRequestQueryOptions), options);
        this.query = query;
        const page = this.parsePage();
        const limit = this.parseLimit();
        const sort = this.parseSort();
        const filter = this.parseFilter();
        return {
            page: page,
            skip: this.calculateSkip(page, limit),
            take: limit,
            sort: sort,
            filter: filter,
        };
    }
    parsePage() {
        const pageRequestData = this.query[this.options.pageParamName];
        const page = parseInt(pageRequestData) || this.options.pageDefaultValue;
        if (page < 1) {
            return this.options.pageDefaultValue;
        }
        return page;
    }
    parseLimit() {
        const limitRequestData = this.query[this.options.limitParamName];
        let limit = parseInt(limitRequestData) || this.options.limitDefaultValue;
        if (limit < 1) {
            limit = this.options.limitDefaultValue;
        }
        if (limit > this.options.maxLimit) {
            limit = this.options.maxLimit;
        }
        return limit;
    }
    calculateSkip(page, limit) {
        return (page - 1) * limit;
    }
    parseFilter() {
        let filter = {};
        const filterRequestData = this.query[this.options.filterParamName] ||
            this.options.filterDefaultValue;
        try {
            filter = JSON.parse(filterRequestData);
        }
        catch (e) {
            return filter;
        }
        return filter;
    }
    parseSort() {
        const sort = [];
        const sortRequestData = this.query[this.options.orderParamName] || this.options.orderDefaultValue;
        const sortQuery = sortRequestData.trim();
        if (sortQuery !== undefined) {
            if (sortQuery.length > 0) {
                const sortParams = sortQuery.split(',');
                for (let sortParam of sortParams) {
                    sortParam = sortParam.trim();
                    let sortDirection = 'asc';
                    if (sortParam.startsWith('-')) {
                        sortParam = sortParam.substring(1);
                        sortDirection = 'desc';
                    }
                    sort.push({ [sortParam]: sortDirection });
                }
            }
        }
        return sort;
    }
}
exports.RequestParserService = RequestParserService;
//# sourceMappingURL=request-parser.service.js.map