import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as fs from 'fs-extra';
import * as multiparty from 'multiparty';
import * as path from 'path';
import * as config from './config';
import { studioRouter } from './routes/studio';

const app = express();

app.use(async (_req, res, next) => {
  try {
    await next();
  } catch (e) {
    // tslint:disable-next-line: no-console
    console.error(e);
    res.statusCode = 500;
    res.end();
  }
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  // 跨域
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'x-csrf-token,Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');

  // 禁用缓存
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
    } else {
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
  } else {
    form = new multiparty.Form({
      uploadDir: path.resolve(config.public, 'images')
    });
    baseUrl = '/public/images';
  }

  form.parse(req, async (err, _fields, files) => {
    if (err) {
      // tslint:disable-next-line: no-console
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

app.use('/studio', studioRouter);

app.listen(config.port, () => {
  fs.exists(path.join(config.app, 'index.html'), (exist) => {
    if (exist) {
      require('opn')(`http://localhost:${config.port}`);
    }
  });
  // tslint:disable-next-line: no-console
  console.log(`http://localhost:${config.port}`);
});
