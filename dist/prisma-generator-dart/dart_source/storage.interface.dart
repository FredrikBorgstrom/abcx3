abstract interface class StorageInterface<T> {
  void initStorage();

  List<T> getAll();

  void addOne(T item);

  void addMany(List<T> items);

  T? updateOne(T item);

  List<T?> updateMany(List<T> items);

  T? upsertOne(T item);

  List<T?> upsertMany(List<T> items);

  void deleteOne(T item);

  void deleteMany(List<T> items);

}

abstract interface class KeyStorageInterface<T, K> extends StorageInterface<T> {

  K? getKey(T item);

  T? getOneByKey(K key);

  List<T> getManyByKeys(List<K> keys);

  void deleteOneByKey(K key);

  void deleteManyByKeys(List<K> keys);
}
