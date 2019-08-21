const tsGulp = require('gulp-typescript');
const stylus = require('gulp-stylus');
const config = require('./config');
const ts = require('typescript');
const merge = require('merge2');
const path = require('path');
const gulp = require('gulp');
const del = require('del');

const tsProject = tsGulp.createProject(config.tsConfig, {
  getCustomTransformers: () => ({
    before: [
      (context) => {
        return (sourceFile) => {
          ts.forEachChild(sourceFile, (cNode) => {
            if (ts.isImportDeclaration(cNode)) {
              const pathInfo = path.parse(cNode.moduleSpecifier.text)
              if (pathInfo.ext === '.styl') {
                const token = ts.createToken(10);
                token.text = './' + path.join(pathInfo.dir, `${pathInfo.name}.css`);
                cNode.moduleSpecifier = token;
              }
            }
          });
          return sourceFile;
        }
      }
    ]
  })
});

gulp.task('clean', function () {
  return del(config.dest, {
    force: true
  });
});

gulp.task('stylus', function () {
  return gulp
    .src(config.stylus)
    .pipe(stylus())
    .pipe(gulp.dest(config.dest))
});

gulp.task('compile', function () {
  const tsResult = tsProject
    .src()
    .pipe(tsProject());
  return merge([
    tsResult.js.pipe(gulp.dest(config.dest)),
    tsResult.dts.pipe(gulp.dest(config.dest))
  ])
});

gulp.task('default', gulp.series('clean', 'stylus', 'compile'));