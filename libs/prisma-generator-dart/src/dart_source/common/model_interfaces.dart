part of '../abcx3_common.library.dart';

typedef Json = dynamic;
typedef JsonMap = Map<String, Json>;
typedef JsonList = List<JsonMap>;

typedef JsonFactory<T> = T Function(JsonMap json);

typedef GetPropertyValueFunction<I, O> = O? Function(I model);

class Value<T> {
  final T value;
  const Value(this.value);
}

abstract interface class JsonSerializable {
  factory JsonSerializable.fromJson(JsonMap json) {
    throw UnimplementedError();
  }
  JsonMap toJson();
}

abstract interface class CopyWith<T> {
  T copyWith();
  T copyWithInstanceValues(T model);
  T mergeWithInstanceValues(T model); // like copyWithInstanceValues, but merges lists instead of replacing them
  T updateWithInstanceValues(T model);
}

// M is the model type, V is the value type
abstract interface class GetPropToValueFunction<T> {
  V? Function(T model) getPropToValueFunction<V>(String propName);
}

abstract interface class UID<K> {
  K? get $uid;
  bool equalById(UID<K> other);
}

abstract interface class CopyWithAndUID<T, U> implements CopyWith<T>, UID<U> {}

abstract interface class PrismaModel<K, T>
    implements JsonSerializable, CopyWith<T>, UID<K>, GetPropToValueFunction<T> {}

// NOT USED:

abstract interface class FromJson {
  factory FromJson.fromJson(JsonMap json) {
    throw UnimplementedError();
  }
}

abstract interface class FromJsonFactory<T> {
  JsonFactory<T> get fromJsonFactory;
}

abstract interface class ToJson {
  JsonMap toJson();
}

abstract interface class Id<K> {
  K? id;
}
