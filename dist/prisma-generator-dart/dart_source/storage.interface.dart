part of abcx3_prisma;

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

abstract interface class KeyStorageInterface<T, U> extends StorageInterface<T> {
  U? getKey(T item);

  T? getOneByKey(U key);

  List<T> getManyByKeys(List<U> keys);

  void deleteOneByKey(U key);

  void deleteManyByKeys(List<U> keys);
}
