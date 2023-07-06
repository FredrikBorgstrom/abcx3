part of abcx3_prisma;

/*typedef ModelStreamStoreMixin<M, U>
    = _ModelStreamStoreMixin<M, U, UniqueIdAndCopyWith<U, M>>;*/

mixin ItemStreamStoreMixin<M, U, T extends UniqueIdAndCopyWith<U, M>>
    implements KeyStorageInterface<T, U> {
  final BehaviorSubject<List<T>> _models$$ = BehaviorSubject.seeded([]);

  late final Stream<List<T>> models$ = _models$$.stream;

  List<T> get models => _models$$.value;

  @override
  void initStorage() {}

  @override
  U? getKey(T item) => item.uniqueId;

  @override
  List<T> getAll() => models; // .whereType<T>().toList();

  @override
  T? getOneByKey(U? id) => models.find((i) => i.uniqueId == id);

  @override
  List<T> getManyByKeys(List<U> ids) =>
      ids.map((id) => getOneByKey(id)).whereType<T>().toList();

  T? getOneByPropertyValue(GetPropertyValue getPropVal, fieldValue) {
    return models.find((m) => getPropVal(m) == fieldValue);
  }

  List<T> getManyByFieldValue<K>(
      GetPropertyValue<T, K> getPropVal, fieldValue) {
    return models.where((m) => getPropVal(m) == fieldValue).toList();
  }

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
  void deleteOneByKey(U key) {
    final model = getOneByKey(key);
    if (model != null) {
      deleteOne(getOneByKey(key)!);
    }
  }

  @override
  void deleteManyByKeys(List<U> keys) {
    for (var key in keys) {
      deleteOneByKey(key);
    }
  }

  @override
  T? updateOne(T model) {
    if (model.uniqueId != null) {
      T? existingModel = getOneByKey(model.uniqueId);
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
    final existingModel = getOneByKey(item.uniqueId);
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
