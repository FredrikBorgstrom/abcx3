part of '../abcx3_stores_library.dart';

typedef GetPropertyValueFunction<I, O> = O? Function(I model);
// U is the type of the field value

class ModelStore<K, T extends PrismaModel<K, T>> extends ModelCreator<T>
    with KeyStoreMixin<K, T>, ModelRequestMixin<T> {
  ModelStore(super.fromJson);

  K? getId(T model) => model.$uid;

  // T? getById(K id) => getByPropertyValue(getId, id);

  T? getById(K id, {List<StoreIncludes>? includes}) =>
      getIncluding(getId, id, includes: includes);

  T? getIncluding<W>(
    GetPropertyValueFunction<T, W> getPropVal,
    W value, {
    ModelFilter<T>? modelFilter,
    List<StoreIncludes>? includes,
  }) {
    final model = getByPropertyValueAndFilter(
      getPropVal,
      value,
      modelFilter: modelFilter,
    );
    setIncludedReferences(model, includes: includes);
    return model;
  }

  List<T> getManyIncluding<W>(
    GetPropertyValueFunction<T, W> getPropVal,
    W value, {
    ModelFilter<T>? modelFilter,
    List<StoreIncludes>? includes,
  }) {
    final models = getManyByPropertyValueAndFilter(
      getPropVal,
      value,
      modelFilter: modelFilter,
    );
    setIncludedReferencesForList(models, includes: includes);
    return models;
  }

  List<T> getManyByManyIncluding<W>(
    GetPropertyValueFunction<T, W> getPropVal,
    List<W> values, {
    ModelFilter<T>? modelFilter,
    List<StoreIncludes>? includes,
  }) {
    final models = getManyByManyValuesAndFilter(
      getPropVal,
      values,
      modelFilter: modelFilter,
    );
    setIncludedReferencesForList(models, includes: includes);
    return models;
  }

  void setIncludedReferences<U>(U? item, {List<StoreIncludes>? includes}) {
    if (item != null && includes != null) {
      for (var include in includes) {
        include.method(item);
      }
    }
  }

  void setIncludedReferencesForList<U>(
    List<U>? items, {
    List<StoreIncludes>? includes,
  }) {
    for (var item in items ?? []) {
      setIncludedReferences(item, includes: includes);
    }
  }

  /// If items are being observed (for example in a StreamBuilder),
  /// this method can be used to trigger a refresh of the observer's renderer
  /// That would also require that the items' store is implemented as an observable,
  /// like they are in the ModelStreamStore
  void refreshItems() {
    items = [...items];
  }
}
