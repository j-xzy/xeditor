import { __config } from '../setConfig';
import { fonts } from './fonts';

function _appendFont() {
  const existFonts: string[] = [];

  return (fontFamily: string) => {

    const font = fonts.find(({ name }) => {
      return name === fontFamily;
    });

    if (!font) {
      return;
    }

    const { withExt } = font;

    if (!withExt || existFonts.includes(fontFamily)) {
      return;
    }

    existFonts.push(fontFamily);

    const fontEL = getFontStyleEl();

    fontEL.innerHTML += `
    @font-face {
      font-family: "${fontFamily}";
      src: url("${__config.fontPath}/${withExt}");
    }
    `;

    function getFontStyleEl() {
      let styleEl = document.getElementById('font-style');
      if (!window.document.head) {
        window.document.appendChild(document.createElement('head'));
      }
      if (!styleEl) {
        styleEl = document.createElement('style') as HTMLStyleElement;
        styleEl.id = 'font-style';
        styleEl.setAttribute('type', 'text/css');
        window.document.head!.appendChild(styleEl);
      }
      return styleEl;
    }
  };
}

export const appendFont = _appendFont();
