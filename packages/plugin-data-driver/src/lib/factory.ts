import { Expression, Node } from '../node';
import { DataDriverPlugin } from '../plugin';

export class Factory {

  private static _instance: Factory;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public Node(plugin: DataDriverPlugin, compId: number, property: string, exps?: Editor.PluginDataDriver.IExpression[]) {
    const node = new Node(plugin, compId, property);
    if (typeof exps !== 'undefined') {
      exps.forEach((exp) => {
        node.appendChild(this.Expression(plugin, exp));
      });
    }
    return node;
  }

  public Expression(plugin: DataDriverPlugin, value: Editor.PluginDataDriver.IExpression) {
    return new Expression(plugin, value);
  }

  public emptyNode(plugin: DataDriverPlugin, compId: number, property: string) {
    const node = this.Node(plugin, compId, property);
    node.appendChild(this.Expression(plugin, ''));
    return node;
  }
}
