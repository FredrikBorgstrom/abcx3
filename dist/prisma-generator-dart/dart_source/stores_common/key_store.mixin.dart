// import 'package:abcx3/gen_models/common/abcx3_prisma.library.dart';
part of '../abcx3_stores_library.dart';

// typedef GetPropertyValue<T, U> = U? Function(T model);

mixin KeyStoreMixin<K, T extends PrismaModel<K, T>>
    implements KeyStorageInterface<T, K> {
  List<T> _itemsStore = [];

  /// override the following getter and setter in your class to change storage engine and
  /// use another variable than _itemsStore to store your items in
  List<T> get items => _itemsStore;

  set items(List<T> value) => _itemsStore = value;

  /// end of override

  @override
  void initStorage() {}

  @override
  K? getKey(T item) => item.$uid;

  @override
  List<T> getAll() => items; // .whereType<T>().toList();

  @override
  T? getByKey(K id) => items.find((item) => getKey(item) == id);

  @override
  List<T> getManyByKeys(List<K> ids) =>
      ids.map((id) => getByKey(id)).whereType<T>().toList();

  T? getByPropertyValue<U>(GetPropertyValue<T, U> getPropVal, value) {
    return items.find((m) => getPropVal(m) == value);
  }

  List<T> getManyByPropertyValue<W>(GetPropertyValue<T, W> getPropVal, value) {
    return items.where((m) => getPropVal(m) == value).toList();
  }

  @override
  void add(T item) => items = [...items, item];

  @override
  void addMany(List<T> addedModels) => items = [...items, ...addedModels];

  @override
  bool delete(T? item) {
    if (item == null) return false;
    var itemsCopy = [...items];
    bool itemWasRemoved = itemsCopy.remove(item);
    items = itemsCopy;
    return itemWasRemoved;
  }

  @override
  void deleteMany(List<T> removedItems) =>
      items = items.removeList(removedItems).toList();

  @override
  bool deleteByKey(K key) => delete(getByKey(key));

  @override
  void deleteManyByKeys(List<K> keys) {
    for (var key in keys) {
      deleteByKey(key);
    }
  }

  @override
  T? update(T item) {
    int index = items.indexWhere((element) => getKey(element) == getKey(item));
    if (index != -1) {
      final existingItem = items[index];
      T updatedItem = existingItem.copyWithInstance(item);
      items[index] = updatedItem;
      return updatedItem;
    } else {
      return null;
    }
  }

  @override
  List<T?> updateMany(List<T> items) {
    List<T?> updatedModels = [];
    for (var item in items) {
      updatedModels.add(update(item));
    }
    return updatedModels;
  }

  @override
  T upsert(T item) {
    final updatedItem = update(item);
    if (updatedItem != null) {
      return updatedItem;
    } else {
      add(item);
      return item;
    }
  }

  @override
  List<T> upsertMany(List<T> items) {
    final upsertedItems = <T>[];
    for (var item in items) {
      upsertedItems.add(upsert(item));
    }
    return upsertedItems;
  }
}

/*
setKeyStoreMixinStorage<K, T extends UID<K>>(KeyStoreMixin<K, T> store) {
  store.items = items;
}*/
