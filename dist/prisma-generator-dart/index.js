"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// libs/prisma-generator-dart/package.json
var require_package = __commonJS({
  "libs/prisma-generator-dart/package.json"(exports, module2) {
    module2.exports = {
      name: "@abcx3/prisma-generator-dart",
      description: "Generate Dart class files with to- and fromJson methods from a Prisma schema",
      version: "1.0.0",
      main: "src/generator.js",
      bin: {
        "prisma-generator-dart": "src/generator.js"
      },
      scripts: {},
      keywords: [],
      author: "",
      license: "ISC"
    };
  }
});

// libs/prisma-generator-dart/src/generator.ts
var import_generator_helper = require("@prisma/generator-helper");
var import_child_process = require("child_process");
var import_path = __toESM(require("path"));

// libs/prisma-generator-dart/src/constants.ts
var GENERATOR_NAME = "prisma-generator-dart";

// libs/prisma-generator-dart/src/stubs/dart.stub.ts
var dartBaseClassStub = `
#{AutoGeneratedWarningText}

import 'common/abcx3_prisma.library.dart';
#{AdditionalImports}

class #{ClassName} #{ParentClass} implements JsonSerializable, CopyWith<#{ClassName}> #{ImplementsUID} #{ImplementsId} {
    #{Properties}
    
    #{ClassName}({#{ConstructorArgs}});

    #{UIDGetter}

    #{OverrideAnnotation}
    factory #{ClassName}.fromJson(Map<String, dynamic> json) =>
      #{ClassName}(
        #{fromJsonArgs}
      );

      #{OverrideAnnotation}  
    #{ClassName} copyWith({
        #{CopyWithArgs}
        }) {
        return #{ClassName}(
            #{CopyWithConstructorArgs}
        );
    }

    #{OverrideAnnotation}
    #{ClassName} copyWithInstance(#{ClassName} #{InstanceName}) {
        return #{ClassName}(
            #{CopyWithInstanceConstructorArgs}
        );
    }

    #{OverrideAnnotation}
    Map<String, dynamic> toJson() => ({
        #{toJsonKeyValues}
      });

    #{OverrideAnnotation}
    bool operator == (Object other) =>
            identical(this, other) || other is #{ClassName} &&
                runtimeType == other.runtimeType &&
                #{equalsKeyValues};

    #{OverrideAnnotation}
        int get hashCode => #{hashCodeKeyValues};
    }
    `;
var dartUIDStub = `
#{OverrideAnnotation}
#{Type}#{Nullable} get $uid => #{PropName};`;
var dartCopyWithArg = `#{Type}#{Nullable} #{PropName}`;
var dartCopyWithConstructorArg = `#{PropName}: #{PropName} ?? this.#{PropName}`;
var dartCopyWithInstanceConstructorArg = `#{PropName}: #{InstanceName}.#{PropName} ?? #{PropName}`;
var dartFromJsonArg = `#{PropName}: json['#{PropName}'] as #{Type}#{Nullable}`;
var dartFromJsonRefArg = `#{PropName}: json['#{PropName}'] != null ? #{Type}.fromJson(json['#{PropName}'] as Map<String, dynamic>) : null`;
var dartFromJsonScalarIntListArg = `#{PropName}: json['#{PropName}'] != null ? (json['#{PropName}'] as List<dynamic>).map((e) => int.parse(e.toString())).toList() : null`;
var dartFromJsonScalarStringListArg = `#{PropName}: json['#{PropName}'] != null ? (json['#{PropName}'] as List<dynamic>).map((e) => e.toString()).toList() : null`;
var dartFromJsonModelListArg = `#{PropName}: json['#{PropName}'] != null ? createModels<#{Type}>(json['#{PropName}'], #{Type}.fromJson) : null`;
var dartFromJsonEnumArg = `#{PropName}: #{Type}.values.byName(json['#{PropName}'])`;
var dartFromJsonEnumListArg = `#{PropName}: (json['#{PropName}']).map((item) => #{Type}.values.byName(json[item])).toList())`;
var dartFromJsonDateTimeArg = `#{PropName}: json['#{PropName}'] != null ? DateTime.parse(json['#{PropName}']) : null`;
var toJsonPropertyStub = `if(#{PropName} != null) '#{PropName}': #{PropName}`;
var toJsonListPropertyStub = `if(#{PropName} != null) '#{PropName}': #{PropName}#{Nullable}.map((item) => item.toJson()).toList()`;
var dartEqualStub = `#{PropName} == other.#{PropName}`;
var dartListsEqualStub = `areListsEqual(#{PropName}, other.#{PropName})`;
var dartHashCodeKeyValue = `#{PropName}.hashCode`;
var dartConstructorArgument = `#{Required} this.#{PropName}`;
var dartConstructorArgumentWithDefaultValue = `#{Required} this.#{PropName} = #{DefaultValue}`;
var dartPropertyStub = `#{Type}#{Nullable} #{PropName};`;
var dartInterfacesAndModelFunctionsStub = `
  abstract interface class Id<K>} {
    abstract K? id;
  }
  
  abstract interface class IdString {
    abstract String? id;
  }
  
  abstract interface class ToJson {
    Map<String, dynamic> toJson();
  }
  
  typedef JsonModelFactory<T> = T Function(Map<String, dynamic> json);

  List<T> createModels<T>(json, JsonModelFactory<T> jsonFactory) {
    List<T> instances = [];
    for (final item in json) {
      instances.add(jsonFactory(item as Map<String, dynamic>));
    }
    return instances;
  }

  bool areListsEqual<T>(List<T>? list1, List<T>? list2) {
    if (list1 == null && list2 == null) return true;
    if (list1 == null || list2 == null) return false;
    if (list1.length != list2.length) return false;
    for (var i = 0; i < list1.length; i++) {
      if (list1[i] != list2[i]) return false;
    }
    return true;
  }
  `;

