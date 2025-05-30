part of '../abcx3_stores_library.dart';

enum LogicalOperator { AND, OR, NOT, XOR, XNOR }

/// `LogicalFilterGroup` is a class that provides functionality to filter Prisma models.
/// It takes a list of `PropertyFilter` objects and a logical operator as parameters to perform the filtering.
/// The `filtersMatch` method is used to check if an item matches the filter conditions.
/// The `filterOne` method is used to filter a single item.
/// The `filterMany` method is used to filter a list of items.

class LogicalFilterGroup<T extends GetPropToValueFunction> {
  List<PropertyFilter> filters;
  LogicalOperator logicalOperator;

  LogicalFilterGroup(
    this.filters, {
    this.logicalOperator = LogicalOperator.AND,
  });

  T? filterOne(T item) {
    return filtersMatch(item) ? item : null;
  }

  List<T> filterMany(List<T> items) {
    return items.where((item) => filtersMatch(item)).toList();
  }

  bool filtersMatch(T item) {
    switch (logicalOperator) {
      case LogicalOperator.AND:
        return filters.every((filter) => filter.isMatching(item));
      case LogicalOperator.OR:
        return filters.any((filter) => filter.isMatching(item));
      case LogicalOperator.NOT:
        return filters.every((filter) => !filter.isMatching(item));
      case LogicalOperator.XOR:
        return filters.any((filter) => filter.isMatching(item)) &&
            filters.where((filter) => filter.isMatching(item)).length == 1;
      case LogicalOperator.XNOR:
        return filters.every((filter) => filter.isMatching(item)) ||
            filters.where((filter) => filter.isMatching(item)).length ==
                filters.length;
    }
  }

  factory LogicalFilterGroup.fromJson(Json json) {
    return LogicalFilterGroup(
      json['filters'],
      logicalOperator: json['logicalOperator'],
    );
  }

  Json toJson() {
    return {
      logicalOperator.name: filters.map((filter) => filter.toJson()).toList(),
    };
  }
}
