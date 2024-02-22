part of '../abcx3_stores_library.dart';

mixin ModelRequestMixin<T> on ModelCreator<T> {
  final Map<String, Stream<dynamic>> _cachedStreams = {};

  Stream<T> getOne$(
      {dynamic param,
      required Endpoint endpoint,
      ModelFilter? modelFilter,
      Json? body}) {
    return get$<T>(
        param: param, endpoint: endpoint, modelFilter: modelFilter, body: body);
  }

  Stream<List<T>> getMany$(
      {dynamic param,
      required Endpoint endpoint,
      ModelFilter? modelFilter,
      Json? body}) {
    return get$<List<T>>(
        param: param, endpoint: endpoint, modelFilter: modelFilter, body: body);
  }

  Stream<U> get$<U>(
      {dynamic param,
      required Endpoint endpoint,
      ModelFilter? modelFilter,
      Json? body}) {
    if (modelFilter != null) {
      body ??= {};
      body['modelFilter'] = modelFilter.toJson();
    }
    final serializedRequest =
        _serializeRequest(param: param, endpoint: endpoint, body: body);
    final cachedRequest = _getCachedRequest(serializedRequest);

    if (cachedRequest != null) {
      return cachedRequest;
    } else {
      final broadcastStream$$ = FromCallableStream<U>(() => authHttp
              .request(endpoint, param: param, body: body)
              .then(handleRequestResult)
              .then((result) {
            _deleteCachedRequest(serializedRequest);
            return result;
          })).asBroadcastStream();
      _setCachedRequest<U>(serializedRequest, broadcastStream$$);
      return broadcastStream$$;
    }
  }

  handleRequestResult<U>(Result<U, DioException> result) {
    if (result.isSuccess) {
      final json = result.success ?? [];
      final models = create(json);
      return models;
    } else {
      throw result.failure!;
    }
  }

  String _serializeRequest(
      {dynamic param, required Endpoint endpoint, Json? body}) {
    final serializedParam = param != null ? param.toString() : '';
    final serializedBody = body != null ? body.toString() : '';
    return '${endpoint.path} $serializedParam $serializedBody';
  }

  _setCachedRequest<U>(String serializedRequest, Stream<U> stream$$) {
    _cachedStreams[serializedRequest] = stream$$;
  }

  _getCachedRequest(String serializedRequest) {
    return _cachedStreams[serializedRequest];
  }

  _deleteCachedRequest(String serializedRequest) {
    _cachedStreams.remove(serializedRequest);
  }
}
