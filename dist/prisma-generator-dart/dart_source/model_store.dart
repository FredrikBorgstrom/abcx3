import 'package:abcx3/gen_backend_routes.dart';
import 'package:abcx3/gen_models/common/model_base.dart';
import 'package:abcx3/gen_models/common/model_creator.dart';
import 'package:abcx3/gen_models/common/model_stream_store.mixin.dart';
import 'package:abcx3/gen_models/common/prisma_model.dart';
import 'package:rxdart/rxdart.dart';

typedef GetPropertyValue<T, K> = K? Function(T model); // U is the type of the field value


typedef ModelStore<M, K> = _ModelStore<M, K, PrismaIdModel<M, K>>;

class _ModelStore<M, K, T extends PrismaIdModel<M, K>> extends ModelCreator<T> with ModelStreamStoreMixin<T, K>, ModelRequestMixin<T> {

  GetPropertyValue<T, K> getId = (T model) => model.id;

  _ModelStore(JsonModelFactory<T> fromJson) : super(fromJson);

  /*T? getOneByFieldValue(GetPropertyValue<T, K> getPropVal, K fieldValue) {
    return (models as List<T>).find((m) => getPropVal(m) == fieldValue).whereType<T>().first;
  }

  List<T> getManyByFieldValue(GetPropertyValue<T, K> getPropVal, K fieldValue) {
    return (models as List<T>).where((m) => getPropVal(m) == fieldValue).whereType<T>().toList();
  }*/

  Stream<List<T>?> getManyByFieldValue$({required GetPropertyValue<T, K> getPropVal, required K fieldValue, bool useCache = true}) {
    if (useCache) {
      final models = getManyByFieldValue(getPropVal, fieldValue);
      if (models.isNotEmpty) {
        return Stream.value(models);
      }
    }
    return getMany$(endpoint: Abc3Route.player_byGameId_$gameId_get, param: fieldValue).doOnData((models) => addMany(models.cast<PrismaIdModel<T, K>>()));
  }

  getById(K id) => getManyByFieldValue(getId, id).first;

  getById$(K id, {bool useCache = true}) => getManyByFieldValue$(getPropVal: getId, fieldValue: id, useCache: useCache).first;
}