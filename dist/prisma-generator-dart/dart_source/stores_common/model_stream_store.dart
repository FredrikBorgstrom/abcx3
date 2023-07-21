part of abcx3_stores;

class ModelStreamStore<U, T extends UID<U>> extends ModelStore<U, T> {
  ModelStreamStore(JsonFactory<T> fromJson) : super(fromJson);

  final BehaviorSubject<List<T>> _items$$ = BehaviorSubject.seeded([]);
  late final Stream<List<T>> items$ = _items$$.stream;

  @override
  List<T> get items => _items$$.value;

  @override
  set items(List<T> items) => _items$$.add(items);

  /*getById$(U id, {bool useCache = true}) =>
      getByFieldValue$(getPropVal: getId, fieldValue: id, useCache: useCache);*/

  Stream<T?> getByFieldValue$<W>(
      {required GetPropertyValue<T, W> getPropVal,
      required dynamic value,
      required Endpoint endpoint,
      bool useCache = true}) {
    if (useCache) {
      final model = getByPropertyValue(getPropVal, value);
      if (model != null) {
        return Stream.value(model);
      }
    }
    return getOne$(endpoint: endpoint, param: value)
        .doOnData((model) => upsert(model));
  }

  getManyByFieldValue$<K>({
    required GetPropertyValue<T, K> getPropVal,
    required dynamic value,
    required Endpoint endpoint,
    bool useCache = true,
  }) {
    if (useCache) {
      final models = getManyByPropertyValue<K>(getPropVal, value);
      if (models.isNotEmpty) {
        return Stream.value(models);
      }
    }
    return getMany$(endpoint: endpoint, param: value)
        .doOnData((models) => upsertMany(models));
  }

  getAllItems$({required Endpoint endpoint, bool useCache = true}) {
    if (useCache) {
      final models = getAll();
      if (models.isNotEmpty) {
        return Stream.value(models);
      }
    }
    return getMany$(endpoint: endpoint)
        .doOnData((models) => upsertMany(models));
  }

  Stream<V> getIncluding$<V>(Stream<V> items$, List<StoreIncludes> storeGetters) {
    List<Stream<dynamic>> listOfZipStreams = [];
    return items$.switchMap((item) {
      for (var modelField in storeGetters) {
        listOfZipStreams.add(modelField.method(item));
      }
      return Rx.zipList(listOfZipStreams).switchMap((value) {
        return Stream.value(item);
      });
    });
  }

  Stream<List<V>> getManyIncluding$<V>(Stream<List<V>> items$, List<StoreIncludes> storeGetters) {
      List<Stream<dynamic>> listOfZipStreams = [];
      return items$.switchMap((items) {
        for (var modelField in storeGetters) {
          listOfZipStreams.addAll(items.map((item) => modelField.method(item)));
        }
        return Rx.zipList(listOfZipStreams).switchMap((value) {
          return Stream.value(items);
        });
      });
    }
}
