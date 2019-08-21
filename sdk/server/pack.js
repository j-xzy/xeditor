"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = require("fs-extra");
const config = require("../config");
async function pack(param, on) {
    await fs.remove(param.dist);
    const cp = child_process_1.fork(config.pack);
    cp.on('message', (message) => {
        const { error } = message;
        if (error) {
            on.onError();
        }
        else {
            on.onSuccess();
        }
    });
    cp.send({ config: param });
}
exports.pack = pack;
