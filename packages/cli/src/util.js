const fs = require('fs-extra');
const archiver = require('archiver');

function filterWebpackInfo(infos) {
  return infos.filter(({ entry }) => {
    let dirs = []
    try {
      dirs = fs.readdirSync(entry);
    } catch (e) {
      return false;
    }
    const idxname = dirs.find((name) => /\.(js|jsx)$/.test(name))
    return typeof idxname !== 'undefined';
  });
}

function archive(src, output) {
  const outputStream = fs.createWriteStream(output);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });
  return new Promise((resolve, reject) => {
    archive.on('error', (err) => {
      reject(err);
    });

    outputStream.on('finish', () => {
      resolve();
    });

    archive.pipe(outputStream);
    archive.directory(src, false);
    archive.finalize();
  });
}

module.exports = {
  filterWebpackInfo,
  archive
}