// libs/shared/src/writeFileSafely.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
async function writeFileSafely(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), {
    recursive: true
  });
  fs.writeFileSync(filePath, content);
}
async function outputToConsole(filePath, content) {
  console.log(content);
}

// libs/shared/src/stringFns.ts
var StringFns = class {
  static decapitalizeFileName(name, fileType) {
    return this.decapitalize(name) + "." + fileType;
  }
  static decapitalize(str) {
    return this.transformFirstCharCase(str, "toLowerCase");
  }
  static capitalize(str) {
    return this.transformFirstCharCase(str, "toUpperCase");
  }
  static transformFirstCharCase(str, fnName) {
    if (str == null || str.length === 0) {
      return "";
    } else {
      const firstChar = fnName === "toLowerCase" ? str[0].toLowerCase() : str[0].toUpperCase();
      return firstChar + str.substring(1);
    }
  }
  static snakeCase(str) {
    return str[0].toLowerCase() + str.substring(1).replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
  static snakeToCamelCase(str) {
    return str[0].toLowerCase() + str.substring(1).replace(/_[A-Z]/g, (letter) => `_${letter[1].toLowerCase()}`);
  }
};

// libs/shared/src/prisma.helper.ts
var PrismaTypeScriptTypeMap = {
  BigInt: "BigInt",
  Boolean: "boolean",
  Bytes: "Buffer",
  DateTime: "Date",
  Decimal: "number",
  Float: "number",
  Int: "number",
  Json: "object",
  String: "string"
};
var PrismaHelper = class _PrismaHelper {
  static instance;
  static getInstance() {
    if (_PrismaHelper.instance) {
      return _PrismaHelper.instance;
    }
    _PrismaHelper.instance = new _PrismaHelper();
    return _PrismaHelper.instance;
  }
  convertToTypescriptType(field) {
    let tsType = PrismaTypeScriptTypeMap[field.type];
    return tsType != null ? tsType : field.type;
  }
  getIdFieldNameAndType(model) {
    const idField = model.fields.find((field) => field.isId === true);
    if (idField) {
      return this.getFieldNameAndType(idField);
    } else {
      return null;
    }
  }
  getFieldNameAndType(field) {
    return {
      name: field.name,
      type: this.convertToTypescriptType(field)
    };
  }
  getReferingField(model, referedField) {
  }
  modelContainsObjectReference = (model) => model.fields.some((field) => field.kind === "object");
  getReferenceFields = (model) => model.fields.filter((field) => field.kind === "object");
  getUniqueReferenceFields = (model) => model.fields.reduce((acc, field) => {
    if (field.kind === "object" && !acc.some((f) => f.type === field.type))
      acc.push(field);
    return acc;
  }, []);
  //(field => field.kind === 'object');
  getUniqueInputPropertyName(model) {
    const primaryKey = model.primaryKey;
    if (primaryKey?.fields) {
      let compoundName = primaryKey.fields.reduce((acc, fieldName) => acc + "_" + fieldName, "");
      compoundName = compoundName.substring(1);
      return compoundName;
    } else {
      return null;
    }
  }
  getUniqueInputType(model) {
    const primaryKey = model.primaryKey;
    if (primaryKey?.fields) {
      let compoundName = primaryKey.fields.reduce((acc, fieldName) => acc + StringFns.capitalize(fieldName), "");
      return compoundName;
    } else {
      return null;
    }
  }
  parseDocumentation(field) {
    let documentation = field.documentation || "";
    documentation = documentation.replace(/(\r\n|\n|\r)/gm, " ");
    const comments = documentation.split(" ");
    const result = [];
    for (const comment of comments) {
      const argIndex = comment.indexOf("(");
      const argument = comment.substring(
        argIndex + 1,
        comment.lastIndexOf(")")
      );
      const directiveName = comment.substring(0, argIndex);
      const decorator = { name: directiveName, argument };
      result.push(decorator);
    }
    return result;
  }
};

// libs/shared/src/utils.ts
function convertBooleanStrings(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = convertBooleanString(obj[key]);
  }
  return result;
}
function convertBooleanString(value) {
  switch (value.toLowerCase()) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return value;
  }
}

