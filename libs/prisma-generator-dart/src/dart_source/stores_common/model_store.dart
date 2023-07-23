part of abcx3_stores;

typedef GetPropertyValue<T, U> = U? Function(T model);
// U is the type of the field value

class ModelStore<U, T extends UID<U>> extends ModelCreator<T>
    with KeyStoreMixin<U, T>, ModelRequestMixin<T> {
  ModelStore(JsonFactory<T> fromJson) : super(fromJson);

  U? getId(T model) => model.$uid;

  T? getById(U id) => getByPropertyValue(getId, id);
}
