import * as archiver from 'archiver';
import * as fs from 'fs-extra';

interface IParams {
  path: string;
  onError: (err: archiver.ArchiverError) => void;
  onFinish: () => void;
}

export async function archiveProject(params: IParams) {
  const output = fs.createWriteStream(params.path + '.zip');
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });
  archive.on('error', params.onError);

  output.on('finish', params.onFinish);

  archive.pipe(output);
  archive.directory(params.path, false);
  archive.finalize();
}
