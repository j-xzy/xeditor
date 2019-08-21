"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multiparty = require("multiparty");
async function parseMultipart(req) {
    return new Promise((resolve, reject) => {
        try {
            const field = {};
            const partPromises = [];
            const form = new multiparty.Form();
            form.on('part', (part) => {
                partPromises.push(new Promise((cresolve, creject) => {
                    try {
                        const data = [];
                        part.on('data', (chunk) => {
                            data.push(chunk);
                        });
                        part.on('end', () => {
                            cresolve({
                                name: part.filename,
                                data: Buffer.concat(data)
                            });
                        });
                    }
                    catch (e) {
                        console.error(e);
                        creject(e);
                    }
                }));
            });
            form.on('error', (e) => {
                console.error(e);
                reject(e);
            });
            form.on('field', (name, value) => {
                field[name] = value;
            });
            form.on('close', async () => {
                Promise.all(partPromises).then((bufs) => {
                    resolve({ files: bufs, field });
                }).catch((e) => {
                    console.error(e);
                    reject(e);
                });
            });
            form.parse(req);
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.parseMultipart = parseMultipart;
