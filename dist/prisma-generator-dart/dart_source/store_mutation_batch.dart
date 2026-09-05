part of 'abcx3_stores_library.dart';

/// Coalesces synchronous mutations across a complete relation graph.
///
/// Keys and lookups change immediately; each affected store publishes one list
/// when the outermost operation finishes. This is not a rollback transaction:
/// if an operation throws, completed mutations are still published.
class StoreMutationBatch {
  static int _depth = 0;
  static final Map<Object, void Function()> _publishers = {};

  /// The callback must be synchronous; asynchronous work needs separate batches.
  static R run<R>(R Function() operation) {
    _depth++;
    try {
      return operation();
    } finally {
      _depth--;
      if (_depth == 0) {
        final publishers = _publishers.values.toList();
        _publishers.clear();
        for (final publish in publishers) {
          publish();
        }
      }
    }
  }

  static void _schedule(Object store, void Function() publish) {
    if (_depth == 0) {
      publish();
    } else {
      _publishers[store] = publish;
    }
  }
}
