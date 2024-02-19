part of '../abcx3_stores_library.dart';

enum LogicalOperator { AND, OR, NOT }

class LogicalFilterGroup<T extends GetPropToValueFunction> {
  List<PropertyFilter<T>> filters;
  LogicalOperator logicalOperator;

  LogicalFilterGroup(this.filters,
      {this.logicalOperator = LogicalOperator.AND});

  T? filterOne(T item) {
    return filtersMatch(item) ? item : null;
    /* if (filtersMatch(item) && logicalOperator != LogicalOperator.NOT) {
      return item;
    } else {
      return null;
    }*/
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
      default:
        return false;
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

/*bool filtersMatch(T item) {

    /// for the NOT operator to match, all the filters must return FALSE
    final filtersMatch = logicalOperator == LogicalOperator.NOT ? false : true;


    /// If the logical operator is OR, then only one filter must match.
    /// If the logical operator is NOT and AND, then every filter must match.
    int requiredNumberOfMatches = (logicalOperator == LogicalOperator.OR) ? 1 : filters.length;
    for (var filter in filters) {
      if (filter.isMatching(item)) {
        requiredNumberOfMatches--;
      }
      if (requiredNumberOfMatches == 0) {
        return true;
      }
    }
    return false;
  }*/
