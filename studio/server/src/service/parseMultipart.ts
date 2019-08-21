import { Request } from 'express';
import * as multiparty from 'multiparty';

interface IResult {
  field: { [p: string]: any };
  files: Array<{ name: string, data: Buffer }>;
}

export async function parseMultipart(req: Request): Promise<IResult> {
  return new Promise((resolve, reject) => {
    try {
      const field: IResult['field'] = {};
      const partPromises: Array<Promise<any>> = [];
      const form = new multiparty.Form();

      form.on('part', (part) => {
        partPromises.push(new Promise((cresolve, creject) => {
          try {
            const data: Buffer[] = [];
            part.on('data', (chunk) => {
              data.push(chunk);
            });
            part.on('end', () => {
              cresolve({
                name: part.filename,
                data: Buffer.concat(data)
              });
            });
          } catch (e) {
            // tslint:disable-next-line: no-console
            console.error(e);
            creject(e);
          }
        }));
      });

      form.on('error', (e) => {
        // tslint:disable-next-line: no-console
        console.error(e);
        reject(e);
      });

      form.on('field', (name, value) => {
        field[name] = value;
      });

      form.on('close', async () => {
        Promise.all(partPromises).then((bufs) => {
          resolve({ files: bufs, field });
        }).catch((e) => {
          // tslint:disable-next-line: no-console
          console.error(e);
          reject(e);
        });
      });

      form.parse(req);
    } catch (e) {
      reject(e);
    }
  });
}
