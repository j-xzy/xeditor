const path = require('path');
const root = path.join(__dirname, '..');

module.exports = {
  root,
  src: path.join(root, 'src'),
  dest: path.join(root, 'lib'),
  tsConfig: path.join(root, 'tsconfig.json'),
  tslint: path.join(root, 'tslint.json'),
  stylus: `${root}/src/**/*.styl` 
}