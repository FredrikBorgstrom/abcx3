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

// node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.3.1",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://github.com/motdotla/dotenv?sponsor=1",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@definitelytyped/dtslint": "^0.0.133",
        "@types/node": "^18.11.3",
        decache: "^4.6.1",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.5.0",
        tap: "^16.3.0",
        tar: "^6.1.11",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs2 = require("fs");
    var path3 = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var packageJson = require_package();
    var version2 = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        throw new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version2}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version2}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version2}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          throw new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=development");
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        throw new Error("INVALID_DOTENV_KEY: Missing key part");
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        throw new Error("INVALID_DOTENV_KEY: Missing environment part");
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        throw new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let dotenvPath = path3.resolve(process.cwd(), ".env");
      if (options && options.path && options.path.length > 0) {
        dotenvPath = options.path;
      }
      return dotenvPath.endsWith(".vault") ? dotenvPath : `${dotenvPath}.vault`;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path3.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      let dotenvPath = path3.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options) {
        if (options.path != null) {
          dotenvPath = _resolveHome(options.path);
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        }
      }
      try {
        const parsed = DotenvModule.parse(fs2.readFileSync(dotenvPath, { encoding }));
        let processEnv = process.env;
        if (options && options.processEnv != null) {
          processEnv = options.processEnv;
        }
        DotenvModule.populate(processEnv, parsed, options);
        return { parsed };
      } catch (e) {
        if (debug) {
          _debug(`Failed to load ${dotenvPath} ${e.message}`);
        }
        return { error: e };
      }
    }
    function config2(options) {
      const vaultPath = _vaultPath(options);
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      if (!fs2.existsSync(vaultPath)) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.slice(0, 12);
      const authTag = ciphertext.slice(-16);
      ciphertext = ciphertext.slice(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const msg = "INVALID_DOTENV_KEY: It must be 64 characters long (or more)";
          throw new Error(msg);
        } else if (decryptionFailed) {
          const msg = "DECRYPTION_FAILED: Please check your DOTENV_KEY";
          throw new Error(msg);
        } else {
          console.error("Error: ", error.code);
          console.error("Error: ", error.message);
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        throw new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config2,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// node_modules/.pnpm/dotenv-expand@10.0.0/node_modules/dotenv-expand/lib/main.js
var require_main2 = __commonJS({
  "node_modules/.pnpm/dotenv-expand@10.0.0/node_modules/dotenv-expand/lib/main.js"(exports2, module2) {
    "use strict";
    function _searchLast(str, rgx) {
      const matches = Array.from(str.matchAll(rgx));
      return matches.length > 0 ? matches.slice(-1)[0].index : -1;
    }
    function _interpolate(envValue, environment, config2) {
      const lastUnescapedDollarSignIndex = _searchLast(envValue, /(?!(?<=\\))\$/g);
      if (lastUnescapedDollarSignIndex === -1)
        return envValue;
      const rightMostGroup = envValue.slice(lastUnescapedDollarSignIndex);
      const matchGroup = /((?!(?<=\\))\${?([\w]+)(?::-([^}\\]*))?}?)/;
      const match = rightMostGroup.match(matchGroup);
      if (match != null) {
        const [, group, variableName, defaultValue] = match;
        return _interpolate(
          envValue.replace(
            group,
            environment[variableName] || defaultValue || config2.parsed[variableName] || ""
          ),
          environment,
          config2
        );
      }
      return envValue;
    }
    function _resolveEscapeSequences(value) {
      return value.replace(/\\\$/g, "$");
    }
    function expand2(config2) {
      const environment = config2.ignoreProcessEnv ? {} : process.env;
      for (const configKey in config2.parsed) {
        const value = Object.prototype.hasOwnProperty.call(environment, configKey) ? environment[configKey] : config2.parsed[configKey];
        config2.parsed[configKey] = _resolveEscapeSequences(
          _interpolate(value, environment, config2)
        );
      }
      for (const processKey in config2.parsed) {
        environment[processKey] = config2.parsed[processKey];
      }
      return config2;
    }
    module2.exports.expand = expand2;
  }
});

// libs/prisma-generator-dart/package.json
var require_package2 = __commonJS({
  "libs/prisma-generator-dart/package.json"(exports2, module2) {
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

// libs/shared/src/file_utils.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
async function writeFileSafelyAsync(filePath, content) {
  try {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    return await fs.promises.writeFile(filePath, content);
  } catch (err) {
    console.log(`Error writing file ${filePath}: ${err}`);
  }
}
async function outputToConsoleAsync(filePath, content) {
  console.log(`Dryrun prevented writing the following content to file ${filePath}:`);
  console.log(content);
  return Promise.resolve();
}
async function copyCommonSourceFiles(sourcePath, destPath) {
  const fullSourcePath = path.join(__dirname, sourcePath);
  console.log(`Copying directory and content of ${fullSourcePath} to ${destPath}`);
  copyDirectoryAndContent(fullSourcePath, destPath);
}
function copyDirectoryAndContent(source, target) {
  fs.cpSync(source, target, { recursive: true, force: true });
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
  getRelationToFieldName(sourceField, options) {
    const relationName = sourceField.relationName;
    const relationModelName = sourceField.type;
    const relationModel = this.getModelByName(relationModelName, options);
    if (relationModel != null) {
      const relationField = this.getFieldWithRelationName(relationModel, relationName);
      const relationFromFields = relationField?.relationFromFields;
      if (relationFromFields != null && relationFromFields.length > 0) {
        const fromFieldName = relationFromFields[0];
        return fromFieldName;
      }
    }
    return null;
  }
  getModelByName = (modelName, options) => options.dmmf.datamodel.models.find((model) => model.name === modelName);
  getFieldWithRelationName = (model, relationName) => model.fields.find((field) => field.relationName === relationName);
  getFieldNameAndType(field) {
    return {
      name: field.name,
      type: this.convertToTypescriptType(field)
    };
  }
  // public getReferingField(model: DMMF.Model, referedField: DMMF.Field): DMMF.Field | null {
  // const referingField = model.fields.find(field => field.kind === 'object' && field.type === referencedModel.name);
  // return referingField || null;
  // }
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
    if (obj[key] != void 0)
      result[key] = convertBooleanString(obj[key]);
  }
  return result;
}
function convertEnvStrings(obj) {
  const result = {};
  for (const key in obj) {
    if (obj[key] != void 0)
      result[key] = convertEnvString(obj[key]);
  }
  return result;
}
function convertEnvString(value) {
  const matchArray = value.match(/\${(.+)}/);
  if (matchArray && matchArray.length === 2) {
    const envVarName = matchArray[1];
    const envValue = process.env[envVarName];
    if (envValue !== void 0) {
      return envValue;
    }
  }
  return value;
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

// libs/shared/src/index.ts
var import_dotenv = __toESM(require_main());
var import_dotenv_expand = __toESM(require_main2());
function initEnv() {
  const env = (0, import_dotenv.config)();
  (0, import_dotenv_expand.expand)(env);
}

// libs/prisma-generator-dart/src/generator.ts
var import_child_process = require("child_process");
var import_path = __toESM(require("path"));

// libs/prisma-generator-dart/src/constants.ts
var GENERATOR_NAME = "prisma-generator-dart";

// libs/prisma-generator-dart/src/stubs/dart.stub.ts
var dartBaseClassStub = `
#{AutoGeneratedWarningText}

import '../abcx3_common.library.dart';
#{AdditionalImports}

class #{ClassName}#{ParentClass} implements #{ImplementsPrismaModel} #{ImplementsId} {
    #{Properties}
    
    /// Creates a new instance of the GameMove class.
  /// All parameters are optional and default to null.
    #{ClassName}({#{ConstructorArgs}});

    #{UIDGetter}

    Map<String, GetPropertyValueFunction<#{Model}, dynamic>> propertyValueFunctionMap = {
      #{GetPropertyValueFunctions}
    };

    /// gets a function by property name that returns the property value from the model
    @override
  dynamic Function(#{Model}) getPropToValueFunction(String propertyName) {
    final propFunction = propertyValueFunctionMap[propertyName];
    if (propFunction == null) {
      throw Exception('Property "$propertyName" not found in #{Model}');
    }
    return propFunction;
  }

    #{EqualById}

    /// Creates a new instance of the GameMove class from a JSON object.
    #{OverrideAnnotation}
    factory #{ClassName}.fromJson(Map<String, dynamic> json) =>
      #{ClassName}(
        #{fromJsonArgs}
      );

      /// Creates a new instance populated with the values of this instance and the given values,
    /// where this instance's values has precedence.
      #{OverrideAnnotation}  
    #{ClassName} copyWith({
        #{CopyWithArgs}
        }) {
        return #{ClassName}(
            #{CopyWithConstructorArgs}
        );
    }

    /// Creates a new instance populated with the values of this instance and the given instance,
    /// where this instance's values has precedence.

    #{OverrideAnnotation}
    #{ClassName} copyWithInstanceValues(#{ClassName} #{InstanceName}) {
        return #{ClassName}(
            #{CopyWithInstanceConstructorArgs}
        );
    }

    /// Updates this instance with the values of the given instance,
  /// where this instance has precedence.

    #{OverrideAnnotation}
    #{ClassName} updateWithInstanceValues(#{ClassName} #{InstanceName}) {
        #{UpdateWithInstanceSetters}
        return this;
    }
    /// Converts this instance to a JSON object.
    #{OverrideAnnotation}
    Map<String, dynamic> toJson() => ({
        #{toJsonKeyValues}
      });

      /// Determines whether this instance and another object represent the same
      /// game move.
    #{OverrideAnnotation}
    bool operator == (Object other) =>
            identical(this, other) || other is #{ClassName} &&
                runtimeType == other.runtimeType &&
                #{equalsKeyValues};

    /// Updates this instance with the values of the given instance,
    /// where this instance has precedence.
    #{OverrideAnnotation}
        int get hashCode => #{hashCodeKeyValues};
    }
    `;
var dartUIDStub = `
#{OverrideAnnotation}
#{Type}#{Nullable} get $uid => #{PropName};`;
var getPropertyValueFunctionStub = `"#{fieldName}": (m) => m.#{fieldName},`;
var dartEqualByIdStub = `
#{OverrideAnnotation}
bool equalById(UID<#{Type}> other) => $uid == other.$uid;`;
var dartCopyWithArg = `#{Type}#{Nullable} #{PropName}`;
var dartCopyWithConstructorArg = `#{PropName}: #{PropName} ?? this.#{PropName}`;
var dartCopyWithInstanceConstructorArg = `#{PropName}: #{InstanceName}.#{PropName} ?? #{PropName}`;
var updateWithInstanceSetters = `#{PropName} = #{InstanceName}.#{PropName} ?? #{PropName}`;
var dartFromJsonArg = `#{PropName}: json['#{PropName}'] as #{Type}#{Nullable}`;
var dartFromJsonRefArg = `#{PropName}: json['#{PropName}'] != null ? #{Type}.fromJson(json['#{PropName}'] as Map<String, dynamic>) : null`;
var dartFromJsonScalarIntListArg = `#{PropName}: json['#{PropName}'] != null ? (json['#{PropName}'] as List<dynamic>).map((e) => int.parse(e.toString())).toList() : null`;
var dartFromJsonScalarStringListArg = `#{PropName}: json['#{PropName}'] != null ? (json['#{PropName}'] as List<dynamic>).map((e) => e.toString()).toList() : null`;
var dartFromJsonModelListArg = `#{PropName}: json['#{PropName}'] != null ? createModels<#{Type}>(json['#{PropName}'], #{Type}.fromJson) : null`;
var dartFromJsonEnumArg = `#{PropName}: json['#{PropName}'] != null ? #{Type}.fromJson(json['#{PropName}']) : null`;
var dartFromJsonEnumListArg = `#{PropName}: json['#{PropName}'] != null ? (json['#{PropName}']).map((item) => #{Type}.fromJson(item)).toList()) : null`;
var dartFromJsonDateTimeArg = `#{PropName}: json['#{PropName}'] != null ? DateTime.parse(json['#{PropName}']) : null`;
var toJsonPropertyStub = `if(#{PropName} != null) '#{PropName}': #{PropName}`;
var toJsonObjectStub = `if(#{PropName} != null) '#{PropName}': #{PropName}#{Nullable}.toJson()`;
var toJsonObjectListStub = `if(#{PropName} != null) '#{PropName}': #{PropName}#{Nullable}.map((item) => item.toJson()).toList()`;
var dartEqualStub = `#{PropName} == other.#{PropName}`;
var dartListsEqualStub = `areListsEqual(#{PropName}, other.#{PropName})`;
var dartHashCodeKeyValue = `#{PropName}.hashCode`;
var dartConstructorArgument = `#{Required} this.#{PropName}`;
var dartConstructorArgumentWithDefaultValue = `#{Required} this.#{PropName} = #{DefaultValue}`;
var dartPropertyStub = `#{Type}#{Nullable} #{PropName};`;
var dartEnumStub = `
#{AutoGeneratedWarningText}
enum #{ModelName} {
    #{EnumValues};
   
    toJson() => toString().split('.').last;

    factory #{ModelName}.fromJson(String name) => values.byName(name);
  
}
`;

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
    content = content.replace(/#{Model}/g, className);
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
    const updateWithInstanceSetters2 = [];
    let listFields = [];
    const getPropToValueFunction = [];
    let uidGetter = "";
    let equalById = "";
    for (const field of this.model.fields) {
      const commentDirectives = this.prismaHelper.parseDocumentation(field);
      if (commentDirectives.some((directive) => directive.name === "@abcx3_omit")) {
        continue;
      }
      if (field.isId) {
        uidGetter = this.generateUIDGetter(field);
        equalById = this.generateEqualById(field);
        content = content.replace(/#{ImplementsPrismaModel}/g, `PrismaModel<${this.getDartType(field)}, ${className}>`);
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
      updateWithInstanceSetters2.push(this.generateUpdateWithInstanceSetter(field, instanceName));
      getPropToValueFunction.push(this.generatePropertyToValFunction(field));
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
    const updateWithInstanceSettersContent = updateWithInstanceSetters2.join(";\n		") + ";";
    content = content.replace(/#{OverrideAnnotation}/g, "@override");
    content = content.replace(/#{UIDGetter}/g, uidGetter);
    content = content.replace(/#{GetPropertyValueFunctions}/g, getPropToValueFunction.join("\n\n	"));
    content = content.replace(/#{EqualById}/g, equalById);
    content = content.replace(/#{fromJsonArgs}/g, fromJsonContent);
    content = content.replace(/#{toJsonKeyValues}/g, toJsonContent);
    content = content.replace(/#{Properties}/g, propertiesContent);
    content = content.replace(/#{ConstructorArgs}/g, constructorContent);
    content = content.replace(/#{equalsKeyValues}/g, equalsContent);
    content = content.replace(/#{hashCodeKeyValues}/g, hashCodeContent);
    content = content.replace(/#{CopyWithArgs}/g, copyWithArgsContent);
    content = content.replace(/#{CopyWithConstructorArgs}/g, copyWithConstructorArgsContent);
    content = content.replace(/#{CopyWithInstanceConstructorArgs}/g, copyWithInstanceConstructorArgsContent);
    content = content.replace(/#{UpdateWithInstanceSetters}/g, updateWithInstanceSettersContent);
    return content;
  }
  generatePropertyToValFunction(field) {
    let content = getPropertyValueFunctionStub;
    return this.replaceAllVariables(content, field);
  }
  generateUIDGetter(field) {
    let content = dartUIDStub;
    content = content.replace(/#{OverrideAnnotation}/g, "@override");
    content = content.replace(/#{Type}/g, this.getDartType(field));
    content = content.replace(/#{PropName}/g, field.name);
    content = this.replaceNullable(content, field);
    return content;
  }
  generateEqualById(field) {
    let content = dartEqualByIdStub;
    content = content.replace(/#{OverrideAnnotation}/g, "@override");
    content = content.replace(/#{Type}/g, this.getDartType(field));
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
  generateUpdateWithInstanceSetter(field, instanceName) {
    let content = updateWithInstanceSetters;
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
    let content;
    if (field.kind === "object" || field.kind === "enum") {
      content = field.isList ? toJsonObjectListStub : toJsonObjectStub;
    } else {
      content = toJsonPropertyStub;
    }
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
  replaceAllVariables(content, field) {
    if (field) {
      content = content.replace(/#{FieldType}/g, this.getDartBaseType(field));
      content = content.replace(/#{DartType}/g, this.getDartType(field));
      content = content.replace(/#{IncludeType}/g, `List<${field.type}Include>?`);
      content = content.replace(/#{fieldName}/g, field.name);
      content = content.replace(/#{FieldName}/g, StringFns.capitalize(field.name));
    }
    content = content.replace(/#{Nullable}/g, "?");
    content = content.replace(/#{moDel}/g, StringFns.decapitalize(this.model.name));
    content = content.replace(/#{Model}/g, this.model.name);
    return content;
  }
};

// libs/prisma-generator-dart/src/stubs/store.stub.ts
var dartStoreStub = `
#{AutoGeneratedWarningText}

part of '../abcx3_stores_library.dart';


class #{Model}Store extends ModelStreamStore<int, #{Model}> {

  static #{Model}Store? _instance;

  static #{Model}Store get instance {
    _instance ??= #{Model}Store();
    return _instance!;
  }

  #{Model}Store() : super(#{Model}.fromJson) {
    if (_instance != null) {
        throw Exception(
            '#{Model}Store is a singleton class and an instance of it already exists. '
                'This can happen if you are extending #{Model}Store, so it is recommended to NOT extend the store classes. '
                'Instead you should use #{Model}Store.instance to access the store instance. ');
      }
      _instance = this;
  }

  /// GET PROPERTIES FROM MODEL

  #{GetValMethods}

  /// GET THIS MODEL(S) BY PROPERTY VALUE

  #{GetByPropertyVal}

  #{GetManyByPropertyVal}

  /// GET RELATED MODELS WITH ID STORED IN THIS MODEL

  #{GetRelatedModelsWithId}

  /// GET RELATED MODELS 

  #{GetRelatedModels}

  //////// STREAM METHODS //////////

  /// GET THIS MODEL as STREAM

  #{GetAll$}

  #{GetByPropertyVal$}

  #{GetManyByPropertyVal$}

  /// GET RELATED MODELS WITH ID STORED IN THIS MODEL as STREAM

  #{GetRelatedModelsWithId$}

  /// GET RELATED MODELS as STREAM

  #{GetRelatedModels$}

  // ADD REF MODELS TO REF STORES

  #{UpdateRefStores}

  #{UpdateRefStoresForList}

}

#{ClassInclude}


enum #{Model}Endpoints implements Endpoint {

    #{Endpoints};

    const #{Model}Endpoints(this.path, this.method, this.responseType);

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
var dartStoreClassIncludeStub = `
class #{Model}Include<T extends PrismaModel> implements StoreIncludes<T> {

    @override
    bool useCache;

    @override
    bool useAsync;

    @override
    ModelFilterGroup<T>? filterGroup;
  
    @override
    late Function method;
  
      #{IncludeConstructors}
  }`;
var dartStoreIncludesConstructor = `#{Model}Include.#{fieldName}({
    this.useCache = true,
    this.useAsync = true,
    ModelFilterGroup<#{FieldType}>? filterGroup,
    #{IncludeType} includes}) {
    if (useAsync) {
        this.filterGroup = filterGroup as ModelFilterGroup<T>?;
        method = (#{moDel}) => #{Model}Store.instance
            .get#{FieldName}$(#{moDel}, useCache: useCache, filterGroup: filterGroup, includes: includes);
      } else {
        method = (#{moDel}) => #{Model}Store.instance
            .get#{FieldName}(#{moDel}, filterGroup: filterGroup, includes: includes);
      }
}`;
var dartStoreIncludesEmptyConstructor = `#{Model}Include.empty({this.useCache = true, this.useAsync = true});`;
var dartStoreGetVal = `#{DartType}#{Nullable} get#{Model}#{FieldName}(#{Model} #{moDel}) => #{moDel}.#{fieldName};`;
var dartStoreGetAll$ = `Stream<List<#{Model}>> getAll$({bool useCache = true, ModelFilterGroup<#{Model}>? filterGroup, List<#{Model}Include>? includes}) {
    final allItems$ = getAllItems$(endpoint: #{Model}Endpoints.#{EndPointAllName}, filterGroup: filterGroup, useCache: useCache);
    if (includes == null || includes.isEmpty) {
        return allItems$;
      } else {
        return getManyIncluding$(allItems$, includes);
      }
    }
`;
var dartStoreGetByPropertyVal = `
#{Model}? getBy#{FieldName}(
    #{FieldType} #{fieldName},
    {ModelFilterGroup<#{Model}>? filterGroup, List<#{Model}Include>? includes}
    ) =>
    getIncluding(get#{Model}#{FieldName}, #{fieldName}, filterGroup: filterGroup, includes: includes);`;
var dartStoreGetManyByPropertyVal = `
List<#{Model}> getBy#{FieldName}(
    #{FieldType} #{fieldName},
    {ModelFilterGroup<#{Model}>? filterGroup, List<#{Model}Include>? includes}
    ) =>
    getManyIncluding(get#{Model}#{FieldName}, #{fieldName}, filterGroup: filterGroup, includes: includes);`;
var dartStoreGetRelatedModelsWithId = `#{StreamReturnType} get#{FieldName}(
    #{Model} #{moDel}, {ModelFilterGroup? filterGroup, #{IncludeType} includes}) {
    final #{fieldName} = #{FieldType}Store.instance.getById(#{moDel}.#{relationFromField}!, includes: includes);
    #{moDel}.#{fieldName} = #{fieldName};
    // setIncludedReferences(#{fieldName}, includes: includes);
    return #{fieldName};
}`;
var dartStoreGetRelatedModels = `#{StreamReturnType} get#{FieldName}(
    #{Model} #{moDel}, {ModelFilterGroup<#{FieldType}>? filterGroup, #{IncludeType} includes}) {
    final #{fieldName} = #{RelatedModelStore}.instance.getBy#{RelationToFieldName}(#{moDel}.$uid!, filterGroup: filterGroup, includes: includes);
    #{moDel}.#{fieldName} = #{fieldName};
    // #{setRefModelFunction}(#{fieldName}, includes: includes);
    return #{fieldName};
}`;
var dartStoreUpdateRefStores = `#{Model} updateRefStores(#{Model} #{moDel}, {int recursiveDepth = #{UpdateStoresRecursiveDepth_SETTING}}) {
    if (recursiveDepth > 0) {
        recursiveDepth--;
        #{UpdateRefStoreForFields}
    }
    return upsert(#{moDel});
}`;
var dartStoreUpdateRefStoresForList = `List<#{Model}> updateRefStoresForList(List<#{Model}> #{moDel}s, {int recursiveDepth = #{UpdateStoresRecursiveDepth_SETTING}}) {
    final updated#{Model}s = <#{Model}>[];
    for (var #{moDel} in #{moDel}s) {
        updated#{Model}s.add(updateRefStores(#{moDel}, recursiveDepth: recursiveDepth));
    }
    return updated#{Model}s;
}`;
var dartStoreUpdateRefStoreForField = `if (#{moDel}.#{fieldName} != null) {
        #{FieldType}Store.instance.updateRefStores(#{moDel}.#{fieldName}!, recursiveDepth: recursiveDepth);
    }`;
var dartStoreUpdateRefStoreForListField = `if (#{moDel}.#{fieldName} != null) {
        #{FieldType}Store.instance.updateRefStoresForList(#{moDel}.#{fieldName}!, recursiveDepth: recursiveDepth);
    }`;
var dartStoreGetByPropertyVal$ = `
    Stream<#{Model}?> getBy#{FieldName}$(
        #{FieldType} #{fieldName},
        {bool useCache = true,
        ModelFilterGroup<#{Model}>? filterGroup,
        List<#{Model}Include>? includes}) {
    final item$ = getByFieldValue$<#{FieldType}>(
        getPropVal: get#{Model}#{FieldName},
        value: #{fieldName},
        filterGroup: filterGroup,
        endpoint: #{Model}Endpoints.#{EndPointName},
        useCache: useCache);
    if (includes == null || includes.isEmpty) {
        return item$;
    } else {
        return getIncluding$<#{Model}?>(item$, includes);
    }
}
`;
var dartStoreGetManyByPropertyVal$ = `
    Stream<List<#{Model}>> getBy#{FieldName}$(
        #{FieldType} #{fieldName},
        {bool useCache = true,
        ModelFilterGroup<#{Model}>? filterGroup,
        List<#{Model}Include>? includes}) {
    final items$ = getManyByFieldValue$<#{FieldType}>(
        getPropVal: get#{Model}#{FieldName},
        value: #{fieldName},
        filterGroup: filterGroup,
        endpoint: #{Model}Endpoints.#{EndPointManyName},
        useCache: useCache);
    if (includes == null || includes.isEmpty) {
        return items$;
    } else {
        return getManyIncluding$<#{Model}>(items$, includes);
    }
}
`;
var dartStoreGetRelatedModelsWithId$ = `Stream<#{StreamReturnType}> get#{FieldName}$(
    #{Model} #{moDel}, {bool useCache = true, ModelFilterGroup<#{FieldType}>? filterGroup, #{IncludeType} includes}) {
    return #{FieldType}Store.instance.getById$(
        #{moDel}.#{relationFromField}!,
        useCache: useCache,
        filterGroup: filterGroup,
        includes: includes)
    .doOnData((#{fieldName}) {
        #{moDel}.#{fieldName} = #{fieldName};
    });
}`;
var dartStoreGetRelatedModels$ = `Stream<#{StreamReturnType}> get#{FieldName}$(
    #{Model} #{moDel}, {bool useCache = true, ModelFilterGroup<#{FieldType}>? filterGroup, #{IncludeType} includes}) {
    return #{RelatedModelStore}.instance.getBy#{RelationToFieldName}$(
        #{moDel}.$uid!,
        useCache: useCache,
        filterGroup: filterGroup,
        includes: includes)
    .doOnData((#{fieldName}) {
        #{moDel}.#{fieldName} = #{fieldName};
    });

}`;
var dartStoreEndpointName = `getBy#{FieldName}`;
var dartStoreEndpointManyName = `getManyBy#{FieldName}`;
var dartStoreEndpointAllName = `getAll`;
var dartStoreEndpoint = `#{EndPointName}('/#{moDel}/by#{FieldName}/:#{fieldName}', HttpMethod.post, #{Model})`;
var dartStoreEndpointMany = `#{EndPointManyName}('/#{moDel}/by#{FieldName}/:#{fieldName}', HttpMethod.post, List<#{Model}>)`;
var dartStoreEndpointAll = `#{EndPointAllName}('/#{moDel}', HttpMethod.post, List<#{Model}>)`;

// libs/prisma-generator-dart/src/generators/dart_store.generator.ts
var DartStoreGenerator = class {
  constructor(settings, model, options) {
    this.settings = settings;
    this.model = model;
    this.options = options;
    this.prismaHelper = PrismaHelper.getInstance();
    this.dartGenerator = new DartGenerator(settings, model);
  }
  prismaHelper;
  dartGenerator;
  generateContent() {
    let content = dartStoreStub;
    content = content.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);
    content = content.replace(/#{Model}/g, this.model.name);
    const getValMethods = [];
    const getUniqueByPropertyVal = [];
    const getByPropertyVal = [];
    const GetRelatedModels = [];
    const GetRelatedModelsWithId = [];
    const getUniqueByPropertyVal$ = [];
    const getByPropertyVal$ = [];
    const endpoints = [];
    const GetRelatedModels$ = [];
    const GetRelatedModelsWithId$ = [];
    const modelFields = [];
    const includesConstructor = [];
    endpoints.push(this.generateEndpointAll());
    for (const field of this.model.fields) {
      if (field.kind === "object") {
        modelFields.push(field);
        includesConstructor.push(this.generateIncludesConstructor(field));
        const relationFromFields = field.relationFromFields;
        if (relationFromFields != null && relationFromFields?.length > 0) {
          const relatedFieldName = relationFromFields[0];
          GetRelatedModelsWithId$.push(this.generateGetRelatedModelsWithId$(field, relatedFieldName));
          GetRelatedModelsWithId.push(this.generateGetRelatedModelsWithId(field, relatedFieldName));
        } else {
          const relatedModelStore = `${field.type}Store`;
          GetRelatedModels$.push(this.generateGetRelatedModels$(field, relatedModelStore));
          GetRelatedModels.push(this.generateGetRelatedModels(field, relatedModelStore));
        }
      } else {
        getValMethods.push(this.generateGetValMethod(field));
        if (field.isUnique || field.isId) {
          getUniqueByPropertyVal$.push(this.generateGetByPropertyVal$(field));
          if (!field.isId) {
            getUniqueByPropertyVal.push(this.generateGetByPropertyVal(field));
          }
          endpoints.push(this.generateEndpoint(field));
        } else {
          getByPropertyVal$.push(this.generateGetManyByPropertyVal$(field));
          getByPropertyVal.push(this.generateGetManyByPropertyVal(field));
          endpoints.push(this.generateEndpointMany(field));
        }
      }
    }
    content = content.replace(/#{GetAll\$}/g, this.generateGetAll$());
    content = content.replace(/#{GetValMethods}/g, getValMethods.join("\n\n	"));
    content = content.replace(/#{GetByPropertyVal}/g, getUniqueByPropertyVal.join("\n\n	"));
    content = content.replace(/#{GetManyByPropertyVal}/g, getByPropertyVal.join("\n\n	"));
    content = content.replace(/#{GetRelatedModelsWithId}/g, GetRelatedModelsWithId.join("\n\n	"));
    content = content.replace(/#{GetRelatedModels}/g, GetRelatedModels.join("\n\n	"));
    content = content.replace(/#{GetByPropertyVal\$}/g, getUniqueByPropertyVal$.join("\n\n	"));
    content = content.replace(/#{GetManyByPropertyVal\$}/g, getByPropertyVal$.join("\n\n	"));
    content = content.replace(/#{GetRelatedModelsWithId\$}/g, GetRelatedModelsWithId$.join("\n\n	"));
    content = content.replace(/#{GetRelatedModels\$}/g, GetRelatedModels$.join("\n\n	"));
    content = content.replace(/#{UpdateRefStores}/g, this.generateUpdateRefStores(modelFields));
    content = content.replace(/#{UpdateRefStoresForList}/g, this.generateUpdateRefStoresForList());
    content = content.replace(/#{Endpoints}/g, endpoints.join(",\n	"));
    if (includesConstructor.length === 0) {
      includesConstructor.push(this.replaceAllVariables(dartStoreIncludesEmptyConstructor));
    }
    let classIncludeContent = this.replaceAllVariables(dartStoreClassIncludeStub);
    classIncludeContent = classIncludeContent.replace(/#{IncludeConstructors}/g, includesConstructor.join("\n\n	"));
    content = content.replace(/#{ClassInclude}/g, classIncludeContent);
    return content;
  }
  generateIncludesConstructor(field) {
    let content = dartStoreIncludesConstructor;
    return this.replaceAllVariables(content, field);
  }
  generateGetValMethod(field) {
    let content = dartStoreGetVal;
    return this.replaceAllVariables(content, field);
  }
  /* generatePropertyToValFunction(field: DMMF.Field) {
      let content = getPropertyValueFunctionStub;
      return this.replaceAllVariables(content, field);
  } */
  generateGetAll$() {
    let content = dartStoreGetAll$;
    content = content.replace(/#{EndPointAllName}/g, dartStoreEndpointAllName);
    return this.replaceAllVariables(content);
  }
  generateGetByPropertyVal(field) {
    let content = dartStoreGetByPropertyVal;
    return this.replaceAllVariables(content, field);
  }
  generateGetManyByPropertyVal(field) {
    let content = dartStoreGetManyByPropertyVal;
    return this.replaceAllVariables(content, field);
  }
  generateGetRelatedModelsWithId(field, relationFromField) {
    let content = dartStoreGetRelatedModelsWithId;
    content = content.replace(/#{relationFromField}/g, relationFromField);
    content = content.replace(/#{StreamReturnType}/g, `${field.type}?`);
    return this.replaceAllVariables(content, field);
  }
  generateGetRelatedModels(field, relatedModelStore) {
    const relationToFieldName = PrismaHelper.getInstance().getRelationToFieldName(field, this.options) ?? "";
    const relationToFieldNameCapitalized = StringFns.capitalize(relationToFieldName);
    let content = dartStoreGetRelatedModels;
    content = content.replace(/#{RelatedModelStore}/g, relatedModelStore);
    content = content.replace(/#{relationToFieldName}/g, relationToFieldName);
    content = content.replace(/#{RelationToFieldName}/g, relationToFieldNameCapitalized);
    if (field.isList) {
      content = content.replace(/#{StreamReturnType}/g, `List<${field.type}>`);
      content = content.replace(/#{setRefModelFunction}/g, "setIncludedReferencesForList");
    } else {
      content = content.replace(/#{StreamReturnType}/g, `${field.type}?`);
      content = content.replace(/#{setRefModelFunction}/g, "setIncludedReferences");
    }
    return this.replaceAllVariables(content, field);
  }
  generateUpdateRefStores(fields) {
    let content = dartStoreUpdateRefStores;
    content = this.replaceAllVariables(content);
    let updateRefStores = "";
    for (const field of fields) {
      updateRefStores += this.generateUpdateRefStoreForField(field);
    }
    content = content.replace(/#{UpdateRefStoreForFields}/g, updateRefStores);
    content = content.replace(/#{UpdateStoresRecursiveDepth_SETTING}/g, this.settings.UpdateStoresDefaultRecursiveDepth.toString());
    return content;
  }
  generateUpdateRefStoreForField(field) {
    let content = field.isList ? dartStoreUpdateRefStoreForListField : dartStoreUpdateRefStoreForField;
    content = content.replace(/#{FieldType}/g, field.type);
    return this.replaceAllVariables(content, field);
  }
  generateUpdateRefStoresForList() {
    let content = dartStoreUpdateRefStoresForList;
    content = content.replace(/#{UpdateStoresRecursiveDepth_SETTING}/g, this.settings.UpdateStoresDefaultRecursiveDepth.toString());
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
  generateGetRelatedModelsWithId$(field, relationFromField) {
    let content = dartStoreGetRelatedModelsWithId$;
    content = content.replace(/#{relationFromField}/g, relationFromField);
    content = content.replace(/#{StreamReturnType}/g, `${field.type}?`);
    return this.replaceAllVariables(content, field);
  }
  generateGetRelatedModels$(field, relatedModelStore) {
    let relationToFieldName = StringFns.capitalize(PrismaHelper.getInstance().getRelationToFieldName(field, this.options) ?? "");
    let content = dartStoreGetRelatedModels$;
    content = content.replace(/#{RelatedModelStore}/g, relatedModelStore);
    content = content.replace(/#{RelationToFieldName}/g, relationToFieldName);
    if (field.isList) {
      content = content.replace(/#{StreamReturnType}/g, `List<${field.type}>`);
    } else {
      content = content.replace(/#{StreamReturnType}/g, `${field.type}?`);
    }
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
    return this.dartGenerator.replaceAllVariables(content, field);
  }
  generateEndpointName(returnsSingleRecord) {
    return returnsSingleRecord ? dartStoreEndpointName : dartStoreEndpointManyName;
  }
};

// libs/prisma-generator-dart/src/generators/enum.generators.ts
var generateDartEnum = ({ name, values }, autoGenText) => {
  const enumValues = values.map(({ name: name2 }) => name2).join(",\n	");
  let enumStub = dartEnumStub;
  enumStub = enumStub.replace(/#{AutoGeneratedWarningText}/g, autoGenText);
  enumStub = enumStub.replace(/#{ModelName}/g, name);
  enumStub = enumStub.replace(/#{EnumValues}/g, enumValues);
  return enumStub;
};

// libs/prisma-generator-dart/src/stubs/stores_library.stub.ts
var dartStoreLibrary = `
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

part 'stores_common/filter_operator_and_value.dart';
part 'stores_common/property_filter.dart';
part 'stores_common/model_filter_group.dart';

#{StoreParts}
`;

// libs/prisma-generator-dart/src/generator.ts
var { version } = require_package2();
var defaultOptions = {
  AutoGeneratedWarningText: "//***  AUTO-GENERATED FILE - DO NOT MODIFY ***// ",
  active: true,
  dryRun: false,
  schemaPath: "",
  EnumPath: "enums",
  FormatWithDart: true,
  MakeAllPropsOptional: true,
  UpdateStoresDefaultRecursiveDepth: 4
  // ModelsImplementBaseClass: true,
  // CommonSourceDirectory: 'common',
  // ModelsBaseClassFileName: 'prisma_model.dart',
};
(0, import_generator_helper.generatorHandler)({
  onManifest() {
    console.log(`${GENERATOR_NAME}:Registered`);
    initEnv();
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
    const optionsWithEnvSettings = convertEnvStrings(options.generator.config);
    const optionsWithBooleanSettings = convertBooleanStrings(optionsWithEnvSettings);
    const settings = {
      ...defaultOptions,
      ...optionsWithBooleanSettings,
      ...configOverwrites
    };
    if (settings.active === true) {
      const mainGenerator = new MainGenerator(options, settings);
      await mainGenerator.generateFiles();
    } else {
      console.log("dart generator is not active");
    }
  }
});
var MainGenerator = class {
  constructor(options, settings) {
    this.options = options;
    this.settings = settings;
    this.writeFile = settings.dryRun ? outputToConsoleAsync : writeFileSafelyAsync;
    this.outputPath = this.options.generator.output?.value;
  }
  //private dartFiles: string[] = [];
  modelFiles = {};
  dartStoreFiles = {};
  writeFile;
  outputPath;
  async generateFiles(options = this.options, settings = this.settings) {
    copyCommonSourceFiles("dart_source", this.outputPath);
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
    await this.generateStoreLibraryFile();
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
    console.log("Done!");
  }
  /*  async writeModelBaseFile() {
       const fileName = this.settings.ModelsBaseClassFileName;
       const filePath = path.join(this.outputPath, this.settings.CommonSourceDirectory, fileName);
       const code = dartInterfacesAndModelFunctionsStub;
       await this.writeFile(filePath, code);
   } */
  /* async copyCommonSourceFiles(dirName: string, destPath: string) {
      console.log('Copying dart source files');
      console.log('__dirname', __dirname);
      const sourcePath = path.join(__dirname, dirName);
      this.copyDirectoryAndContent(sourcePath, destPath;
  } */
  /* const common_src = path.join(sourcePath, 'common');
          const common_dest =  path.join(this.outputPath, 'common');
          await this.copyDirectoryAndContent(common_src, common_dest);
  
          const stores_common_src = path.join(sourcePath, 'stores_common');
          const stores_common_dest =  path.join(this.outputPath, 'stores_common');
          await this.copyDirectoryAndContent(stores_common_src, stores_common_dest); */
  /* async copyDirectoryAndContent(source: string, target: string) {
      
      return await fs.cp(source, target, {recursive: true}, (err) => {
          if (err) {
              console.log('Error copying dart source files', err);
              return;
          }
          console.log(`${source} was copied to ${target}`);
      });
  } */
  /* copyDirectoryAndContent(source: string, target: string) {
      fs.cpSync(source, target, { recursive: true, force: true });
  } */
  async generateDartEnumFile(tEnum) {
    let content = generateDartEnum(tEnum, this.settings.AutoGeneratedWarningText);
    const fileName = `${StringFns.snakeCase(tEnum.name)}.dart`;
    const filePath = import_path.default.join(this.outputPath, "models", fileName);
    console.log(` > Generating enum for Model ${tEnum.name}`);
    await this.writeFile(filePath, content);
    this.modelFiles[tEnum.name] = "models/" + fileName;
  }
  async createDartLibraryFile() {
    let content = Object.keys(this.modelFiles).reduce((acc, key) => acc + `export '${this.modelFiles[key]}';
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
      "models",
      fileName
    );
    this.modelFiles[model.name] = "models/" + fileName;
    console.log(` > Generating Dart class for Model ${model.name}`);
    await this.writeFile(filePath, dartContent);
  }
  async generateDartStoreFile(model) {
    const dartStoreGenerator = new DartStoreGenerator(this.settings, model, this.options);
    const dartContent = dartStoreGenerator.generateContent();
    const fileName = `${StringFns.snakeCase(model.name)}_store.dart`;
    const filePath = import_path.default.join(
      this.outputPath,
      "stores",
      fileName
    );
    this.dartStoreFiles[model.name] = "stores/" + fileName;
    console.log(` > Generating Dart Store class for Model ${model.name}`);
    await this.writeFile(filePath, dartContent);
  }
  async generateStoreLibraryFile() {
    let content = dartStoreLibrary;
    let partsContent = Object.keys(this.dartStoreFiles).reduce((acc, key) => acc + `part '${this.dartStoreFiles[key]}';
`, "");
    content = content.replace(/#{StoreParts}/g, partsContent);
    const filePath = import_path.default.join(
      this.outputPath,
      `abcx3_stores_library.dart`
    );
    await this.writeFile(filePath, content);
  }
};
