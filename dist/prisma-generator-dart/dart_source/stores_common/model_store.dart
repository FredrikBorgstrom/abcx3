part of '../abcx3_stores_library.dart';

typedef GetPropertyValue<I, O> = O? Function(I model);
// U is the type of the field value

class ModelStore<K, T extends PrismaModel<K, T>> extends ModelCreator<T>
    with KeyStoreMixin<K, T>, ModelRequestMixin<T> {
  ModelStore(JsonFactory<T> fromJson) : super(fromJson);

  K? getId(T model) => model.$uid;

  T? getById(K id) => getByPropertyValue(getId, id);

  setIncludedReferences<U>(U? item, {List<StoreIncludes>? includes}) {
    if (item != null && includes != null) {
      for (var include in includes) {
        include.method(item);
      }
    }
  }

  setIncludedReferencesForList<U>(List<U>? items,
      {List<StoreIncludes>? includes}) {
    for (var item in items ?? []) {
      setIncludedReferences(item, includes: includes);
    }
  }
}
