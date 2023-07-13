part of abcx3_prisma;

mixin ModelRequestMixin<T> on ModelCreator<T> {
  final Map<String, Stream<dynamic>> _cachedStreams = {};

  Stream<T> getOne$(
      {dynamic param, required Endpoint endpoint, Map<String, dynamic>? body}) {
    return get$<T>(param: param, endpoint: endpoint, body: body);
  }

  Stream<List<T>> getMany$(
      {dynamic param, required Endpoint endpoint, Map<String, dynamic>? body}) {
    return get$<List<T>>(param: param, endpoint: endpoint, body: body);
  }

  Stream<U> get$<U>(
      {dynamic param, required Endpoint endpoint, Map<String, dynamic>? body}) {
    final serializedRequest =
        _serializeRequest(param: param, endpoint: endpoint);
    final cachedRequest = _getCachedRequest(serializedRequest);

    if (cachedRequest != null) {
      return cachedRequest;
    } else {
      final subject$$ = PublishSubject<U>();
      final stream$$ = subject$$.stream.take(1);
      _setCachedRequest<U>(serializedRequest, stream$$);
      final result = authHttp.request(endpoint, param: param, body: body);
      result.then((val) {
        if (val.isSuccess) {
          final json = val.success ?? [];
          final models = create(json);
          subject$$.add(models);
        } else {
          subject$$.addError(val.failure!);
        }
        subject$$.close();
        _deleteCachedRequest(serializedRequest);
        return stream$$;
      });
      return stream$$;
    }
  }

  String _serializeRequest({dynamic param, required Endpoint endpoint}) {
    final requestMap = {'endpoint': endpoint.path, 'param': param.toString()};
    final json = jsonEncode(requestMap);
    //final serializedRequest = json.toString();
    return json;
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

/*mixin ModelRequestMixin<T> on ModelCreator<T> {
  final Map<String, Stream<dynamic>> _cachedStreams = {};

  Stream<T> getOne$(
      {dynamic param, required Endpoint endpoint, Map<String, dynamic>? body}) {
    return get$<T>(param: param, endpoint: endpoint, body: body);
  }

  Stream<List<T>> getMany$(
      {dynamic param, required Endpoint endpoint, Map<String, dynamic>? body}) {
    return get$<List<T>>(param: param, endpoint: endpoint, body: body);
  }

  Stream<U> get$<U>(
      {dynamic param, required Endpoint endpoint, Map<String, dynamic>? body}) {
    final serializedRequest =
        _serializeRequest(param: param, endpoint: endpoint);
    final cachedRequest = _getCachedRequest(serializedRequest);

    if (cachedRequest != null) {
      return cachedRequest;
    } else {
      final subject$$ = PublishSubject<U>();
      final stream$$ = subject$$.stream.take(1);
      _setCachedRequest<U>(serializedRequest, stream$$);
      final result = authHttp.request(endpoint, param: param, body: body);
      result.then((val) {
        if (val.isSuccess) {
          final json = val.success ?? [];
          final models = create(json);
          subject$$.add(models);
        } else {
          subject$$.addError(val.failure!);
        }
        subject$$.close();
        _deleteCachedRequest(serializedRequest);
        return stream$$;
      });
      return stream$$;
    }
  }

  String _serializeRequest({dynamic param, required Endpoint endpoint}) {
    final requestMap = {'endpoint': endpoint.path, 'param': param.toString()};
    final json = jsonEncode(requestMap);
    //final serializedRequest = json.toString();
    return json;
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
}*/
