part of '../abcx3_common.library.dart';

List<T> createModels<T>(json, JsonFactory<T> jsonFactory) {
  List<T> instances = [];
  for (final item in json) {
    instances.add(jsonFactory(item as Json));
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
