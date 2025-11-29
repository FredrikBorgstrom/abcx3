part of '../abcx3_stores_library.dart';

mixin KeyStoreMixin<K, T extends PrismaModel<K, T>> implements KeyStorageInterface<T, K> {
  List<T> _itemsStore = [];
  // Fast key -> model map for uniqueness and O(1) lookups.
  final Map<K, T> _map = {};

  /// override the following getter and setter in your class to change storage engine and
  /// use another variable than _itemsStore to store your items in
  List<T> get items => _itemsStore;

  set items(List<T> items) => setItemsInternal(deduplicateAndIndex(items));

  /// Updates the internal key index from the provided list and
  /// returns the deduplicated list (one per $uid).
  List<T> deduplicateAndIndex(List<T> items) {
    _map.clear();
    for (final item in items) {
      final key = getKey(item);
      assert(key != null, 'All models must have a non-null \$uid.');
      _map[key as K] = item; // last value for a key wins
    }
    return _map.values.toList();
  }

  /// Sets the already-deduplicated list without performing deduplication.
  /// ModelStreamStore overrides this to publish to its stream.
  void setItemsInternal(List<T> items) {
    _itemsStore = items;
  }

  /// end of override

  @override
  void initStorage() {}

  @override
  K? getKey(T item) => item.$uid;

  @override
  List<T> getAll() => items; // .whereType<T>().toList();

  @override
  T? getByKey(K id) => _map[id];

  @override
  List<T> getManyByKeys(List<K> ids) => ids.map((id) => getByKey(id)).whereType<T>().toList();

  T? getByPropertyValue<U>(GetPropertyValueFunction<T, U> getPropVal, value) {
    return items.find((m) => getPropVal(m) == value);
  }

  T? getByPropertyValueAndFilter<U>(GetPropertyValueFunction<T, U> getPropVal, value, {ModelFilter<T>? modelFilter}) {
    final foundItem = getByPropertyValue(getPropVal, value);
    if (foundItem != null && modelFilter != null) {
      return modelFilter.filterOne(foundItem);
    } else {
      return foundItem;
    }
  }

  List<T> getManyByPropertyValue<W>(GetPropertyValueFunction<T, W> getPropVal, value) {
    return items.where((m) => getPropVal(m) == value).toList();
  }

  List<T> getManyByPropertyValueAndFilter<W>(
    GetPropertyValueFunction<T, W> getPropVal,
    value, {
    ModelFilter<T>? modelFilter,
  }) {
    final foundItems = getManyByPropertyValue(getPropVal, value);
    if (foundItems.isNotEmpty && modelFilter != null) {
      return modelFilter.filterMany(items);
    } else {
      return foundItems;
    }
  }

  List<T> getManyByManyValuesAndFilter<W>(
    GetPropertyValueFunction<T, W> getPropVal,
    List<W> values, {
    ModelFilter<T>? modelFilter,
  }) {
    final foundItems = items.where((m) => values.contains(getPropVal(m))).toList();
    if (foundItems.isNotEmpty && modelFilter != null) {
      return modelFilter.filterMany(foundItems);
    } else {
      return foundItems;
    }
  }

  @override
  void add(T item) {
    final key = getKey(item);
    assert(key != null, 'All models must have a non-null \$uid.');
    final existing = _map[key as K];
    if (existing != null) {
      // Merge with existing to avoid duplicates
      _map[key] = existing.mergeWithInstanceValues(item);
    } else {
      _map[key] = item;
    }
    setItemsInternal(_map.values.toList());
  }

  @override
  void addMany(List<T> addedModels) {
    for (final m in addedModels) {
      final k = getKey(m);
      assert(k != null, 'All models must have a non-null \$uid.');
      final existing = _map[k as K];
      _map[k] = existing != null ? existing.mergeWithInstanceValues(m) : m;
    }
    setItemsInternal(_map.values.toList());
  }

  @override
  bool delete(T? item) {
    if (item == null) return false;
    final key = getKey(item);
    assert(key != null, 'All models must have a non-null \$uid.');
    final removed = _map.remove(key as K) != null;
    if (removed) {
      setItemsInternal(_map.values.toList());
    }
    return removed;
  }

  @override
  void deleteMany(List<T> removedItems) {
    for (final m in removedItems) {
      final k = getKey(m);
      assert(k != null, 'All models must have a non-null \$uid.');
      _map.remove(k as K);
    }
    setItemsInternal(_map.values.toList());
  }

  @override
  bool deleteByKey(K key) {
    final removed = _map.remove(key) != null;
    if (removed) {
      setItemsInternal(_map.values.toList());
    }
    return removed;
  }

  @override
  void deleteManyByKeys(List<K> keys) {
    for (var key in keys) {
      _map.remove(key);
    }
    setItemsInternal(_map.values.toList());
  }

  @override
  T? replace(T item) {
    final key = getKey(item);
    assert(key != null, 'All models must have a non-null \$uid.');
    final existing = _map[key as K];
    if (existing == null) return null;
    final replaced = existing.mergeWithInstanceValues(item);
    _map[key] = replaced;
    setItemsInternal(_map.values.toList());
    return replaced;
  }

  // NOTE! Update creates a new instance of the model, and replaces the old one!
  @override
  T? update(T item) {
    final key = getKey(item);
    assert(key != null, 'All models must have a non-null \$uid.');
    final existing = _map[key as K];
    if (existing == null) return null;
    final updated = existing.updateWithInstanceValues(item);
    _map[key] = updated;
    setItemsInternal(_map.values.toList());
    return updated;
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

  @override
  void clear() {
    _map.clear();
    setItemsInternal([]);
  }
}