// libs/prisma-generator-dart/src/generators/dart.generator.ts
var dartTypeMap = {
  BigInt: "BigInt",
  Boolean: "bool",
  Bytes: "ByteBuffer",
  DateTime: "DateTime",
  Decimal: "double",
  Float: "double",
  Int: "int",
  Json: "Map<String, dynamic>",
  String: "String"
};
var DartGenerator = class {
  constructor(settings, model) {
    this.settings = settings;
    this.model = model;
    this.prismaHelper = PrismaHelper.getInstance();
  }
  importedPackages = [];
  omitFields = [];
  prismaHelper;
  generateContent() {
    let content = this.generateBaseInput();
    content = content.replace(/#{AdditionalImports}/g, this.generateImportStatements());
    return content;
  }
  generateBaseInput() {
    let content = dartBaseClassStub;
    content = content.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);
    const className = this.model.name;
    const instanceName = StringFns.decapitalize(className);
    content = content.replace(/#{ClassName}/g, className);
    content = content.replace(/#{InstanceName}/g, instanceName);
    const parentClassInjection = "";
    content = content.replace(/#{ParentClass}/g, parentClassInjection);
    let constructorArgs = [];
    let properties = [];
    let fromJsonArgs = [];
    let toJsonKeyVals = [];
    let equalsKeyVals = [];
    let hashCodeKeyVals = [];
    let copyWithArgs = [];
    let copyWithConstructorArgs = [];
    let copyWithInstanceConstructorArgs = [];
    let listFields = [];
    let uidGetter = "";
    for (const field of this.model.fields) {
      const commentDirectives = this.prismaHelper.parseDocumentation(field);
      if (commentDirectives.some((directive) => directive.name === "@abcx3_omit")) {
        continue;
      }
      if (field.isId) {
        uidGetter = this.generateUIDGetter(field);
        content = content.replace(/#{UID}/g, uidGetter);
        content = content.replace(/#{ImplementsUID}/g, `, UID<${this.getDartType(field)}>`);
        content = content.replace(/#{ImplementsId}/g, field.name == "id" ? `, Id<${this.getDartType(field)}>` : "");
      }
      properties.push(this.generatePropertyContent(field));
      constructorArgs.push(this.generateConstructorArg(field));
      fromJsonArgs.push(this.generateFromJsonArgument(field));
      toJsonKeyVals.push(this.generateToJsonKeyVal(field));
      equalsKeyVals.push(this.generateEqualsKeyValue(field));
      hashCodeKeyVals.push(this.generateHashCodeValue(field));
      copyWithArgs.push(this.generateCopyWithArg(field));
      copyWithConstructorArgs.push(this.generateCopyWithConstructorArg(field));
      copyWithInstanceConstructorArgs.push(this.generateCopyWithInstanceConstructorArg(field, instanceName));
      if (field.isList) {
        listFields.push(field);
      }
    }
    for (const listField of listFields) {
      properties.push(`int? $${listField.name}Count;`);
      constructorArgs.push(`this.$${listField.name}Count`);
      fromJsonArgs.push(`$${listField.name}Count: json['_count']?['${listField.name}'] as int?`);
      equalsKeyVals.push(`$${listField.name}Count == other.$${listField.name}Count`);
      hashCodeKeyVals.push(`$${listField.name}Count.hashCode`);
      copyWithArgs.push(`int? $${listField.name}Count`);
      copyWithConstructorArgs.push(`$${listField.name}Count: $${listField.name}Count ?? this.$${listField.name}Count`);
      copyWithInstanceConstructorArgs.push(`$${listField.name}Count: ${instanceName}.$${listField.name}Count ?? $${listField.name}Count`);
    }
    const propertiesContent = properties.join("\n	");
    const constructorContent = constructorArgs.join(",\n	") + ",";
    const fromJsonContent = fromJsonArgs.join(",\n	");
    let toJsonContent = toJsonKeyVals.join(",\n	");
    if (listFields.length > 0) {
      let countToJsonStr = "if (";
      countToJsonStr = listFields.reduce((prev, curr) => prev + `$${curr.name}Count != null || `, countToJsonStr).slice(0, -4);
      countToJsonStr += ") '_count': { \n		";
      for (const listField of listFields) {
        countToJsonStr += `if ($${listField.name}Count != null) '${listField.name}': $${listField.name}Count, 
		`;
      }
      toJsonContent += ",\n		" + countToJsonStr + "},";
    }
    const equalsContent = equalsKeyVals.join(" &&\n		");
    const hashCodeContent = hashCodeKeyVals.join(" ^\n		");
    const copyWithArgsContent = copyWithArgs.join(",\n		") + ",";
    const copyWithConstructorArgsContent = copyWithConstructorArgs.join(",\n		");
    const copyWithInstanceConstructorArgsContent = copyWithInstanceConstructorArgs.join(",\n		");
    content = content.replace(/#{OverrideAnnotation}/g, "@override");
    content = content.replace(/#{UIDGetter}/g, uidGetter);
    content = content.replace(/#{fromJsonArgs}/g, fromJsonContent);
    content = content.replace(/#{toJsonKeyValues}/g, toJsonContent);
    content = content.replace(/#{Properties}/g, propertiesContent);
    content = content.replace(/#{ConstructorArgs}/g, constructorContent);
    content = content.replace(/#{equalsKeyValues}/g, equalsContent);
    content = content.replace(/#{hashCodeKeyValues}/g, hashCodeContent);
    content = content.replace(/#{CopyWithArgs}/g, copyWithArgsContent);
    content = content.replace(/#{CopyWithConstructorArgs}/g, copyWithConstructorArgsContent);
    content = content.replace(/#{CopyWithInstanceConstructorArgs}/g, copyWithInstanceConstructorArgsContent);
    return content;
  }
  generateUIDGetter(field) {
    let content = dartUIDStub;
    content = content.replace(/#{Type}/g, this.getDartType(field));
    content = content.replace(/#{PropName}/g, field.name);
    content = content.replace(/#{OverrideAnnotation}/g, "@override");
    content = this.replaceNullable(content, field);
    return content;
  }
  generateCopyWithArg(field) {
    let content = dartCopyWithArg;
    content = content.replace(/#{Type}/g, this.getDartType(field));
    content = content.replace(/#{PropName}/g, field.name);
    content = this.replaceNullable(content, field);
    return content;
  }
  generateCopyWithConstructorArg(field) {
    let content = dartCopyWithConstructorArg;
    content = content.replace(/#{PropName}/g, field.name);
    return content;
  }
  generateCopyWithInstanceConstructorArg(field, instanceName) {
    let content = dartCopyWithInstanceConstructorArg;
    content = content.replace(/#{PropName}/g, field.name);
    content = content.replace(/#{InstanceName}/g, instanceName);
    return content;
  }
  generateEqualsKeyValue(field) {
    let content = field.isList ? dartListsEqualStub : dartEqualStub;
    content = content.replace(/#{PropName}/g, field.name);
    return content;
  }
  generateHashCodeValue(field) {
    let content = dartHashCodeKeyValue;
    content = content.replace(/#{PropName}/g, field.name);
    return content;
  }
  generateConstructorArg(field) {
    let content = "";
    if (field.hasDefaultValue && !(field.default instanceof Object)) {
      content = dartConstructorArgumentWithDefaultValue;
      let defValue = field.default;
      let valueStr;
      if (field.kind === "enum") {
        valueStr = `${field.type}.${defValue}`;
      } else {
        valueStr = typeof defValue === "string" ? `"${defValue}"` : defValue.toString();
      }
      content = content.replace(/#{DefaultValue}/g, valueStr);
      content = content.replace(/#{Required}/g, "");
    } else {
      content = dartConstructorArgument;
      content = content.replace(/#{Required}/g, this.isFieldRequired(field) ? "required" : "");
    }
    content = content.replace(/#{PropName}/g, field.name);
    return content;
  }
  isFieldRequired(field) {
    return false;
  }
  printDefaultValue(field) {
    if (field.hasDefaultValue && !(field.default instanceof Object)) {
      let defValue = field.default;
      let valueStr;
      if (field.kind === "enum") {
        return `${field.type}.${defValue}`;
      } else {
        return typeof defValue === "string" ? `"${defValue}"` : defValue.toString();
      }
    } else {
      return null;
    }
  }
  generateFromJsonArgument(field) {
    let code;
    if (field.isList) {
      switch (field.kind) {
        case "object":
          code = dartFromJsonModelListArg;
          break;
        case "enum":
          code = dartFromJsonEnumListArg;
          break;
        case "scalar":
          if (field.type === "Int") {
            code = dartFromJsonScalarIntListArg;
          } else if (field.type === "String") {
            code = dartFromJsonScalarStringListArg;
          } else {
            code = dartFromJsonScalarStringListArg;
          }
          break;
        default:
          code = dartFromJsonArg;
          break;
      }
    } else {
      if (field.kind === "enum") {
        code = dartFromJsonEnumArg;
      } else if (field.type === "DateTime") {
        code = dartFromJsonDateTimeArg;
      } else if (field.kind === "object") {
        code = dartFromJsonRefArg;
      } else {
        code = dartFromJsonArg;
      }
    }
    code = this.replacePropName(code, field);
    code = this.replaceNullable(code, field);
    code = this.replaceType(code, field);
    return code;
  }
  generateToJsonKeyVal(field) {
    let content = field.isList && field.kind === "object" ? toJsonListPropertyStub : toJsonPropertyStub;
    content = this.replacePropName(content, field);
    content = this.replaceNullable(content, field);
    return content;
  }
  generatePropertyContent(field) {
    let content = dartPropertyStub;
    content = content.replace(/#{PropName}/g, field.name);
    content = content.replace(/#{Type}/g, this.getDartType(field));
    content = this.replaceNullable(content, field);
    if (field.name === "id" && field.isId) {
      content = "@override\n" + content;
    }
    return content;
  }
  getDartType(field) {
    let dartType = this.getDartBaseType(field);
    return field.isList ? `List<${dartType}>` : dartType;
  }
  getDartBaseType = (field) => dartTypeMap[field.type] || field.type;
  isProprietaryType = (type) => dartTypeMap[type] == null;
  replaceNullable = (content, field) => content.replace(/#{Nullable}/g, this.isFieldRequired(field) ? "" : "?");
  replacePropName = (content, field) => content.replace(/#{PropName}/g, field.name);
  replaceType = (content, field) => content.replace(/#{Type}/g, this.getDartBaseType(field));
  generateImportStatements() {
    let result = "";
    const checkedTypes = [];
    this.model.fields.forEach(({ type }) => {
      if (!checkedTypes.includes(type)) {
        checkedTypes.push(type);
        if (this.isProprietaryType(type)) {
          result += `import '${StringFns.snakeCase(type)}.dart';
`;
        }
      }
    });
    return result;
  }
};

// libs/prisma-generator-dart/src/generators/enum.generators.ts
var generateDartEnum = ({ name, values }, autoGenText) => {
  const enumValues = values.map(({ name: name2 }) => name2).join(",\n	");
  return `${autoGenText}
enum ${name} {
	${enumValues}
}`;
};

// libs/prisma-generator-dart/src/generator.ts
var fs2 = __toESM(require("fs"));

// libs/prisma-generator-dart/src/stubs/store.stub.ts
var dartStoreStub = `
#{AutoGeneratedWarningText}

import 'package:abcx3/gen_models/common/abcx3_prisma.library.dart';
import 'package:abcx3/gen_models/models_library.dart';


class #{Model}Store<T extends #{Model}> extends ModelStreamStore<int, T> {

  static late final #{Model}Store _instance;

  static #{Model}Store get instance {
    _instance ??= #{Model}Store();
    return _instance;
  }

  #{Model}Store() : super(#{Model}.fromJson as JsonFactory<T>);


  #{GetValMethods}

  #{GetAll$}

  #{GetByPropertyVal$}

  #{GetManyByPropertyVal$}

}

enum #{Model}Route implements Endpoint {

    #{Endpoints};

    const #{Model}Route(this.path, this.method, this.responseType);

    @override
  final String path;

  @override
  final HttpMethod method;

  final Type responseType;

  static String withPathParameter(String path, dynamic param) {
    final regex = RegExp(r':([a-zA-Z]+)');
    return path.replaceFirst(regex, param.toString());
  }

}
`;
var dartStoreGetVal = `#{FieldType}#{Nullable} get#{Model}#{FieldName}(#{Model} #{model}) => #{model}.#{fieldName};`;
var dartStoreGetAll$ = `Stream<List<T?>> getAll$({bool useCache = true}) => getAllItems$(endpoint: #{Model}Route.#{EndPointAllName}, useCache: useCache);`;
var dartStoreGetByPropertyVal$ = `Stream<T?> getBy#{FieldName}$(#{FieldType} #{fieldName}, {bool useCache = true}) =>
getByFieldValue$<#{FieldType}>(getPropVal: get#{Model}#{FieldName}, value: #{fieldName}, endpoint: #{Model}Route.#{EndPointName}, useCache: useCache);`;
var dartStoreGetManyByPropertyVal$ = `Stream<List<T?>> getManyBy#{FieldName}$(#{FieldType} #{fieldName}, {bool useCache = true}) =>
getManyByFieldValue$<#{FieldType}>(getPropVal: get#{Model}#{FieldName}, value: #{fieldName}, endpoint: #{Model}Route.#{EndPointManyName}, useCache: useCache);`;
var dartStoreEndpointName = `getBy#{FieldName}`;
var dartStoreEndpointManyName = `getManyBy#{FieldName}`;
var dartStoreEndpointAllName = `getAll`;
var dartStoreEndpoint = `#{EndPointName}('/#{model}/by#{FieldName}/:#{fieldName}', HttpMethod.get, #{Model})`;
var dartStoreEndpointMany = `#{EndPointManyName}('/#{model}/by#{FieldName}/:#{fieldName}', HttpMethod.get, List<#{Model}>)`;
var dartStoreEndpointAll = `#{EndPointAllName}('/#{model}', HttpMethod.get, List<#{Model}>)`;

// libs/prisma-generator-dart/src/generators/dart_store.generator.ts
var DartStoreGenerator = class {
  constructor(settings, model) {
    this.settings = settings;
    this.model = model;
    this.prismaHelper = PrismaHelper.getInstance();
    this.dartGenerator = new DartGenerator(settings, model);
  }
  prismaHelper;
  dartGenerator;
  generateContent() {
    let content = dartStoreStub;
    content = content.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);
    content = content.replace(/#{Model}/g, this.model.name);
    let getValMethods = [];
    let getUniqueByPropertyVal$ = [];
    let getByPropertyVal$ = [];
    let endpoints = [];
    endpoints.push(this.generateEndpointAll());
    for (const field of this.model.fields) {
      if (field.kind === "object")
        continue;
      getValMethods.push(this.generateGetValMethod(field));
      if (field.isUnique || field.isId) {
        getUniqueByPropertyVal$.push(this.generateGetByPropertyVal$(field));
        endpoints.push(this.generateEndpoint(field));
      } else {
        getByPropertyVal$.push(this.generateGetManyByPropertyVal$(field));
        endpoints.push(this.generateEndpointMany(field));
      }
    }
    content = content.replace(/#{GetAll\$}/g, this.generateGetAll$());
    content = content.replace(/#{GetValMethods}/g, getValMethods.join("\n\n	"));
    content = content.replace(/#{GetByPropertyVal\$}/g, getUniqueByPropertyVal$.join("\n\n	"));
    content = content.replace(/#{GetManyByPropertyVal\$}/g, getByPropertyVal$.join("\n\n	"));
    content = content.replace(/#{Endpoints}/g, endpoints.join(",\n	"));
    return content;
  }
  generateGetValMethod(field) {
    let content = dartStoreGetVal;
    return this.replaceAllVariables(content, field);
  }
  generateGetAll$() {
    let content = dartStoreGetAll$;
    content = content.replace(/#{EndPointAllName}/g, dartStoreEndpointAllName);
    return this.replaceAllVariables(content);
  }
  generateGetByPropertyVal$(field) {
    let content = dartStoreGetByPropertyVal$;
    content = content.replace(/#{EndPointName}/g, this.generateEndpointName(true));
    return this.replaceAllVariables(content, field);
  }
  generateGetManyByPropertyVal$(field) {
    let content = dartStoreGetManyByPropertyVal$;
    content = content.replace(/#{EndPointManyName}/g, this.generateEndpointName(false));
    return this.replaceAllVariables(content, field);
  }
  generateEndpoint(field) {
    let content = dartStoreEndpoint;
    content = content.replace(/#{EndPointName}/g, this.generateEndpointName(true));
    return this.replaceAllVariables(content, field);
  }
  generateEndpointMany(field) {
    let content = dartStoreEndpointMany;
    content = content.replace(/#{EndPointManyName}/g, this.generateEndpointName(false));
    return this.replaceAllVariables(content, field);
  }
  generateEndpointAll() {
    let content = dartStoreEndpointAll;
    content = content.replace(/#{EndPointAllName}/g, dartStoreEndpointAllName);
    return this.replaceAllVariables(content);
  }
  replaceAllVariables(content, field) {
    if (field) {
      content = content.replace(/#{FieldType}/g, this.dartGenerator.getDartType(field));
      content = content.replace(/#{fieldName}/g, field.name);
      content = content.replace(/#{FieldName}/g, StringFns.capitalize(field.name));
    }
    content = content.replace(/#{Nullable}/g, "?");
    content = content.replace(/#{model}/g, StringFns.decapitalize(this.model.name));
    content = content.replace(/#{Model}/g, this.model.name);
    return content;
  }
  generateEndpointName(returnsSingleRecord) {
    return returnsSingleRecord ? dartStoreEndpointName : dartStoreEndpointManyName;
  }
};

// libs/prisma-generator-dart/src/generator.ts
var { version } = require_package();
var defaultOptions = {
  AutoGeneratedWarningText: "//***  AUTO-GENERATED FILE - DO NOT MODIFY ***// ",
  dryRun: false,
  schemaPath: "",
  EnumPath: "enums",
  FormatWithDart: true,
  MakeAllPropsOptional: true,
  // ModelsImplementBaseClass: true,
  CommonSourceDirectory: "common",
  ModelsBaseClassFileName: "prisma_model.dart"
};
(0, import_generator_helper.generatorHandler)({
  onManifest() {
    console.log(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: "../generated",
      prettyName: GENERATOR_NAME
    };
  },
  onGenerate: async (options) => {
    const configOverwrites = {
      schemaPath: options.schemaPath
    };
    const settings = {
      ...defaultOptions,
      ...convertBooleanStrings(options.generator.config),
      ...configOverwrites
    };
    console.log("hello from dart gen");
    const mainGenerator = new MainGenerator(options, settings);
    await mainGenerator.generateFiles();
  }
});
var MainGenerator = class {
  constructor(options, settings) {
    this.options = options;
    this.settings = settings;
    this.writeFile = settings.dryRun ? outputToConsole : writeFileSafely;
    this.outputPath = this.options.generator.output?.value;
  }
  //private dartFiles: string[] = [];
  dartFiles = {};
  dartStoreFiles = {};
  writeFile;
  outputPath;
  async generateFiles(options = this.options, settings = this.settings) {
    for (const model of options.dmmf.datamodel.models) {
      console.log(`Processing Model ${model.name}`);
      await this.generateDartModelFile(model);
      await this.generateDartStoreFile(model);
    }
    for (const tEnum of options.dmmf.datamodel.enums) {
      console.log(`Processing Enum ${tEnum.name}`);
      await this.generateDartEnumFile(tEnum);
    }
    await this.createDartLibraryFile();
    if (this.settings.FormatWithDart) {
      const outputPath = options.generator.output?.value;
      (0, import_child_process.exec)(`dart format "${outputPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.log("dart format couldn't run. Make sure you have Dart installed properly by going to https://dart.dev/get-dart");
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
    this.copyCommonSourceFiles();
    console.log("Done!");
  }
  async writeModelBaseFile() {
    const fileName = this.settings.ModelsBaseClassFileName;
    const filePath = import_path.default.join(this.outputPath, this.settings.CommonSourceDirectory, fileName);
    const code = dartInterfacesAndModelFunctionsStub;
    await this.writeFile(filePath, code);
  }
  async copyCommonSourceFiles() {
    console.log("Copying dart source files");
    console.log("__dirname", __dirname);
    const sourcePath = import_path.default.join(__dirname, "dart_source");
    const targetPath = import_path.default.join(this.outputPath, this.settings.CommonSourceDirectory);
    console.log("sourcePath", sourcePath);
    console.log("targetPath", targetPath);
    await this.copyDirectoryAndContent(sourcePath, targetPath);
  }
  async copyDirectoryAndContent(source, target) {
    return fs2.cp(source, target, { recursive: true }, (err) => {
      if (err) {
        console.log("Error copying dart source files", err);
        return;
      }
      console.log(`${source} was copied to ${target}`);
    });
  }
  async generateDartEnumFile(tEnum) {
    let content = generateDartEnum(tEnum, this.settings.AutoGeneratedWarningText);
    const fileName = `${StringFns.snakeCase(tEnum.name)}.dart`;
    const filePath = import_path.default.join(this.outputPath, fileName);
    console.log(` > Generating enum for Model ${tEnum.name}`);
    await this.writeFile(filePath, content);
    this.dartFiles[tEnum.name] = fileName;
  }
  async createDartLibraryFile() {
    let content = Object.keys(this.dartFiles).reduce((acc, key) => acc + `export '${this.dartFiles[key]}';
`, "");
    const filePath = import_path.default.join(
      this.outputPath,
      `models_library.dart`
    );
    await this.writeFile(filePath, content);
  }
  async generateDartModelFile(model) {
    const dartGenerator = new DartGenerator(this.settings, model);
    const dartContent = dartGenerator.generateContent();
    const fileName = `${StringFns.snakeCase(model.name)}.dart`;
    const filePath = import_path.default.join(
      this.outputPath,
      fileName
    );
    this.dartFiles[model.name] = fileName;
    console.log(` > Generating Dart class for Model ${model.name}`);
    await this.writeFile(filePath, dartContent);
  }
  async generateDartStoreFile(model) {
    const dartStoreGenerator = new DartStoreGenerator(this.settings, model);
    const dartContent = dartStoreGenerator.generateContent();
    const fileName = `${StringFns.snakeCase(model.name)}_store.dart`;
    const filePath = import_path.default.join(
      this.outputPath,
      "stores",
      fileName
    );
    this.dartStoreFiles[model.name] = fileName;
    console.log(` > Generating Dart Store class for Model ${model.name}`);
    await this.writeFile(filePath, dartContent);
  }
};
