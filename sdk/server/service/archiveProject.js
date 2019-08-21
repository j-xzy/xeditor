"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const archiver = require("archiver");
const fs = require("fs-extra");
async function archiveProject(params) {
    const output = fs.createWriteStream(params.path + '.zip');
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });
    archive.on('error', params.onError);
    output.on('finish', params.onFinish);
    archive.pipe(output);
    archive.directory(params.path, false);
    archive.finalize();
}
exports.archiveProject = archiveProject;
