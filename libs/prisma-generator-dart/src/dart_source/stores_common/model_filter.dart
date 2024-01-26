part of '../abcx3_stores_library.dart';

/// `ModelFilter` is a generic class that provides functionality to filter a list of items based on certain conditions.
/// It takes a property, value and operator as parameters to perform the filtering.

class ModelFilter<T extends PrismaModel> {

  String property;
  dynamic value;
  FilterOperator operator;

  /// Constructor for the `ModelFilter` class.
  /// It requires a property, value and operator to be passed.
  ModelFilter({
    required this.property,
    required this.value,
    required this.operator,
  });

  /// Method to filter a single item.
  /// It returns the item if it matches the filter condition, otherwise it returns null.
  T? filterItem(T item) {
    return matches(item) ? item : null;
  }

  /// Method to filter a list of items.
  /// It returns a new list containing only the items that match the filter condition.
  List<T> filterItems(List<T> items) {
    return items.where((item) => matches(item)).toList();
  }

  /// Method to check if an item matches the filter condition.
  /// It returns true if the item matches the condition, otherwise it returns false.
  bool matches(T item) {
    final propToValueFunction = item.getPropToValueFunction(property);
    final itemValue = propToValueFunction(item);
    switch (operator) {
      case FilterOperator.equals:
        return itemValue == value;
      case FilterOperator.not:
        return itemValue != value;
      case FilterOperator.gt:
        return itemValue > value;
      case FilterOperator.gte:
        return itemValue >= value;
      case FilterOperator.lt:
        return itemValue < value;
      case FilterOperator.lte:
        return itemValue <= value;
      case FilterOperator.inList:
        return value.contains(itemValue);
      case FilterOperator.notInList:
        return !value.contains(itemValue);
      case FilterOperator.contains:
        return itemValue.contains(value);
      case FilterOperator.startsWith:
        return itemValue.startsWith(value);
      case FilterOperator.endsWith:
        return itemValue.endsWith(value);
      case FilterOperator.notContains:
        return !itemValue.contains(value);
      case FilterOperator.notStartsWith:
        return !itemValue.startsWith(value);
      case FilterOperator.notEndsWith:
        return !itemValue.endsWith(value);
      case FilterOperator.isNull:
        return itemValue == null;
      case FilterOperator.isNotNull:
        return itemValue != null;
      default:
        return false;
    }
  }

  /// Factory constructor to create a new instance of `ModelFilter` from a JSON object.
  factory ModelFilter.fromJson(Map<String, dynamic> json) {
    return ModelFilter(
      property: json['property'],
      value: json['value'],
      operator: json['operator'],
    );
  }

  /// Method to convert the `ModelFilter` instance to a JSON object.
  Map<String, dynamic> toJson() {
    return {
      'property': property,
      'value': value,
      'operator': operator,
    };
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