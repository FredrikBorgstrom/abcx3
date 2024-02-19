part of '../abcx3_stores_library.dart';

class ModelFilter<T extends GetPropToValueFunction> {
  List<LogicalFilterGroup> filters;

  ModelFilter(this.filters);

  filterOne(T item) {
    return filtersMatch(item) ? item : null;
  }

  List<T> filterMany(List<T> items) {
    return items.where((item) => filtersMatch(item)).toList();
  }

  filtersMatch(T item) {
    return filters.every((filter) => filter.filtersMatch(item));
  }

  factory ModelFilter.fromJson(Json json) {
    return ModelFilter(
      json['filters'],
    );
  }

  Json toJson() {
    Json map = {};
    for (var filter in filters) {
      map.addAll(filter.toJson());
    }
    return map;
  }
}
