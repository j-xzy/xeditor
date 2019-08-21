import generate from '@babel/generator';
import * as t from '@babel/types';
import * as download from 'download';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as urlUtil from 'url';
import { ICompiler, INode, Plugin } from '../../core';
import { extractUrl, parse, traverser } from '../../util';

export class DownloadAssets extends Plugin {

  public async afterGenerate(compiler: ICompiler) {
    if (!compiler.config.downloadAssets) {
      return;
    }
    let imgCount = 0;
    const storePath = path.join(compiler.srcPath, 'store', 'index.js');
    const imgs: { [p: string]: string } = {};
    const code = (await fs.readFile(storePath)).toString();
    const program = parse(code).program;
    const assetsMap = this.collectAssets(compiler.config.body.data.root);

    program.body.forEach((node) => {
      if (!(
        node.type === 'ExpressionStatement'
        && node.expression.type === 'CallExpression'
        && node.expression.callee.type === 'MemberExpression'
        && node.expression.callee.object.type === 'Identifier'
        && node.expression.callee.object.name === 'store')
      ) {
        return;
      }

      const arg = node.expression.arguments[0];
      if (!arg || arg.type !== 'ObjectExpression') {
        return;
      }

      const namespace = this.getObjectProperty(arg, 'namespace');
      if (!namespace || namespace.type !== 'ObjectProperty' || namespace.value.type !== 'StringLiteral') {
        return;
      }

      const state = this.getObjectProperty(arg, 'state');
      if (!state || state.type !== 'ObjectProperty' || state.value.type !== 'ObjectExpression') {
        return;
      }

      // 处理style上的backgroundImage
      const styles = this.getObjectProperty(state.value, 'style');
      if (styles && styles.type === 'ObjectProperty' && styles.value.type === 'ObjectExpression') {
        const bck = this.getObjectProperty(styles.value, 'backgroundImage');
        if (bck && bck.type === 'ObjectProperty' && bck.value.type === 'StringLiteral') {
          const url = extractUrl(bck.value.value);
          // 如果是base64
          if (this.validUrl(url)) {
            if (typeof imgs[url] === 'undefined') {
              imgs[url] = `img${imgCount++}${path.parse(url).ext}`;
            }

            bck.value = t.templateLiteral([
              t.templateElement({ raw: 'url(', cooked: 'url(' }, false),
              t.templateElement({ raw: ')', cooked: ')' }, true)
            ], [t.callExpression(t.identifier('require'), [t.stringLiteral(`../assets/images/${imgs[url]}`)])]);
          }
        }
      }

      // 处理property上的upload
      const properties = this.getObjectProperty(state.value, 'property');
      if (properties && properties.type === 'ObjectProperty' && properties.value.type === 'ObjectExpression') {
        const id = namespace.value.value;
        const assetPropertyNames = assetsMap[id];

        if (assetPropertyNames) {
          assetPropertyNames.forEach((name) => {
            if (name.slice(0, name.indexOf('.')) === 'property') {
              const property = this.getDeepObjectProperty(properties.value as t.ObjectExpression, name.slice(name.indexOf('.') + 1));
              if (property && property.type === 'ObjectProperty' && property.value.type === 'StringLiteral') {
                const url = property.value.value;

                if (this.validUrl(url)) {
                  if (typeof imgs[url] === 'undefined') {
                    imgs[url] = `img${imgCount++}${path.parse(url).ext}`;
                  }
                  property.value = t.callExpression(t.identifier('require'), [t.stringLiteral(`../assets/images/${imgs[url]}`)]);
                }
              }
            }
          });
        }
      }
    });

    await Promise.all(Object.keys(imgs).map((url) => {
      return download(encodeURI(url), path.join(compiler.srcPath, 'assets', 'images'), {
        filename: imgs[url]
      }).catch((e) => {
        // tslint:disable-next-line:no-console
        console.error(e);
      });
    }));

    await fs.writeFile(storePath, generate(program).code);
  }

  private validUrl(url: string | undefined): url is string {
    return typeof url !== 'undefined' && url !== '' && url !== '""' && url !== '\'\'' && urlUtil.parse(url).protocol !== 'data:';
  }

  /**
   * 得到嵌套的property
   * @param objExp
   * @param property a.b.c
   */
  private getDeepObjectProperty(objExp: t.ObjectExpression, property: string) {
    const properties = property.split('.');
    let tempObjExp = objExp;
    let p: t.ObjectMethod | t.ObjectProperty | t.SpreadElement | undefined;

    for (let i = 0; i < properties.length; ++i) {
      p = this.getObjectProperty(tempObjExp, properties[i]);
      if (!p || (p.type !== 'ObjectProperty' && i !== properties.length - 1)) {
        throw Error('未找到property:' + property);
      }
      if (p.type === 'ObjectProperty' && p.value.type === 'ObjectExpression') {
        tempObjExp = p.value;
      }
    }
    return p;
  }

  private getObjectProperty(objExp: t.ObjectExpression, property: string) {
    return objExp.properties.find((prop) =>
      prop.type === 'ObjectProperty'
      && (
        (prop.key.type === 'StringLiteral' && prop.key.value === property)
        || (prop.key.type === 'Identifier' && prop.key.name === property)
      )
    );
  }

  private collectAssets(root: INode) {
    const assetsMap: { [id: string]: string[] } = {};
    traverser(root, {
      default: {
        enter(node) {
          if (node.option && node.option.__uploads) {
            assetsMap[node.state.id!] = node.option.__uploads;
          }
        }
      }
    });
    return assetsMap;
  }
}
