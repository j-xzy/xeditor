import { Observable, of } from 'rxjs';
import { ajax, AjaxRequest } from 'rxjs/ajax';
import { switchMap } from 'rxjs/operators';
import { getCookie } from './util';

// #region fetch
export async function Get<T extends IGetUrl>(urlPattern: T, params: IGetParams<T> = {} as any) {
  return await adFetch<Promise<IGetReponse<T>>>(urlPattern, 'get', params);
}

export async function Post<T extends IPostUrl>(urlPattern: T, params: IPostParams<T> = {} as any) {
  return await adFetch<Promise<IPostReponse<T>>>(urlPattern, 'post', params);
}

export async function Put<T extends IPutUrl>(urlPattern: T, params: IPutParams<T> = {} as any) {
  return await adFetch<Promise<IPutReponse<T>>>(urlPattern, 'put', params);
}

export async function Delete<T extends IDeleteUrl>(urlPattern: T, params: IDeleteParams<T> = {} as any) {
  return await adFetch<Promise<IDeleteReponse<T>>>(urlPattern, 'delete', params);
}

export async function adFetch<T>(urlPattern: string, method: IHttpMethod, params: any): Promise<T> {
  if (window.config.mock) {
    const { default: mockData }: any = await import('@/mock/data.json');
    if (mockData[urlPattern] && mockData[urlPattern][method] && mockData[urlPattern][method].response) {
      return await new Promise((resolve) => {
        resolve(mockData[urlPattern][method].response);
      });
    }
  }

  let url = normalizeUrl(urlPattern, params as any);
  if (!/^https?:\/\//.test(url)) {
    url = window.config.host + url;
  }

  // tslint:disable-next-line: prefer-const
  let { headers, ...others } = params;
  headers = { 'x-csrf-token': getCookie('csrfToken'), ...headers };

  return await fetch(url, {
    method,
    headers,
    credentials: 'include',
    ...others
  }).then((r) => r.json());
}

window.Get = Get;
window.Put = Put;
window.Post = Post;
window.Delete = Delete;
// #endregion

// #region rxj
export function RxGet<T extends IGetUrl>(urlPattern: T, params: IRxGetParams<T> = {} as any) {
  return RxAjax<IGetReponse<T>>(urlPattern, 'get', { responseType: 'json', ...params });
}

export function RxPost<T extends IPostUrl>(urlPattern: T, params: IRxPostParams<T> = {} as any) {
  return RxAjax<IPostReponse<T>>(urlPattern, 'post', params);
}

export function RxDelete<T extends IDeleteUrl>(urlPattern: T, params: IRxDeleteParams<T> = {} as any) {
  return RxAjax<IDeleteReponse<T>>(urlPattern, 'delete', params);
}

export function RxPut<T extends IPutUrl>(urlPattern: T, params: IRxPutParams<T> = {} as any) {
  return RxAjax<IPutReponse<T>>(urlPattern, 'put', params);
}

export function RxAjax<T>(urlPattern: string, method: IHttpMethod, params: any): Observable<T> {
  let url = normalizeUrl(urlPattern, params as any);
  if (!/^https?:\/\//.test(url)) {
    url = window.config.host + url;
  }

  // tslint:disable-next-line: prefer-const
  let { headers, ...others } = params;
  headers = { 'x-csrf-token': getCookie('csrfToken'), ...headers };

  return ajax({
    method,
    url,
    headers,
    ...others
  }).pipe(
    switchMap(({ response }) => {
      return of(response as T);
    })
  );
}

window.RxGet = RxGet;
window.RxPut = RxPut;
window.RxPost = RxPost;
window.RxDelete = RxDelete;

// #endregion

// #region util

/**
 * 格式化urlpattern
 */
export function normalizeUrl(url: string, p: INormalizeUrlParams) {
  let [base] = url.split('?');
  let query = '';
  if (p.params) {
    for (const k in p.params) {
      if (p.params.hasOwnProperty(k)) {
        const reg = new RegExp(`{${k}}`, 'g');
        base = base.replace(reg, p.params[k]);
      }
    }
  }
  if (p.querys) {
    query = '?';
    for (const k in p.querys) {
      if (p.querys.hasOwnProperty(k)) {
        p.querys[k] && (query += `${k}=${p.querys[k]}&`);
      }
    }
    query = query.slice(0, query.length - 1);
  }
  if (query) {
    return base + query;
  }
  return base;
}

// #endregion

// #region declaration
interface INormalizeUrlParams {
  params?: {
    [p: string]: string;
  };
  querys?: {
    [p: string]: string;
  };
}

type IHttpMethod = 'get' | 'post' | 'put' | 'delete';

type IUrl<T extends IHttpMethod> = {
  [p in keyof IApi]: IApi[p][T] extends never ? never : p
}[keyof IApi];

type IGetUrl = IUrl<'get'>;
type IPutUrl = IUrl<'put'>;
type IPostUrl = IUrl<'post'>;
type IDeleteUrl = IUrl<'delete'>;

interface IParams<T extends keyof IApi, P extends IHttpMethod> {
  body: IApi[T][P]['body'];
  params: IApi[T][P]['params'];
  querys: IApi[T][P]['querys'];
}

type IExistParamsKeys<T extends keyof IApi, P extends IHttpMethod> = {
  [k in keyof IParams<T, P>]: IParams<T, P>[k] extends never ? never : k
}[keyof IParams<T, P>];

type IExistParams<T extends keyof IApi, P extends IHttpMethod> = {
  [k in IExistParamsKeys<T, P>]: IApi[T][P][k]
};

type IOmitRequestInit = Omit<RequestInit, 'body' | 'method'>;

type IGetParams<T extends keyof IApi> = IExistParams<T, 'get'> & IOmitRequestInit;
type IPostParams<T extends keyof IApi> = IExistParams<T, 'post'> & IOmitRequestInit;
type IPutParams<T extends keyof IApi> = IExistParams<T, 'put'> & IOmitRequestInit;
type IDeleteParams<T extends keyof IApi> = IExistParams<T, 'delete'> & IOmitRequestInit;

type IOmitRxRequestInit = Omit<AjaxRequest, 'body' | 'method'>;

type IRxGetParams<T extends keyof IApi> = IExistParams<T, 'get'> & IOmitRxRequestInit;
type IRxPostParams<T extends keyof IApi> = IExistParams<T, 'post'> & IOmitRxRequestInit;
type IRxPutParams<T extends keyof IApi> = IExistParams<T, 'put'> & IOmitRxRequestInit;
type IRxDeleteParams<T extends keyof IApi> = IExistParams<T, 'delete'> & IOmitRxRequestInit;

type IGetReponse<T extends IGetUrl> = IApi[T]['get']['response'];
type IPostReponse<T extends IPostUrl> = IApi[T]['post']['response'];
type IPutReponse<T extends IPutUrl> = IApi[T]['put']['response'];
type IDeleteReponse<T extends IDeleteUrl> = IApi[T]['delete']['response'];
// #endregion
