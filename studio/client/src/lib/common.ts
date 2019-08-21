/**
 * 业务复用,与具体业务逻辑耦合
 */
import { timer } from 'rxjs';
import { delayWhen, retryWhen, scan, tap } from 'rxjs/operators';
import { enBase64 } from './util';

export function powRetry(times = 3, base = 3000) {
  return retryWhen((err$) => err$.pipe(
    // tslint:disable-next-line: no-console
    tap((x) => console.error(x)),
    scan((errCount, err) => {
      if (errCount >= times) {
        throw err;
      }
      return errCount + 1;
    }, 0),
    delayWhen((errCount) => timer(Math.pow(2, errCount - 1) * base))
  ));
}

export function makeCanvasFormData(projectName: string, data: Editor.ICanvaState) {
  const blob = new Blob([enBase64(JSON.stringify({ name: projectName, data }))]);

  const formData = new FormData();
  formData.append('name', projectName);
  formData.append('file', blob, 'file.canvas');

  return formData;
}
