part of '../abcx3_stores_library.dart';

/// A class that extends ModelStore and provides additional functionality for
/// working with streams of models.
///
class ModelStreamStore<K, T extends PrismaModel<K, T>>
    extends ModelStore<K, T> {
  ModelStreamStore(super.fromJson);

  /// A private BehaviorSubject that holds a list of all the models.
  ///  When the list is updated, the public stream (defined below) outputs a new event consisting of all the models at their current state.
  final BehaviorSubject<List<T>> _items$$ = BehaviorSubject.seeded([]);

  /// The public stream containing all the models at their current state. Whenever one or multiple models are updated,
  /// the stream will output a new event consisting of all the models at their current state.
  late final Stream<List<T>> items$ = _items$$.stream;

  /// A flag indicating whether the getAll method has been run.
  bool getAllHasRun = false;

  /// Getter for the list of models.
  @override
  List<T> get items => _items$$.value;

  /// Setter for the list of models.
  @override
  set items(List<T> items) => _items$$.add(items);

  /// Returns a stream of a single model that matches the given field value,
  /// or a stream of null if none is found.
  Stream<T?> getByFieldValue$<W>(
      {required GetPropertyValueFunction<T, W> getPropVal,
      required dynamic value,
      required Endpoint endpoint,
      bool useCache = true,
      ModelFilter<T>? modelFilter,
      Json? body}) {
    if (useCache) {
      final model = getByPropertyValueAndFilter(getPropVal, value,
          modelFilter: modelFilter);
      if (model != null) {
        // if useCache is true, we return a broadcast stream ONLY if we have a cached value
        return Stream.value(model).asBroadcastStream();
      }
    }
    return getOne$(
            endpoint: endpoint,
            param: value,
            modelFilter: modelFilter,
            body: body)
        .map((model) => model != null ? upsert(model) : null);
  }

  /// Returns a stream of all the models that match the given field value,
  /// or an empty list if none is found.
  Stream<List<T>> getManyByFieldValue$<U>(
      {required GetPropertyValueFunction<T, U> getPropVal,
      required dynamic value,
      required Endpoint endpoint,
      bool useCache = true,
      ModelFilter<T>? modelFilter,
      Json? body}) {
    if (useCache) {
      final models = getManyByPropertyValueAndFilter<U>(getPropVal, value,
          modelFilter: modelFilter);
      if (models.isNotEmpty) {
        return Stream.value(models).asBroadcastStream();
      }
    }
    return getMany$(
            endpoint: endpoint,
            param: value,
            modelFilter: modelFilter,
            body: body)
        .map((models) => upsertMany(models));
  }

  /// Returns a stream of all the models.
  Stream<List<T>> getAllItems$(
      {required Endpoint endpoint,
      bool useCache = true,
      ModelFilter<T>? modelFilter,
      Json? body}) {
    if (useCache && getAllHasRun) {
      var models = getAll();
      if (modelFilter != null) {
        models = modelFilter.filterMany(models);
      }
      return Stream.value(models).asBroadcastStream();
    } else {
      return getMany$(endpoint: endpoint, modelFilter: modelFilter)
          .map((models) {
        final upsertedModels = upsertMany(models);
        getAllHasRun = true;
        return upsertedModels;
      });
    }
  }

  /// Returns a stream of a model including the given relational fields.
  Stream<T?> getIncluding$(
      Stream<T?> model$, List<StoreIncludes> storeGetters) {
    List<Stream<dynamic>> listOfZipStreams = [];
    return model$.switchMap((model) {
      if (model == null) {
        return Stream.value(model); // .asBroadcastStream();
      } else {
        for (var modelField in storeGetters) {
          listOfZipStreams.add(modelField.method(model));
        }
        return Rx.zipList(listOfZipStreams).switchMap((value) {
          return Stream.value(model);
        }).doOnData((model) {
          upsert(model);
        });
      }
    });
  }

  /// Returns a stream of a list of models including the given relational fields.
  Stream<List<T>> getManyIncluding$(
      Stream<List<T>> models$, List<StoreIncludes> storeGetters) {
    return models$.switchMap((models) {
      if (models.isEmpty) {
        return Stream.value(models);
      } else {
        List<Stream<dynamic>> listOfZipStreams = [];
        for (var modelField in storeGetters) {
          listOfZipStreams
              .addAll(models.map((model) => modelField.method(model)));
        }
        return Rx.zipList(listOfZipStreams).switchMap((value) {
          return Stream.value(models);
        }).doOnData((models) {
          items = [...items];
        });
      }
    });
  }
}
