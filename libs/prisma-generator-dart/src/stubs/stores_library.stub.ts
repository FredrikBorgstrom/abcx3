export const dartStoreLibrary = `
library abcx3_stores;

import 'dart:convert';

import 'package:abcx3/services/authentication/auth.library.dart';
import 'package:abcx3/services/service_manager.dart';
import 'package:dio/dio.dart';
import 'package:simple_result/simple_result.dart';
import 'package:rxdart/rxdart.dart';

import 'abcx3_common.library.dart';
import 'models_library.dart';

part 'stores_common/store_interfaces.dart';
part 'stores_common/model_creator.dart';
part 'stores_common/model_request.mixin.dart';
part 'stores_common/model_store.dart';
part 'stores_common/model_stream_store.dart';
part 'stores_common/storage.interface.dart';
part 'stores_common/key_store.mixin.dart';

#{StoreParts}
`;

