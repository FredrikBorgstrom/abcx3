part of '../abcx3_stores_library.dart';

enum LogicalOperator { AND, OR, NOT }

class ModelFilterGroup<T extends PrismaModel> {
  List<PropertyFilter<T>> filters;
  LogicalOperator logicalOperator;

  ModelFilterGroup(this.filters, {this.logicalOperator = LogicalOperator.AND});

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
        logicalOperator == LogicalOperator.AND ? filters.length : 1;
    for (var filter in filters) {
      if (filter.isMatching(item)) {
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
    /*Map<String, dynamic> propertyFiltersMap = {};
    for (var filter in filters) {
      propertyFiltersMap[filter.property] = filter.toJson();
    }*/
    return {
      logicalOperator.name: filters.map((filter) => filter.toJson()).toList(),
    };
  }
}
