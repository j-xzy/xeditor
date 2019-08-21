"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const mime = require("mime");
const path = require("path");
const config = require("../../config");
async function oneUserCompList({ src, dist, mapPath }) {
    try {
        const comps = [];
        const names = await fs.readdir(src);
        for (let i = 0; i < names.length; i++) {
            const pth = path.join(dist, names[i]);
            if (await fs.pathExists(pth)) {
                const versions = await fs.readdir(path.join(dist, names[i]));
                const name = (await fs.readJSON(path.join(src, names[i], 'config.json'))).name;
                for (let n = 0; n < versions.length; n++) {
                    const ver = path.join(src, names[i], versions[n]);
                    let dirs = [];
                    try {
                        dirs = await fs.readdir(ver);
                    }
                    catch (e) {
                        continue;
                    }
                    const privewName = dirs.find((fileName) => /preview\.(png|jpe?g|gif|svg)(\?.*)?$/.test(fileName));
                    let img = '';
                    if (privewName) {
                        const mineType = mime.getType(path.extname(privewName)) || '';
                        const imgFileSrc = (await fs.readFile(path.join(ver, privewName))).toString('base64');
                        img = `data:${mineType};base64,${imgFileSrc}`;
                    }
                    comps.push({
                        name: `${name}-${versions[n]}`,
                        path: mapPath(names[i], versions[n]),
                        img
                    });
                }
            }
        }
        return comps;
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
exports.oneUserCompList = oneUserCompList;
async function allUserCompList(mapPath) {
    const { repository } = config;
    const dirs = await fs.readdir(repository);
    const compPaths = dirs
        .filter((dir) => /@hiynn.com$/.test(dir))
        .map((dir) => ({ username: dir, dir: path.resolve(repository, dir) }));
    const allComps = [];
    for (let i = 0; i < compPaths.length; i++) {
        const { username, dir } = compPaths[i];
        const userComps = await oneUserCompList({
            src: path.resolve(dir, 'components'),
            dist: path.resolve(dir, 'dist'),
            mapPath: (name, version) => mapPath(username, name, version)
        });
        if (!userComps) {
            allComps.push({ type: `${username}读取失败!`, comps: [] });
            continue;
        }
        if (username === config.email) {
            allComps.unshift({ type: username, comps: userComps });
        }
        else {
            allComps.push({ type: username, comps: userComps });
        }
    }
    return allComps;
}
exports.allUserCompList = allUserCompList;
