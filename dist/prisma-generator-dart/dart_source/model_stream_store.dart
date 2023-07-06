part of abcx3_prisma;

typedef ModelStreamStore<M, U> = _ModelStreamStore<M, U, PrismaModel<M, U>>;

class _ModelStreamStore<M, K, T extends PrismaModel<M, K>>
    implements KeyStorageInterface<T, K> {
  final BehaviorSubject<List<T>> _models$$ = BehaviorSubject.seeded([]);

  late final Stream<List<T>> models$ = _models$$.stream;

  List<T> get models => _models$$.value;

  @override
  void initStorage() {}

  @override
  K? getKey(T item) => item.uniqueId;

  @override
  List<T> getAll() => models; // .whereType<T>().toList();

  @override
  T? getOneByKey(K? id) => models.find((item) => getKey(item) == id);

  @override
  List<T> getManyByKeys(List<K> ids) =>
      ids.map((id) => getOneByKey(id)).whereType<T>().toList();

  @override
  void addOne(T model) => _models$$.add([...models, model]);

  @override
  void addMany(List<T> addedModels) =>
      _models$$.add([...models, ...addedModels]);

  @override
  void deleteOne(T model) {
    final updatedModels = [...models];
    updatedModels.remove(model);
    _models$$.add(updatedModels);
  }

  @override
  void deleteMany(List<T> removedModels) =>
      _models$$.add(models.removeList(removedModels).toList());

  @override
  void deleteOneByKey(K key) {
    final model = getOneByKey(key);
    if (model != null) {
      deleteOne(getOneByKey(key)!);
    }
  }

  @override
  void deleteManyByKeys(List<K> keys) {
    for (var key in keys) {
      deleteOneByKey(key);
    }
  }

  @override
  T? updateOne(T model) {
    K? keyVal = getKey(model);
    if (keyVal != null) {
      T? existingModel = getOneByKey(keyVal);
      if (existingModel != null) {
        T updatedModel = existingModel.copyWithInstance(model as M) as T;
        deleteOne(existingModel);
        addOne(updatedModel);
        return updatedModel;
      }
    }
    return null;
  }

  @override
  List<T?> updateMany(List<T> items) {
    List<T?> updatedModels = [];
    for (var item in items) {
      updatedModels.add(updateOne(item));
    }
    return updatedModels;
  }

  @override
  T? upsertOne(T item) {
    final existingModel = getOneByKey(getKey(item));
    if (existingModel != null) {
      return updateOne(item);
    } else {
      addOne(item);
      return item;
    }
  }

  @override
  List<T?> upsertMany(List<T> items) {
    final updatedModels = <T?>[];
    for (var item in items) {
      updatedModels.add(upsertOne(item));
    }
    return updatedModels;
  }
}
