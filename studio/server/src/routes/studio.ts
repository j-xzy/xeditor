import * as express from 'express';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as config from '../config';
import { pack } from '../pack';
import { archiveProject } from '../service/archiveProject';
import { allUserCompList } from '../service/compList';
import { generate } from '../service/generate';
import { parseMultipart } from '../service/parseMultipart';

const router = express.Router();

router.get('/component-list', async (req, res) => {
  const allComps = await allUserCompList(
    (username, name, version) => `http://${req.hostname}:${config.port}/studio/comp/${username}/${name}/${version}`
  );

  res.json({
    code: 1,
    msg: '成功',
    result: {
      list: allComps
    }
  });
});

router.get('/comp/:username/:name/:version', async (req, res) => {
  const { repository } = config;
  const code = await fs.readFile(path.join(repository, req.params.username, 'dist', req.params.name, req.params.version, 'index.js'));
  res.end(code);
});

router.post('/save', async (req, res) => {
  try {
    const { field, files } = await parseMultipart(req);
    const data = Buffer.from(files[0].data.toString(), 'base64').toString();
    if (/^@/.test(field.name)) {
      // 以@开头的项目保存到vendor中
      const dir = path.join(config.repository, 'projects', field.name);
      await fs.ensureDir(dir);
      await fs.writeFile(path.join(dir, 'data.json'), data);
    } else {
      await fs.writeFile(path.join(config.public, 'data', `${field.name}.json`), data);
    }
    res.json({
      code: 1,
      msg: '保存成功'
    });
  } catch (e) {
    res.json({
      code: 0,
      msg: '保存失败'
    });
  }
});

router.get('/open', async (req, res) => {
  try {
    let data = '';
    if (/^@/.test(req.query.id)) {
      // 以@开头的项目保存在vender中
      data = await fs.readFile(path.join(config.repository, 'projects', req.query.id, 'data.json'), { encoding: 'base64' });
    } else {
      data = await fs.readFile(path.join(config.public, 'data', `${req.query.id}.json`), { encoding: 'base64' });
    }

    res.json({
      code: 1,
      msg: '加载成功',
      result: {
        name: req.query.id,
        data
      }
    });
  } catch (ex) {
    res.json({
      code: 0,
      msg: '加载失败'
    });
  }
});

router.post('/download', async (req, res) => {
  try {
    const { files, field } = await parseMultipart(req);
    const data = JSON.parse((Buffer.from(files[0].data.toString(), 'base64').toString()));
    if (data.name[0] === '@') {
      data.name = data.name.slice(1);
    }
    const result = await generate(data, true);
    if (result.error) {
      res.json({
        code: 0,
        msg: '生成失败'
      });
      // tslint:disable-next-line: no-console
      console.log(result.msg);
    } else {
      if (config.mode === 'production') {
        await pack({
          entry: path.join(result.dest, 'src', 'index.js'),
          dist: path.join(config.dist, field.name),
          mode: 'production',
          compatible: config.compatible,
          publicPath: './'
        }, {
            onSuccess: () => {
              archiveProject({
                path: path.join(config.dist, field.name),
                onError: (err) => {
                  if (!res.finished) {
                    res.json({
                      code: 0,
                      msg: '下载失败'
                    });
                  }
                  // tslint:disable-next-line: no-console
                  console.log(err);
                },
                onFinish: () => {
                  if (!res.finished) {
                    res.json({
                      code: 1,
                      msg: '下载成功',
                      result: {
                        id: field.name
                      }
                    });
                  }
                }
              });
            },
            onError: () => {
              if (!res.finished) {
                return res.json({
                  code: 0,
                  msg: '下载失败'
                });
              }
            }
          });
      }
      if (config.mode === 'development') {
        archiveProject({
          path: path.join(config.project, field.name),
          onError: (err) => {
            if (!res.finished) {
              res.json({
                code: 0,
                msg: '下载失败'
              });
            }
            // tslint:disable-next-line: no-console
            console.log(err);
          },
          onFinish: () => {
            if (!res.finished) {
              res.json({
                code: 1,
                msg: '生成成功',
                result: {
                  id: field.name
                }
              });
            }
          }
        });
      }
    }
  } catch (e) {
    // tslint:disable-next-line: no-console
    console.log(e);
    res.json({
      code: 0,
      msg: '下载失败'
    });
  }
});

router.get('/download/:id', async (req, res) => {
  try {
    let zipOutput = '';
    if (config.mode === 'production') {
      zipOutput = path.join(config.dist, `${req.params.id}.zip`);
    }
    if (config.mode === 'development') {
      zipOutput = path.join(config.project, `${req.params.id}.zip`);
    }
    if (zipOutput === '') {
      // tslint:disable-next-line: no-console
      console.error('config.mode错误');
      return res.end('config.mode错误');
    }
    const zipStat = await fs.stat(zipOutput);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Disposition', 'attachment;filename="project.zip"');
    res.setHeader('Content-length', zipStat.size);
    fs.createReadStream(zipOutput).pipe(res);
    res.on('finish', async () => {
      await fs.remove(zipOutput);
    });

  } catch (e) {
    // tslint:disable-next-line: no-console
    console.error(e);
  }
});

router.post('/project-preview', async (req, res) => {
  const { files, field } = await parseMultipart(req);
  const data = JSON.parse(Buffer.from(files[0].data.toString(), 'base64').toString());
  const result = await generate(data, false);

  if (data.name[0] === '@') {
    data.name = data.name.slice(1);
  }

  if (result.error) {
    return res.json({
      code: 0,
      msg: '生成失败'
    });
  }
  let mode: 'production' | 'development' | '' = '';
  if (config.mode === 'production') {
    mode = 'production';
  }
  if (config.mode === 'development') {
    mode = 'development';
  }
  if (mode === '') {
    // tslint:disable-next-line: no-console
    console.error('config.mode错误');
    return res.end('config.mode错误');
  }
  await pack({
    entry: path.join(result.dest, 'src', 'index.js'),
    dist: path.join(config.dist, field.name),
    mode,
    compatible: config.compatible,
    publicPath: `/public/dist/${field.name}`
  }, {
      onSuccess: () => {
        if (!res.finished) {
          return res.json({
            code: 1,
            msg: '生成成功',
            result: {
              url: `http://${req.hostname}:${config.port}/public/dist/${field.name}`
            }
          });
        }
      },
      onError: () => {
        if (!res.finished) {
          return res.json({
            code: 0,
            msg: '生成失败'
          });
        }
      }
    });
});

export const studioRouter = router;
