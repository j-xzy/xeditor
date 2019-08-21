import { makeCanvasFormData, powRetry } from '@/lib/common';
import { deBase64, download, enBase64, getUrlParam } from '@/lib/util';
import { message } from 'lite-ui';
import { empty, merge, timer } from 'rxjs';
import {
  catchError, filter, finalize,
  map, switchMap, switchMapTo,
  takeUntil, tap, throttleTime
} from 'rxjs/operators';
import { IRxCtx } from '../createStore';

export function getComponentList(ctx: IRxCtx<undefined>): any {
  return ctx.curAction$.pipe(
    tap(() => ctx.commit('progress', true)),
    switchMapTo(
      window.RxGet('/studio/component-list').pipe(
        tap((apiData) => {
          if (apiData.code === 1) {
            ctx.commit('componentList', apiData.result.list);
          } else {
            message.error(apiData.msg);
          }
        }),
        takeUntil(timer(60000).pipe(
          tap(() => message.error('组件列表获取超时!'))
        )),
        powRetry(),
        catchError(() => {
          message.error('组件列表获取失败!');
          return empty();
        }),
        finalize(() => ctx.commit('progress', false))
      )
    )
  );
}

export function openCanvas<T extends (data: Editor.ICanvaData) => void>(ctx: IRxCtx<T>, _: T) {
  const timeout = 180000;

  const loading$ = timer(1000).pipe(
    tap(() => ctx.commit('openCanvasLoadingId', message.loading('正在打开...', timeout))),
    takeUntil(ctx.createAction$('cancelOpenCanvas'))
  );

  return ctx.curAction$.pipe(
    filter(() => !!getUrlParam('id')),
    switchMap((set) =>
      merge(
        loading$,
        window.RxGet('/studio/open?id', {
          querys: { id: getUrlParam('id') }
        }).pipe(
          tap((apiData) => {
            if (apiData.code === 1) {
              set(JSON.parse(deBase64(apiData.result.data)).data);
              ctx.commit('projectName', apiData.result.name);
            } else {
              message.error(apiData.msg);
            }
          }),
          takeUntil(timer(timeout).pipe(
            tap(() => message.error('打开画布出错超时!'))
          )),
          powRetry(),
          catchError((e) => {
            // tslint:disable-next-line: no-console
            console.error(e);
            message.error('打开画布出错!');
            return empty();
          }),
          finalize(() => {
            ctx.dispatch('cancelOpenCanvas');
          })
        )
      )
    )
  );
}

export function cancelOpenCanvas(ctx: IRxCtx<any>) {
  return ctx.curAction$.pipe(
    tap(() => message.cancel(ctx.getState().openCanvasLoadingId))
  );
}

export function saveCanvas<T extends { canvas: Editor.ICanvaState; silent?: boolean }>(ctx: IRxCtx<T>, _: T) {
  const loading$ = (cond: () => boolean) => timer(200).pipe(
    filter(cond),
    tap(() => ctx.commit('saveCanvasLoadingId', message.loading('正在保存...', 60000))),
    takeUntil(ctx.createAction$('cancelSaveCanvas'))
  );

  return ctx.curAction$.pipe(
    throttleTime(2000),
    filter(() => {
      if (!ctx.getState().projectName) {
        message.warning('请输入项目名称');
        return false;
      }
      return true;
    }),
    tap(({ silent }) => {
      silent && ctx.commit('progress', true);
    }),
    map((data) => ({ formData: makeCanvasFormData(ctx.getState().projectName, data.canvas), silent: data.silent })),
    switchMap(({ formData, silent }) =>
      merge(
        loading$(() => !silent),
        window.RxPost('/studio/save?id', {
          body: formData,
          querys: { id: getUrlParam('id') }
        }).pipe(
          tap((apiData) => {
            if (apiData.code === 1) {
              silent || message.success('保存成功');
            } else {
              message.error(apiData.msg);
            }
          }),
          catchError(() => {
            message.error('保存失败!');
            return empty();
          }),
          finalize(() => {
            ctx.dispatch('cancelSaveCanvas');
            ctx.commit('progress', false);
          })
        )
      )
    ));
}

export function cancelSaveCanvas(ctx: IRxCtx<any>) {
  return ctx.curAction$.pipe(
    tap(() => message.cancel(ctx.getState().saveCanvasLoadingId))
  );
}

export function downloadProject<T extends Editor.ICanvaState>(ctx: IRxCtx<T>, _: T) {
  return ctx.curAction$.pipe(
    throttleTime(3000),
    filter(() => {
      if (!ctx.getState().projectName) {
        message.warning('请输入项目名称');
        return false;
      }
      return true;
    }),
    tap(() => ctx.commit('progress', true)),
    map((data) => {
      const pjtName = ctx.getState().projectName;
      const blob = new Blob([enBase64(JSON.stringify({ name: pjtName, data }))]);

      const formData = new FormData();
      formData.append('name', pjtName);
      formData.append('file', blob, 'file.canvas');
      return formData;
    }),
    switchMap((formData) =>
      window.RxPost('/studio/download?id', {
        body: formData,
        querys: {
          id: getUrlParam('id')
        }
      }).pipe(
        tap((apiData) => {
          if (apiData.code === 1) {
            download(`${window.config.host}/studio/download/${apiData.result.id}`);
          } else {
            message.error(apiData.msg);
          }
        }),
        takeUntil(timer(180000).pipe(
          tap(() => message.error('下载超时!'))
        )),
        catchError(() => {
          message.error('下载失败!');
          return empty();
        }),
        finalize(() => {
          ctx.commit('progress', false);
        })
      )
    )
  );
}

export function previewProject<T extends Editor.ICanvaState>(ctx: IRxCtx<T>, _: T) {
  return ctx.curAction$.pipe(
    throttleTime(3000),
    filter(() => {
      if (!ctx.getState().projectName) {
        message.warning('请输入项目名称');
        return false;
      }
      return true;
    }),
    map((data) => {
      const pjtName = ctx.getState().projectName;
      const blob = new Blob([enBase64(JSON.stringify({ name: pjtName, data }))]);

      const formData = new FormData();
      formData.append('name', pjtName);
      formData.append('file', blob, 'file.canvas');
      return formData;
    }),
    tap(() => ctx.commit('mask', '正在生成预览...')),
    switchMap((formData) =>
      window.RxPost('/studio/project-preview?id', {
        body: formData,
        querys: {
          id: getUrlParam('id')
        }
      }).pipe(
        tap((apiData) => {
          if (apiData.code === 1) {
            window.open(apiData.result.url);
          } else {
            message.error(apiData.msg);
          }
        }),
        takeUntil(timer(180000).pipe(
          tap(() => message.error('预览超时!'))
        )),
        catchError(() => {
          message.error('预览失败!');
          return empty();
        }),
        finalize(() => {
          ctx.commit('mask', null);
        })
      )
    )
  );
}
