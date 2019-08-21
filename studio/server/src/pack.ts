import { fork } from 'child_process';
import * as fs from 'fs-extra';
import * as config from './config';

interface IConfig {
  mode: 'production' | 'development';
  entry: string;
  dist: string;
  publicPath: string;
  compatible: boolean;
}

export async function pack(param: IConfig, on: { onSuccess: () => void, onError: () => void }) {
  await fs.remove(param.dist);
  const cp = fork(config.pack);
  cp.on('message', (message) => {
    const { error } = message;
    if (error) {
      on.onError();
    } else {
      on.onSuccess();
    }
  });
  cp.send({ config: param });
}
