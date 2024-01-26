part of '../abcx3_stores_library.dart';

enum LogicalOperator { and, or }

class ModelFilterGroup<T extends PrismaModel> {
  List<ModelFilter<T>> filters;
  LogicalOperator logicalOperator;

  ModelFilterGroup(this.filters, {this.logicalOperator = LogicalOperator.and});

  T? filterOne(T item) {
    if (filtersMatch(item)) {
      return item;
    } else {
      return null;
    }
  }

  List<T> filterMany(List<T> items) {
    return items.where((item) => filtersMatch(item)).toList();
  }

  bool filtersMatch(T item) {
    int requiredNumberOfMatches =
        logicalOperator == LogicalOperator.and ? filters.length : 1;
    for (var filter in filters) {
      if (filter.matches(item)) {
        requiredNumberOfMatches--;
      }
      if (requiredNumberOfMatches == 0) {
        return true;
      }
    }
    return false;
  }

  factory ModelFilterGroup.fromJson(Map<String, dynamic> json) {
    return ModelFilterGroup(
      json['filters'],
      logicalOperator: json['logicalOperator'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'filters': filters,
      'logicalOperator': logicalOperator,
    };
  }
}
