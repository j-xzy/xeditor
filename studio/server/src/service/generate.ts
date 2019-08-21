import { generate as generateProject } from '@xeditor/generator';
import { mapSrcPath } from '@xeditor/generator/lib/util';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as config from '../config';

export async function generate(data: any, downloadAssets: boolean) {
  const srcMap: { [p: string]: string } = {};

  mapSrcPath(data, (p: string) => {
    const split = p.split('/');
    const version = split.pop()!;
    const name = split.pop()!;
    const username = split.pop()!;
    const srcPath = path.join(config.repository, username, 'components', name, version);
    srcMap[`${username.replace('@hiynn.com', '')}-${name}-${version}`] = srcPath;
    return srcPath;
  });

  const dest = path.join(config.project, data.name);

  await fs.remove(dest);

  const result = await generateProject({
    body: data,
    srcMap,
    dest,
    compatible: config.compatible,
    downloadAssets
  });
  return { ...result, dest };
}
