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

// node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.4.5",
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
        "test:coverage": "tap --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://dotenvx.com",
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

// node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs3 = require("fs");
    var path4 = require("path");
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
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
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
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs3.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path4.resolve(process.cwd(), ".env.vault");
      }
      if (fs3.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path4.join(os.homedir(), envPath.slice(1)) : envPath;
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
      const dotenvPath = path4.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path5 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs3.readFileSync(path5, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path5} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config2(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
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

// node_modules/.pnpm/dotenv-expand@11.0.6/node_modules/dotenv-expand/lib/main.js
var require_main2 = __commonJS({
  "node_modules/.pnpm/dotenv-expand@11.0.6/node_modules/dotenv-expand/lib/main.js"(exports2, module2) {
    "use strict";
    var DOTENV_SUBSTITUTION_REGEX = /(\\)?(\$)(?!\()(\{?)([\w.]+)(?::?-((?:\$\{(?:\$\{(?:\$\{[^}]*\}|[^}])*}|[^}])*}|[^}])+))?(\}?)/gi;
    function _resolveEscapeSequences(value) {
      return value.replace(/\\\$/g, "$");
    }
    function interpolate(value, processEnv, parsed) {
      return value.replace(DOTENV_SUBSTITUTION_REGEX, (match, escaped, dollarSign, openBrace, key, defaultValue, closeBrace) => {
        if (escaped === "\\") {
          return match.slice(1);
        } else {
          if (processEnv[key]) {
            if (processEnv[key] === parsed[key]) {
              return processEnv[key];
            } else {
              return interpolate(processEnv[key], processEnv, parsed);
            }
          }
          if (parsed[key]) {
            if (parsed[key] === value) {
              return parsed[key];
            } else {
              return interpolate(parsed[key], processEnv, parsed);
            }
          }
          if (defaultValue) {
            if (defaultValue.startsWith("$")) {
              return interpolate(defaultValue, processEnv, parsed);
            } else {
              return defaultValue;
            }
          }
          return "";
        }
      });
    }
    function expand2(options) {
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      for (const key in options.parsed) {
        let value = options.parsed[key];
        const inProcessEnv = Object.prototype.hasOwnProperty.call(processEnv, key);
        if (inProcessEnv) {
          if (processEnv[key] === options.parsed[key]) {
            value = interpolate(value, processEnv, options.parsed);
          } else {
            value = processEnv[key];
          }
        } else {
          value = interpolate(value, processEnv, options.parsed);
        }
        options.parsed[key] = _resolveEscapeSequences(value);
      }
      for (const processKey in options.parsed) {
        processEnv[processKey] = options.parsed[processKey];
      }
      return options;
    }
    module2.exports.expand = expand2;
  }
});

// libs/prisma-generator-nestjs/src/generator.ts
var import_generator_helper = require("@prisma/generator-helper");

// libs/prisma-generator-nestjs/package.json
var version = "1.0.0";

// libs/prisma-generator-nestjs/src/constants.ts
var GENERATOR_NAME = "prisma-generator-nestjs";

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

// libs/prisma-generator-nestjs/src/nameGenerator.ts
var path2 = require("path");
var NameGenerator = class _NameGenerator {
  static _singleton;
  basePath = "gen";
  prefix = "";
  static get singleton() {
    if (!_NameGenerator._singleton) {
      _NameGenerator._singleton = new _NameGenerator();
    }
    return _NameGenerator._singleton;
  }
  constructor() {
  }
  getClassName = (model, fileType) => StringFns.capitalize(this.prefix) + model.name + StringFns.capitalize(fileType);
  getFileName = (model, fileType) => this.prefix !== "" ? StringFns.snakeCase(this.prefix) + "_" + StringFns.snakeCase(model.name) + "." + fileType : StringFns.snakeCase(model.name) + "." + fileType;
  // StringFns.decapitalizeFileName(model.name, fileType);
  geFilePath = (model, fileType) => path2.join(this.basePath, this.getModelPath(model), this.getFileName(model, fileType) + ".ts");
  getModelPath = (model) => StringFns.decapitalize(model.name);
};

