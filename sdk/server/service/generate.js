"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("@xeditor/generator");
const util_1 = require("@xeditor/generator/lib/util");
const fs = require("fs-extra");
const path = require("path");
const config = require("../../config");
async function generate(data, downloadAssets) {
    const srcMap = {};
    util_1.mapSrcPath(data, (p) => {
        const split = p.split('/');
        const version = split.pop();
        const name = split.pop();
        const username = split.pop();
        const srcPath = path.join(config.repository, username, 'components', name, version);
        srcMap[`${username.replace('@hiynn.com', '')}-${name}-${version}`] = srcPath;
        return srcPath;
    });
    const dest = path.join(config.project, data.name);
    await fs.remove(dest);
    const result = await generator_1.generate({
        body: data,
        srcMap,
        dest,
        compatible: config.compatible,
        downloadAssets
    });
    return { ...result, dest };
}
exports.generate = generate;
