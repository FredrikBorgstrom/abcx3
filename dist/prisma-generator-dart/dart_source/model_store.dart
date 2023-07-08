part of abcx3_prisma;

typedef GetPropertyValue<T, U> = U? Function(T model);
// U is the type of the field value

// typedef ModelStore<M, U> = _ModelStore<U, PrismaModel<U>>;

class ModelStore<U, T extends UID<U>> extends ModelCreator<T>
    with KeyStoreMixin<U, T>, ModelRequestMixin<T> {
  ModelStore(JsonModelFactory<T> fromJson) : super(fromJson);

  U? getId(T model) => model.$uid;

  T? getById(U id) => getByPropertyValue(getId, id);

  /*getById$(U id, {bool useCache = true}) =>
      getByFieldValue$(getPropVal: getId, fieldValue: id, useCache: useCache);

  Stream<T?> getByFieldValue$<W>(
      {required GetPropertyValue<T, W> getPropVal,
      required dynamic fieldValue,
      bool useCache = true}) {
    if (useCache) {
      final model = getByPropertyValue(getPropVal, fieldValue);
      if (model != null) {
        return Stream.value(model);
      }
    }
    return getOne$(
            endpoint: Abc3Route.player_byGameId_$gameId_get, param: fieldValue)
        .doOnData((model) => add(model));
  }

  Stream<List<T>> getManyByFieldValue$<K>(
      {required GetPropertyValue<T, K> getPropVal,
      required dynamic fieldValue,
      bool useCache = true}) {
    if (useCache) {
      final models = getManyByPropertyValue<K>(getPropVal, fieldValue);
      if (models.isNotEmpty) {
        return Stream.value(models);
      }
    }
    return getMany$<T>(
            endpoint: Abc3Route.player_byGameId_$gameId_get, param: fieldValue)
        .doOnData((models) => addMany(models));
  }*/
}
