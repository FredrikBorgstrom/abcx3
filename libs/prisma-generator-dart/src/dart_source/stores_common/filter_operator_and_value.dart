part of '../abcx3_stores_library.dart';

class FilterOperatorAndValue {
  FilterOperator operator;
  dynamic value;

  FilterOperatorAndValue(this.operator, this.value);

  Map<String, dynamic> toJson() {
    return {
      operator.name: value,
    };
  }

  factory FilterOperatorAndValue.fromJson(Map<String, dynamic> json) {
    return FilterOperatorAndValue(
      json['operator'],
      json['value'],
    );
  }
}

/// `FilterOperator` is an enumeration that defines the different types of operators that can be used in the `ModelFilter` class.
enum FilterOperator {
  equals,
  not,
  gt,
  gte,
  lt,
  lte,
  inList,
  notInList,
  contains,
  startsWith,
  endsWith,
  notContains,
  notStartsWith,
  notEndsWith,
  isNull,
  isNotNull,
}
