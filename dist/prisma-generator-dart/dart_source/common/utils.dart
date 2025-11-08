part of '../abcx3_common.library.dart';

List<T> createModels<T>(List<JsonMap> json, JsonFactory<T> jsonFactory) {
  List<T> instances = [];
  for (final item in json) {
    instances.add(jsonFactory(item));
  }
  return instances;
}

bool areListsEqual<T>(List<T>? list1, List<T>? list2) {
  if (list1 == null && list2 == null) return true;
  if (list1 == null || list2 == null) return false;
  if (list1.length != list2.length) return false;
  for (var i = 0; i < list1.length; i++) {
    if (list1[i] != list2[i]) return false;
  }
  return true;
}

bool listItemsEqualById<T extends UID<K>, K>(List<T> list1, List<T> list2) {
  return list1.length == list2.length && list1.every((item) => list2.any((t) => t.equalById(item)));
}
