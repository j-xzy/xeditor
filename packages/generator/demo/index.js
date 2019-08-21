const path = require('path');
const fs = require('fs-extra');
const { generate } = require('../lib');
const { mapSrcPath } = require('../lib/util');

const body = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas.json')));
const srcs = JSON.parse(fs.readFileSync(path.join(__dirname, 'compMap.json')));

// mapSrcPath(body, (p) => p);
generate({
  body,
  srcMap: srcs,
  dest: path.join(__dirname, 'dest'),
  downloadAssets: true,
  compatible: false
});
