part of '../abcx3_stores_library.dart';

abstract interface class StorageInterface<T> {
  void initStorage();

  List<T> getAll();

  void add(T item);

  void addMany(List<T> items);

  T? update(T item);

  List<T?> updateMany(List<T> items);

  T? upsert(T item);

  List<T?> upsertMany(List<T> items);

  void delete(T item);

  void deleteMany(List<T> items);
}

abstract interface class KeyStorageInterface<T, K> extends StorageInterface<T> {
  K? getKey(T item);

  T? getByKey(K key);

  List<T> getManyByKeys(List<K> keys);

  void deleteByKey(K key);

  void deleteManyByKeys(List<K> keys);
}

/*enum FilterOperator {
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

abstract interface class ModelFilterInterface {
  abstract String property;
  abstract dynamic value;
  abstract FilterOperator operator;
}*/