// libs/prisma-generator-nestjs/src/stubs/controller.stub.ts
var controllerStub = `
#{AutoGeneratedWarningText}

import { Controller, Post,  Param, UseGuards, Req } from '@nestjs/common';
import { #{ServiceName} } from './#{CrudServiceFileName}';
#{ImportGuardClass}

@Controller('#{moDel}')
export class #{ControllerClassName} {
  constructor(protected readonly service: #{ServiceName}) {}

#{getAll}

#{getByFieldValues}
  
}`;
var controllerGetAllStub = `
#{GuardDecorator}
@Post()
getAll(@Req() req?) {
  return this.service.getAll(req?.body?.modelFilter);
}
`;
var controllerGetByFieldValuesStub = `
#{GuardDecorator}
    @Post('by#{FieldNameCapitalized}/:#{fieldName}')
    getBy#{FieldNameCapitalized}(@Req() req, @Param('#{fieldName}') #{fieldName}: string) {
        return this.service.getByFieldValues({#{fieldName}: #{convertToInt}#{fieldName}}, req?.body?.modelFilter);
    }
`;
var controllerGetManyByFieldValuesStub = `
#{GuardDecorator}
    @Post('by#{FieldNameCapitalized}/:#{fieldName}')
    getBy#{FieldNameCapitalized}(@Req() req, @Param('#{fieldName}') #{fieldName}: string) {
        return this.service.getManyByFieldValues({#{fieldName}: #{convertToInt}#{fieldName}}, req?.body?.modelFilter);
    }
`;
var controllerReferenceFieldStub = `
#{GuardDecorator}
  @Post('#{RelationFieldName}')
  get#{RelationFieldNameCapitalized}(@Body() body: Prisma.#{Model}WhereUniqueInput) {
    return this.service.get#{RelationFieldNameCapitalized}(body);
  }
`;
var controllerMethodStubs = {
  getAll: controllerGetAllStub
  // getByFieldValues: controllerGetByFieldValuesStub,
  // getManyByFieldValues: controllerGetManyByFieldValuesStub,
  // create: controllerCreateStub,
  // getFilteredPage: controllergetFilteredPageStub,
  // getUnique: controllerGetUniqueStub,
  // update: controllerUpdateStub,
  // getById: controllerGetByIdStub,
  // updateById: controllerUpdateByIdStub,
  // deleteById: controllerDeleteByIdStub,
  // referenceField: controllerReferenceFieldStub
};
var controllerMethodNames = Object.keys(controllerMethodStubs);

