part of '../abcx3_stores_library.dart';

/// `PropertyFilter` is a class that provides functionality to filter Prisma models.
/// It takes one property, and a list of values and operators as parameters to perform the filtering.

class PropertyFilter<T extends GetPropToValueFunction<T>, V> {
  String property;
  List<FilterOperatorAndValue> operatorsAndValues;

  /// Constructor for the `PropertyFilter` class.
  /// It requires a property, value and operator to be passed.
  PropertyFilter({required this.property, required this.operatorsAndValues});

  /// Method to filter a single item.
  /// It returns the item if it matches the filter condition, otherwise it returns null.
  T? filterItem(T item) {
    return isMatching(item) ? item : null;
  }

  /// Method to filter a list of items.
  /// It returns a new list containing only the items that match the filter conditions.
  List<T> filterItems(List<T> items) {
    return items.where((item) => isMatching(item)).toList();
  }

  /// Method to check if an item matches the filter conditions.
  /// It returns true if the item matches the conditions, otherwise it returns false.
  bool isMatching(T item) {
    int numberOfNotMatchingFilters = operatorsAndValues.length;
    final propertyValueFunction = item.getPropToValueFunction<V>(property);
    final propertyValue = propertyValueFunction(item);
    for (var operatorAndValue in operatorsAndValues) {
      if (_matches(
        propertyValue,
        operatorAndValue.operator,
        operatorAndValue.value,
      )) {
        numberOfNotMatchingFilters--;
      }
    }
    return numberOfNotMatchingFilters == 0;
  }

  bool _matches(dynamic valueA, FilterOperator operator, dynamic valueB) {
    switch (operator) {
      case FilterOperator.equals:
        return valueA == valueB;
      case FilterOperator.not:
        return valueA != valueB;
      case FilterOperator.gt:
        return valueA > valueB;
      case FilterOperator.gte:
        return valueA >= valueB;
      case FilterOperator.lt:
        return valueA < valueB;
      case FilterOperator.lte:
        return valueA <= valueB;
      case FilterOperator.inList:
        return valueB.contains(valueA);
      case FilterOperator.notInList:
        return !valueB.contains(valueA);
      case FilterOperator.contains:
        return valueA.contains(valueB);
      case FilterOperator.startsWith:
        return valueA.startsWith(valueB);
      case FilterOperator.endsWith:
        return valueA.endsWith(valueB);
      case FilterOperator.notContains:
        return !valueA.contains(valueB);
      case FilterOperator.notStartsWith:
        return !valueA.startsWith(valueB);
      case FilterOperator.notEndsWith:
        return !valueA.endsWith(valueB);
      case FilterOperator.isNull:
        return valueA == null;
      case FilterOperator.isNotNull:
        return valueA != null;
    }
  }

  /// Method to convert the `ModelFilter` instance to a JSON object.
  Json toJson() {
    Json operatorsAndValuesMap = {};
    for (var operatorAndValue in operatorsAndValues) {
      operatorsAndValuesMap.addAll(operatorAndValue.toJson());
    }
    return {property: operatorsAndValuesMap};
  }

  /// Factory constructor to create a new instance of `ModelFilter` from a JSON object.
  factory PropertyFilter.fromJson(Json json) {
    return PropertyFilter(
      property: json.keys.first,
      operatorsAndValues: json.values.first
          .map<FilterOperatorAndValue>(
            (operatorAndValue) =>
                FilterOperatorAndValue.fromJson(operatorAndValue),
          )
          .toList(),
    );
  }
}
