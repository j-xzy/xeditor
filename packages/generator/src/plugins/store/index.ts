import generate from '@babel/generator';
import * as parser from '@babel/parser';
import template from '@babel/template';
import * as t from '@babel/types';
import * as fs from 'fs-extra';
import * as path from 'path';
import { IBody, ICompiler, Plugin } from '../../core';
import { generateEvt } from '../../generateEvt';
import { parseExpres, traverser } from '../../util';
import { bodyTemplate as bodyTempStr, serverTemplate as serverTempStr } from './template';

export class StorePlugin extends Plugin {
  private bodys: t.ExpressionStatement[] = [];
  private imports: t.ImportDeclaration[] = [];

  public async afterInitDir(compiler: ICompiler) {
    const { srcPath, config: { body, srcMap } } = compiler;

    this.setImport(srcMap);

    this.canvasState(body);

    await this.comAndBoxState(body, srcMap);

    this.varState(body);

    this.serverState(body);

    const ast = t.program(
      template(bodyTempStr)({
        IMPORTS: this.imports,
        BODYS: this.bodys
      }));

    await fs.writeFile(path.join(srcPath, 'store', 'index.js'), generate(ast).code);
  }

  private canvasState(body: IBody) {
    const { canvas } = body.data;
    this.bodys.push(this.generateModel(body.data.canvas.id.toString(), `{ style: ${JSON.stringify(canvas.style)} }`, t.identifier('compReducer')));
  }

  private setImport(srcMap: { [p: string]: string }) {
    for (const name in srcMap) {
      this.imports.push(
        t.importDeclaration(
          [t.importDefaultSpecifier(t.identifier(this.convertName(name)))],
          t.stringLiteral(`../components/${name}`))
      );
    }
  }

  private serverState(body: IBody) {
    const serverNode = body.data.hidden.find((item) => item.option.group === '服务');
    if (!serverNode) {
      return;
    }
    serverNode.children.forEach((node) => {
      if (typeof node.state === 'undefined') {
        return;
      }
      const initEventStates = this.getEvent(body, node.state.id!, 'init');
      const onEventStates = this.getEvent(body, node.state.id!, 'change');
      const bindeds: t.ObjectProperty[] = [];
      const allBinded = body.data.canvas.dataDriver[node.state.id!];

      if (allBinded) {
        for (const k in allBinded) {
          const [type, property] = k.split('.');
          if (type === 'property') {
            const exp = parseExpres(allBinded[k].value, 'allState');
            bindeds.push(t.objectProperty(t.identifier(property), exp));
          }
        }
      }

      const propExp = t.objectExpression([
        t.spreadElement(t.memberExpression(t.identifier('state'), t.identifier('property'))),
        ...bindeds
      ]);
      this.bodys.push(
        this.generateModel(
          node.state.id!.toString(),
          typeof node.state === 'string' ? node.state : JSON.stringify(node.state),
          template(serverTempStr)({
            PROPERTY: propExp
          }).expression,
          onEventStates,
          initEventStates
        )
      );
    });
  }

  private varState(body: IBody) {
    const varNode = body.data.hidden.find((item) => item.option.group === '变量');
    if (!varNode) {
      return;
    }

    varNode.children.forEach((node) => {
      if (typeof node.state === 'undefined' || typeof node.state.data === 'undefined') {
        return;
      }
      const onEventStates = this.getEvent(body, node.state.id!, 'change');

      this.bodys.push(
        this.generateModel(
          node.state.id!.toString(),
          typeof node.state === 'string' ? node.state : JSON.stringify(node.state),
          t.identifier('varReducer'),
          onEventStates
        )
      );
    });
  }

  private async comAndBoxState(body: IBody, srcMap: { [p: string]: string }) {
    traverser(body.data.root, {
      com: {
        enter: (node) => {
          const initEventStates = this.getEvent(body, node.state.id!, 'init');

          this.bodys.push(
            this.generateModel(
              node.state.id!.toString(),
              typeof node.state === 'string' ? node.state : JSON.stringify(node.state),
              t.callExpression(t.identifier('combineReducer'), [
                t.arrayExpression([
                  t.memberExpression(t.identifier(this.convertName(this.getKeyByValue(srcMap, node._srcPath!)!)), t.identifier('reducer')),
                  t.identifier('compReducer')
                ])]),
              [],
              initEventStates
            ));
        }
      },
      box: {
        enter: (node) => {
          const initEventStates = this.getEvent(body, node.state.id!, 'init');

          this.bodys.push(
            this.generateModel(
              node.state.id!.toString(),
              typeof node.state === 'string' ? node.state : JSON.stringify(node.state),
              t.identifier('compReducer'),
              [],
              initEventStates
            ));
        }
      }
    });

  }

  private convertName(name: string) {
    return name.replace(/-/g, '').replace(/\./g, 'dot');
  }

  private getKeyByValue(srcMap: { [p: string]: string }, value: string) {
    for (const k in srcMap) {
      if (srcMap[k] === value) {
        return k;
      }
    }
  }

  private generateModel(namespace: string, state: string, reducer: t.Expression, on: Editor.PluginEvent.IEventState[] = [], init: Editor.PluginEvent.IEventState[] = []) {
    const objExpre = t.objectExpression([
      t.objectProperty(t.identifier('namespace'), t.stringLiteral(namespace)),
      t.objectProperty(t.identifier('state'), parser.parseExpression(state)),
      t.objectProperty(t.identifier('reducer'), reducer)
    ]);

    if (on.length > 0) {
      objExpre.properties.push(this.makeObjectExpression(on, 'on', 'change'));
    }

    if (init.length > 0) {
      objExpre.properties.push(this.makeObjectExpression(init, 'init', 'init'));
    }

    return t.expressionStatement(
      t.callExpression(
        t.memberExpression(t.identifier('store'), t.identifier('model')),
        [
          objExpre
        ]
      )
    );
  }

  private makeObjectExpression(evtStates: Editor.PluginEvent.IEventState[], property: string, type: string) {
    return t.objectProperty(
      t.identifier(property),
      t.arrowFunctionExpression(
        [t.identifier('emit'), t.identifier('state'), t.identifier('allState')],
        t.blockStatement(
          [
            t.variableDeclaration('const', [t.variableDeclarator(t.identifier('data'), t.identifier('undefined'))]),
            t.variableDeclaration('const', [t.variableDeclarator(t.identifier('type'), t.stringLiteral(type))]),
            ...evtStates.map((evtState) => generateEvt(evtState, 'allState')!)
          ]
        )
      )
    );
  }

  private getEvent(body: IBody, compId: number, trigger: string) {
    const onEventStates: Editor.PluginEvent.IEventState[] = [];

    body.data.canvas.eventState.children.forEach((child) => {
      if (
        child.type === 'Event'
        && (child.state as Editor.PluginEvent.IEventNodeState).sourceId === compId
        && (child.state as Editor.PluginEvent.IEventNodeState).trigger === trigger) {
        onEventStates.push(child);
      }
    });
    return onEventStates;
  }
}
