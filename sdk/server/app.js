"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs-extra");
const multiparty = require("multiparty");
const path = require("path");
const config = require("../config");
const studio_1 = require("./routes/studio");
const app = express();
app.use(async (_req, res, next) => {
    try {
        await next();
    }
    catch (e) {
        console.error(e);
        res.statusCode = 500;
        res.end();
    }
});
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'x-csrf-token,Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});
app.use('/public', express.static(config.public));
app.use('/vendor', express.static(config.repository));
app.get('/', (_req, res) => {
    fs.exists(path.join(config.app, 'index.html'), (exist) => {
        if (exist) {
            fs.createReadStream(path.join(config.app, 'index.html')).pipe(res);
        }
        else {
            res.end('404');
        }
    });
});
app.post('/upload', async (req, res) => {
    let form;
    let baseUrl = '';
    if (req.query.id && /^@/.test(req.query.id)) {
        const output = path.resolve(config.repository, 'projects', req.query.id, 'images');
        await fs.ensureDir(output);
        form = new multiparty.Form({
            uploadDir: output
        });
        baseUrl = `/vendor/projects/${req.query.id}/images`;
    }
    else {
        form = new multiparty.Form({
            uploadDir: path.resolve(config.public, 'images')
        });
        baseUrl = '/public/images';
    }
    form.parse(req, async (err, _fields, files) => {
        if (err) {
            console.error(err.message);
            return res.json({
                code: 0,
                msg: '保存失败'
            });
        }
        res.json({
            code: 1,
            msg: 'success',
            result: {
                urls: [`http://${req.hostname}:${config.port}${baseUrl}/${path.basename(files.image[0].path)}`]
            }
        });
    });
});
app.use('/studio', studio_1.studioRouter);
app.listen(config.port, () => {
    fs.exists(path.join(config.app, 'index.html'), (exist) => {
        if (exist) {
            require('opn')(`http://localhost:${config.port}`);
        }
    });
    console.log(`http://localhost:${config.port}`);
});
