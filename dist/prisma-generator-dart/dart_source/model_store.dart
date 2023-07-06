part of abcx3_prisma;

typedef GetPropertyValue<T, U> = U? Function(
    T model); // U is the type of the field value

typedef ModelStore<M, U> = _ModelStore<M, U, PrismaModel<M, U>>;

class _ModelStore<M, U, T extends PrismaModel<M, U>> extends ModelCreator<T>
    with ItemStreamStoreMixin<M, U, T>, ModelRequestMixin<T> {
  // GetPropertyValue<T, K> getId = (T model) => model.id;

  _ModelStore(JsonModelFactory<M> fromJson)
      : super(fromJson as JsonModelFactory<T>);

  /*T? getOneByFieldValue(GetPropertyValue<T, K> getPropVal, K fieldValue) {
    return (models as List<T>).find((m) => getPropVal(m) == fieldValue).whereType<T>().first;
  }

  List<T> getManyByFieldValue(GetPropertyValue<T, K> getPropVal, K fieldValue) {
    return (models as List<T>).where((m) => getPropVal(m) == fieldValue).whereType<T>().toList();
  }*/

  Stream<List<T>?> getManyByFieldValue$<K>(
      {required GetPropertyValue<T, K> getPropVal,
      required dynamic fieldValue,
      bool useCache = true}) {
    if (useCache) {
      final models = getManyByFieldValue<K>(getPropVal, fieldValue);
      if (models.isNotEmpty) {
        return Stream.value(models);
      }
    }
    return getMany$(
            endpoint: Abc3Route.player_byGameId_$gameId_get, param: fieldValue)
        .doOnData((models) => addMany(models));
  }

  U? getId(T model) => model.uniqueId;

  getById(U id) => getManyByFieldValue(getId, id).first;

  getById$(U id, {bool useCache = true}) => getManyByFieldValue$(
          getPropVal: getId, fieldValue: id, useCache: useCache)
      .first;
}
