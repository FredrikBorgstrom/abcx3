"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileSafely = void 0;
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
const formatFile_1 = require("./formatFile");
const writeFileSafely = (config, filePath, content) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const formattedContent = yield (0, formatFile_1.formatFile)(content);
    if (config.dryRun === 'true') {
        console.log(formattedContent);
    }
    else {
        fs.mkdirSync(path.dirname(filePath), {
            recursive: true,
        });
        fs.writeFileSync(filePath, formattedContent);
    }
});
exports.writeFileSafely = writeFileSafely;
//# sourceMappingURL=writeFileSafely.js.map