// libs/prisma-generator-nestjs/src/generators/controller.generator.ts
var ControllerGenerator = class {
  constructor(settings, model) {
    this.settings = settings;
    this.model = model;
    this.prismaHelper = PrismaHelper.getInstance();
  }
  prismaHelper;
  methodStubs = controllerMethodStubs;
  async generateContent() {
    let nameGen = NameGenerator.singleton;
    let content = controllerStub;
    content = content.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);
    const idFieldAndType = PrismaHelper.getInstance().getIdFieldNameAndType(this.model);
    const commentDirectives = this.prismaHelper.parseDocumentation(this.model);
    const methodsToApply = this.getMethodsToApply(commentDirectives);
    content = this.applyMethods(content, methodsToApply, idFieldAndType);
    content = content.replace(/#{ControllerClassName}/g, nameGen.getClassName(this.model, "controller"));
    content = content.replace(/#{Model}/g, this.model.name);
    content = content.replace(/#{model}/g, this.model.name.toLowerCase());
    content = content.replace(/#{moDel}/g, StringFns.decapitalize(this.model.name));
    content = content.replace(/#{ServiceName}/g, nameGen.getClassName(this.model, "service"));
    content = content.replace(/#{CrudServiceFileName}/g, nameGen.getFileName(this.model, "service"));
    content = content.replace(/#{getByFieldValues}/g, this.createFieldRoutes());
    let guardImportContent, guardsContent;
    if (this.settings?.GuardClass) {
      guardImportContent = `import {${this.settings.GuardClass}} from '${this.settings.GuardImportPath}';`;
      guardsContent = `@UseGuards(${this.settings.GuardClass})`;
    } else {
      guardImportContent = "";
      guardsContent = "";
    }
    content = content.replace(/#{ImportGuardClass}/g, guardImportContent);
    content = content.replace(/#{GuardDecorator}/g, guardsContent);
    return content;
  }
  createFieldRoutes() {
    let code = "";
    this.model.fields.forEach((field) => {
      if (field.kind != "object") {
        let content = field.isUnique || field.isId ? controllerGetByFieldValuesStub : controllerGetManyByFieldValuesStub;
        content = content.replace(/#{GuardDecorator}/g, this.settings?.GuardClass ? `@UseGuards(${this.settings.GuardClass})` : "");
        const tsType = this.prismaHelper.convertToTypescriptType(field);
        content = content.replace(/#{Model}/g, this.model.name);
        content = content.replace(/#{convertToInt}/g, tsType === "number" ? "+" : "");
        content = content.replace(/#{FieldType}/g, tsType);
        content = content.replace(/#{fieldName}/g, field.name);
        content = content.replace(/#{FieldNameCapitalized}/g, StringFns.capitalize(field.name));
        code += content + "\n\n";
      }
    });
    return code;
  }
  addReferenceFieldMethods() {
    let code = "";
    const referenceFields = this.prismaHelper.getReferenceFields(this.model);
    referenceFields.forEach((field) => {
      let stub = controllerReferenceFieldStub;
      stub = stub.replace(/#{RelationMethodReturnType}/g, field.isList ? `${field.type}[]` : field.type);
      stub = stub.replace(/#{RelationFieldType}/g, field.type);
      stub = stub.replace(/#{RelationFieldName}/g, field.name);
      stub = stub.replace(/#{RelationFieldNameCapitalized}/g, StringFns.capitalize(field.name));
      code += stub;
    });
    return code;
  }
  applyMethods(content, methodNames, idFieldAndType) {
    methodNames.forEach((methodName) => {
      let methodStub = this.methodStubs[methodName];
      if (methodName.includes("ById")) {
        if (idFieldAndType) {
          methodStub = methodStub.replace(/#{convertToInt}/g, idFieldAndType.type === "number" ? "+" : "");
        } else {
          methodStub = "";
        }
      }
      if (methodName === "referenceField") {
        methodStub = this.addReferenceFieldMethods();
      }
      content = content.replace(new RegExp(`#{${methodName}}`, "g"), methodStub);
    });
    const allMethodNames = [...controllerMethodNames];
    allMethodNames.forEach((method) => content = content.replace(new RegExp(`#{${method}}`, "g"), ""));
    return content;
  }
  getMethodsToApply(commentDirectives) {
    const methodNames = [...controllerMethodNames];
    const appliedMethodNames = [...methodNames];
    commentDirectives.forEach((directive) => {
      if (directive.name === "@abcx3_disableControllers") {
        const disabledMethods = directive.argument?.split(",");
        disabledMethods?.forEach((methodName) => {
          const idx = appliedMethodNames.indexOf(methodName);
          if (idx > -1) {
            appliedMethodNames.splice(idx, 1);
          }
        });
      } else if (false) {
      } else {
      }
    });
    return appliedMethodNames;
  }
};

// libs/prisma-generator-nestjs/src/stubs/service.stub.ts
var ServiceStub = `
#{AutoGeneratedWarningText}

import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, #{Model} #{RelatedFieldTypesImport} } from '@prisma/client';
import {
    PrismaService,
} from '#{PrismaServiceImportPath}';
#{NeverthrowImport}

@Injectable()
export class #{ServiceClassName} {
    constructor(protected readonly prismaService: PrismaService) {}

    async getAll(modelFilter?: Prisma.#{Model}WhereInput): Promise<#{Model}[] | Error> {
        try {
            const result = await this.prismaService.#{moDel}.findMany({where: modelFilter});
            return result;
        } catch (e) {
            return new InternalServerErrorException(
                \`Could not get all #{Model}.\`
            );
        }
    }

    async getByFieldValues(fieldsAndValues: Record<string, number | string>, modelFilter?: Prisma.#{Model}WhereInput): Promise<#{Model} | Error> {
        const combinedFilter = this.combineFilters(fieldsAndValues, modelFilter);
        try {
            const result = await this.prismaService.#{moDel}.findFirst({
                where: combinedFilter
            });
            return result;
        } catch (error) {
            console.log(this.printObject(error));
            console.log('message: ', error?.message);
            return new InternalServerErrorException(
                \`Could not get one #{Model} by \${this.printObject(fieldsAndValues)}\`
            );
        }
    }

    async getManyByFieldValues(fieldsAndValues: Record<string, number | string>, modelFilter?: Prisma.#{Model}WhereInput): Promise<#{Model}[] | Error> {
        const combinedFilter = this.combineFilters(fieldsAndValues, modelFilter);
        try {
            const result = await this.prismaService.#{moDel}.findMany({
                where: combinedFilter
            });
            return result;
        } catch (error) {
            console.log(this.printObject(error));
            console.log('message: ', error?.message);
            return new InternalServerErrorException(
                \`Could not get any #{Model} by \${this.printObject(fieldsAndValues)}\`
            );
        }
    }

    combineFilters(
		fieldsAndValues: Record<string, number | string>,
		modelFilter: Prisma.#{Model}WhereInput,
	): Prisma.#{Model}WhereInput {
		let combinedFilter: Prisma.#{Model}WhereInput;
		if (modelFilter) {
			combinedFilter = {
				AND: [...(modelFilter?.AND as Prisma.#{Model}WhereInput[]), fieldsAndValues]
			};
			if (modelFilter?.OR) {
				combinedFilter.OR = modelFilter?.OR;
			}
			if (modelFilter?.NOT) {
				combinedFilter.NOT = modelFilter?.NOT;
			}
		} else {
			combinedFilter = fieldsAndValues;
		}
		return combinedFilter;
	}

    // get by id methods

    #{byIdMethods}

    // relation fields methods

    #{relationFieldMethods}

    printObject = (obj: any) => JSON.stringify(obj, null, 2);

}
`;
var NeverthrowImport = `import { err, ok, Result } from 'neverthrow';`;
var crudRelationFieldStub = `
async get#{RelationFieldNameCapitalized}(where: Prisma.#{Model}WhereUniqueInput): Promise<#{RelationMethodReturnType} | Error> {
    try {
        const result = await this.prismaService.#{moDel}.findUnique({
            where,
            include: { #{RelationFieldName} : true },
        });
        return result.#{RelationFieldName};
    } catch (e) {
        return new InternalServerErrorException(\`Could not get #{RelationFieldName} for #{Model}\`);
    }
}
`;
var idMethods_neverThrow = `
async getById(#{idName}: #{idType}): Promise<#{Model} | Error> {
    try {
    const result = await this.prismaService.#{moDel}.findUniqueOrThrow({
        where: { #{idName} }
    });
    return result;
    } catch(e) {
    return new NotFoundException(\`#{Model} Resource \${id} was not found\`);
    }
}

async updateById(#{idName}: #{idType}, data: Prisma.#{Model}UpdateInput): Promise<#{Model} | Error> {
    try {
        const result = await this.prismaService.#{moDel}.update({
            where: { #{idName} },
            data: data,
        });
        return result;
    } catch (e) {
        return new InternalServerErrorException(\`Could not update #{Model} Resource \${#{idName}}\`);
    }
}

async deleteById(#{idName}: #{idType}): Promise<#{Model} | Error> {
    try {
        const result = await this.prismaService.#{moDel}.delete({ where: { #{idName} } });
        return result;
    } catch (e) {
        return new InternalServerErrorException(\`Could not delete #{Model} Resource \${#{idName}}\`);
    }
}
`;

// libs/prisma-generator-nestjs/src/generators/service.generator.ts
var path3 = __toESM(require("path"));
var import_fs = require("fs");
var ServiceGenerator = class {
  constructor(settings, model) {
    this.settings = settings;
    this.model = model;
    this.prismaHelper = PrismaHelper.getInstance();
  }
  prismaHelper;
  async generateContent() {
    let nameGen = NameGenerator.singleton;
    let code = ServiceStub;
    code = code.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);
    code = code.replace(/#{ServiceClassName}/g, nameGen.getClassName(this.model, "service"));
    if (this.settings.CRUDStubFile) {
      const stubFullPath = path3.join(this.settings.schemaPath, this.settings.CRUDStubFile);
      const customStub = await import_fs.promises.readFile(stubFullPath, { encoding: "utf-8" });
      code = customStub.toString();
    }
    code = code.replace(/#{PrismaServiceImportPath}/g, this.settings.PrismaServiceImportPath);
    code = code.replace(/#{byIdMethods}/g, this.addIdFieldMethods());
    code = code.replace(/#{relationFieldMethods}/g, this.addReferenceFieldMethods());
    code = code.replace(/#{RelatedFieldTypesImport}/g, this.addReferenceFieldImports());
    if (this.settings.WrapWithNeverthrow) {
      code = code.replace(/#{NeverthrowImport}/g, NeverthrowImport);
      code = this.addNeverthrow(code);
    } else {
      code = code.replace(/#{NeverthrowImport}/g, "");
    }
    code = code.replace(/#{Model}/g, this.model.name);
    code = code.replace(/#{MODEL}/g, this.model.name.toUpperCase());
    code = code.replace(/#{model}/g, this.model.name.toLowerCase());
    code = code.replace(/#{moDel}/g, StringFns.decapitalize(this.model.name));
    return code;
  }
  addNeverthrow(code) {
    code = code.replace(
      /Promise<.*>/g,
      (str) => `Promise<Result<${str.substring(8, str.length - 8)}, Error>>`
    );
    code = code.replace(
      /return result.*(?=;)/g,
      (str) => `return ok(${str.substring(7)});`
    );
    code = code.replace(
      /new .*Exception\(.*(?=\))/g,
      (str) => `err(new ${str.substring(4)})`
    );
    return code;
  }
  addReferenceFieldMethods() {
    let code = "";
    const referenceFields = this.prismaHelper.getReferenceFields(this.model);
    referenceFields.forEach((field) => {
      let stub = crudRelationFieldStub;
      stub = stub.replace(/#{RelationMethodReturnType}/g, field.isList ? `${field.type}[]` : field.type);
      stub = stub.replace(/#{RelationFieldType}/g, field.type);
      stub = stub.replace(/#{RelationFieldName}/g, field.name);
      stub = stub.replace(/#{RelationFieldNameCapitalized}/g, StringFns.capitalize(field.name));
      code += stub;
    });
    return code;
  }
  addReferenceFieldImports() {
    let content = "";
    const referenceFields = this.prismaHelper.getUniqueReferenceFields(this.model);
    referenceFields.forEach((fieldNameAndType) => content += `, ${fieldNameAndType.type}`);
    return content;
  }
  addIdFieldMethods() {
    let content = "";
    const idField = this.prismaHelper.getIdFieldNameAndType(this.model);
    if (idField) {
      content = idMethods_neverThrow;
      content = this.replaceIdMethodTags(content, idField);
    }
    return content;
  }
  replaceIdMethodTags(content, field) {
    content = content.replace(/#{idName}/g, field.name);
    content = content.replace(/#{idType}/g, field.type);
    content = content.replace(/#{uniqueInputType}/g, `Prisma.${this.model.name}WhereUniqueInput`);
    return content;
  }
};

// libs/prisma-generator-nestjs/src/generators/enum.generator.ts
var generateEnum = ({ name, values }, settings) => {
  const enumValues = values.map(({ name: name2 }) => `${name2}="${name2}"`).join(",\n");
  return `
${settings.AutoGeneratedWarningText}

enum ${name} { 
${enumValues}
 }`;
};

// libs/prisma-generator-nestjs/src/stubs/module.stub.ts
var moduleStub = `
#{AutoGeneratedWarningText}

import { Module } from '@nestjs/common';
import { #{ServiceName} } from './#{ServiceFileName}';
import { #{PrismaModuleName} } from '#{PrismaModuleImportPath}';
#{ImportControllerClass}
@Module({
  controllers: [#{ControllerName}],
  providers: [#{ServiceName}],
  imports: [#{PrismaModuleName}],
  exports: [#{ServiceName}]
})
export class #{ModuleName} {}`;
var importControllerStub = `import { #{ControllerName} } from './#{ControllerFileName}';`;

// libs/prisma-generator-nestjs/src/generators/module.generator.ts
var ModuleGenerator = class {
  constructor(model, settings) {
    this.model = model;
    this.settings = settings;
  }
  generateContent() {
    let nameGen = NameGenerator.singleton;
    let content = moduleStub;
    content = content.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);
    content = content.replace(/#{PrismaModuleName}/g, this.settings.PrismaModuleName);
    content = content.replace(/#{PrismaModuleImportPath}/g, this.settings.PrismaModuleImportPath);
    if (this.settings.GenerateControllers) {
      content = content.replace(/#{ImportControllerClass}/g, importControllerStub);
      content = content.replace(/#{ControllerName}/g, nameGen.getClassName(this.model, "controller"));
      content = content.replace(/#{ControllerFileName}/g, nameGen.getFileName(this.model, "controller"));
    } else {
      content = content.replace(/#{ImportControllerClass}/g, "");
      content = content.replace(/#{ControllerName}/g, "");
    }
    content = content.replace(/#{ServiceName}/g, nameGen.getClassName(this.model, "service"));
    content = content.replace(/#{ServiceFileName}/g, nameGen.getFileName(this.model, "service"));
    content = content.replace(/#{ModuleName}/g, nameGen.getClassName(this.model, "module"));
    return content;
  }
};

// libs/prisma-generator-nestjs/src/generator.ts
var import_prettier = require("prettier");
var defaultOptions = {
  strict: false,
  dryRun: false,
  AutoGeneratedWarningText: "/*****    AUTO-GENERATED FILE - DO NOT MODIFY   *****/",
  prefix: "gen",
  schemaPath: "",
  GenerateServices: true,
  GenerateControllers: false,
  GenerateModule: true,
  // InputExportPath: 'data/inputs',
  // InputSuffix: 'Input',
  // InputValidatorPackage: 'class-validator',
  // InputCreatePrefix: 'Create',
  // InputUpdatePrefix: 'Update',
  WrapWithNeverthrow: true,
  PrismaServiceImportPath: "prisma/prisma.service",
  PrismaModuleName: "PrismaModule",
  PrismaModuleImportPath: "src/prisma/prisma.module",
  EnumPath: "enums"
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
    const optionsWithEnvSettings = convertEnvStrings(options.generator.config);
    const optionsWithBooleanSettings = convertBooleanStrings(optionsWithEnvSettings);
    const settings = {
      ...defaultOptions,
      ...optionsWithBooleanSettings,
      ...configOverwrites
    };
    const mainGenerator = new MainGenerator(options, settings);
    await mainGenerator.generateFiles();
  }
});
var MainGenerator = class {
  constructor(options, settings) {
    this.options = options;
    this.settings = settings;
    this.writeFile = settings?.dryRun ? async (path4, content) => await outputToConsoleAsync(path4, await this.formatContent(path4, content)) : async (path4, content) => await writeFileSafelyAsync(path4, await this.formatContent(path4, content));
    this.nameGenerator = NameGenerator.singleton;
    this.nameGenerator.prefix = settings.prefix ?? "";
    this.nameGenerator.basePath = options.generator.output?.value || "gen";
  }
  writeFile;
  nameGenerator;
  formatContent(filePath, content) {
    if (filePath.match(/.ts$/)) {
      return (0, import_prettier.format)(content, { useTabs: true, tabWidth: 4, parser: "typescript" });
    } else {
      return Promise.resolve(content);
    }
  }
  async generateFiles() {
    await copyCommonSourceFiles("ts_source", this.nameGenerator.basePath);
    await this.generateFilesForAllModels();
    if (this.settings?.secondaryOutputPath) {
      this.nameGenerator.prefix = "";
      this.nameGenerator.basePath = this.settings.secondaryOutputPath;
      this.settings.AutoGeneratedWarningText = "";
      await this.generateFilesForAllModels();
    }
  }
  async generateFilesForAllModels() {
    for (const model of this.options.dmmf.datamodel.models) {
      if (this.settings?.GenerateServices)
        await this.generateServiceFile(model);
      if (this.settings.GenerateControllers)
        await this.generateControllerFile(model);
      if (this.settings.GenerateModule)
        await this.generateModuleFile(model);
    }
  }
  async generateEnumFile(tEnum) {
    let content = generateEnum(tEnum, this.settings);
    let filePath = this.nameGenerator.geFilePath(tEnum, "enum");
    await this.writeFile(filePath, content);
  }
  /* async generateInputFile(model: DMMF.Model) {
      const inputGenerator = new InputGenerator(this.settings, model);
      const inputContent = await inputGenerator.generateContent();
      const filePath = this.nameGenerator.geFilePath(model, 'controller')
      await this.writeFile(filePath, inputContent);
  } */
  async generateServiceFile(model) {
    console.log(` > Generating Service for Model ${model.name}`);
    const serviceGenerator = new ServiceGenerator(this.settings, model);
    const crudServiceContent = await serviceGenerator.generateContent();
    const filePath = this.nameGenerator.geFilePath(model, "service");
    await this.writeFile(filePath, crudServiceContent);
  }
  async generateControllerFile(model) {
    const controllerGenerator = new ControllerGenerator(this.settings, model);
    const controllerContent = await controllerGenerator.generateContent();
    const filePath = this.nameGenerator.geFilePath(model, "controller");
    await this.writeFile(filePath, controllerContent);
  }
  async generateModuleFile(model) {
    const moduleGenerator = new ModuleGenerator(model, this.settings);
    const content = moduleGenerator.generateContent();
    const filePath = this.nameGenerator.geFilePath(model, "module");
    await this.writeFile(filePath, content);
  }
};
