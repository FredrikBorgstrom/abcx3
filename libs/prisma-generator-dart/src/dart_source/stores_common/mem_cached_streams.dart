part of '../abcx3_stores_library.dart';

/// Holds a short‑lived, in‑memory index of request streams
/// to de‑duplicate concurrent fetches.
///
/// This container is used by cache‑aware services (for example
/// `CachedStorageService`) to avoid kicking off the same network
/// request multiple times within a very small time window. Each
/// entry is a [MemCachedStream] keyed by a serialized request
/// signature built from the `Endpoint.path`, optional `param`, and
/// optional `body`.
///
/// Entries are considered valid only for a few seconds (see
/// [MemCachedStream.MAX_AGE_OF_CACHED_REQUEST_IN_SECONDS]). Call
/// [getByRequest] to reuse an in‑flight stream, [add] to register
/// a new one, and [removeExpired] to proactively purge stale items
/// (although consumers typically remove items after persistence).
///
/// Note: This cache is in‑memory only, not shared across isolates,
/// and is intended for short‑term coalescing of identical requests
/// rather than long‑term data storage.
class MemCachedStreams {
  final List<MemCachedStream> _memCachedStreams = [];

  /// Registers a cached stream instance for later lookup.
  void add(MemCachedStream cachedStream) {
    _memCachedStreams.add(cachedStream);
  }

  /// Returns the cached stream with the given serialized request
  /// signature, or `null` if no valid entry exists.
  ///
  /// The signature is produced by [MemCachedStream._serializeRequest]
  /// and uniquely identifies the combination of endpoint, param, and body.
  MemCachedStream? getByRequest(String serializedRequest) {
    return _memCachedStreams.find(
      (cachedStream) => cachedStream.serializedRequest == serializedRequest,
    );
  }

  /// Removes a specific cached stream instance.
  void remove(MemCachedStream cachedStream) {
    _memCachedStreams.remove(cachedStream);
  }

  /// Removes all entries whose max age has been exceeded.
  void removeExpired() {
    _memCachedStreams.removeWhere((cachedStream) => cachedStream.isExpired());
  }
}

/// Represents a single in‑flight (or very recently completed) request
/// and its broadcast stream, identified by a serialized request signature.
///
/// The `serializedRequest` combines the `Endpoint.path` with the optional
/// `param` and `body` to provide a stable lookup key for identical requests.
///
/// Freshness/expiry:
/// - A cached stream is considered valid for
///   [MAX_AGE_OF_CACHED_REQUEST_IN_SECONDS] seconds from its creation time.
/// - Use [hasNotExpired] or [isExpired] to check validity, and prefer
///   [MemCachedStreams.removeExpired] for bulk cleanup.
class MemCachedStream<U> {
  static const MAX_AGE_OF_CACHED_REQUEST_IN_SECONDS = 3;

  /// The broadcast stream that emits the request result when available.
  Stream<U>? stream$;

  /// Creation time used to determine freshness.
  final DateTime dateTime;

  /// Unique signature for endpoint + param + body used for lookup.
  late final String serializedRequest;

  MemCachedStream({
    required Endpoint endpoint,
    dynamic param,
    JsonMap? body,
    this.stream$,
  }) : dateTime = DateTime.now() {
    serializedRequest = _serializeRequest(
      param: param,
      endpoint: endpoint,
      body: body,
    );
  }

  /// Returns true when this cached stream is still within the
  /// allowed freshness window.
  bool hasNotExpired() {
    return !isExpired();
  }

  /// Returns true when the stream is older than
  /// [MAX_AGE_OF_CACHED_REQUEST_IN_SECONDS].
  bool isExpired() {
    final now = DateTime.now();
    final age = now.difference(dateTime).inSeconds;
    return age > MAX_AGE_OF_CACHED_REQUEST_IN_SECONDS;
  }

  /// Compares two cached streams by their serialized request signature.
  bool requestsAreEqual(MemCachedStream other) {
    return other.serializedRequest == serializedRequest;
  }

  String _serializeRequest({
    dynamic param,
    required Endpoint endpoint,
    JsonMap? body,
  }) {
    // final dateTime = DateTime.now().toIso8601String();
    final serializedParam = param != null ? param.toString() : '';
    final serializedBody = body != null ? body.toString() : '';
    return '${endpoint.path}$serializedParam$serializedBody';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is MemCachedStream &&
        other.serializedRequest == serializedRequest &&
        other.dateTime == dateTime;
  }

  @override
  int get hashCode => serializedRequest.hashCode ^ dateTime.hashCode;
}
