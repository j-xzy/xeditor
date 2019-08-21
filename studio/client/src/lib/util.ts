/**
 * 工具函数,与具体业务无关
 */

export function getUrlParam(name: string) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r !== null) {
    return decodeURI(r[2]);
  }
  return null;
}

/**
 * 生成查询参数，过滤掉空值
 * @param querys
 */
export function buildQuery(querys: { [p: string]: any }) {
  let query = '';
  for (const k in querys) {
    if (querys.hasOwnProperty(k)) {
      if (querys[k]) {
        query += `${k}=${querys[k]}&`;
      }
    }
  }
  if (query === '') {
    return '';
  }
  return '?' + query.slice(0, query.length - 1);
}

export function cls(...classNames: Array<null | string | undefined>) {
  let clss = '';
  classNames.forEach((name) => {
    if (typeof name === 'string') {
      clss += name + ' ';
    }
  });
  return clss.trim();
}

export function getCookie(field: string) {
  const cookies = document.cookie.split('=');
  return cookies[cookies.indexOf(field) + 1];
}

export function enBase64(data: string) {
  return btoa(unescape(encodeURIComponent(data)));
}

export function deBase64(data: string) {
  return decodeURIComponent(escape(window.atob(data)));
}

export function download(src: string) {
  let el = document.getElementById('filedownload');
  if (!el) {
    el = document.createElement('iframe');
    el.id = 'filedownload';
    el.style.display = 'none';
    document.body.appendChild(el);
  }
  (el as HTMLIFrameElement).src = src;
}

/**
 * url(xxxx) => xxx
 * @param url
 */
export function extractUrl(url: string) {
  if (/(?<=url\().*?(?=\))/.exec(url) === null) {
    return;
  }
  return /(?<=url\().*?(?=\))/.exec(url)![0];
}

export function isUrl(url: string) {
  return /^https?:\/\//.test(url);
}

export function $(selector: string) {
  return document.querySelector(selector);
}

export function getComputedStyles(el: Element | string) {
  if (typeof el === 'string') {
    const domEl = $(el);
    if (domEl) {
      return document.defaultView!.getComputedStyle(domEl, null);
    }
  } else {
    return document.defaultView!.getComputedStyle(el, null);
  }
}
