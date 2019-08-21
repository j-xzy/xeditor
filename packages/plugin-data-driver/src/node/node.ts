import { Factory } from '../lib/factory';
import { formatExp } from '../lib/formatExp';
import { DataDriverPlugin } from '../plugin';
import { BaseNode } from './baseNode';
import { Expression } from './expression';

export class Node extends BaseNode {
  constructor(plugin: DataDriverPlugin, public compId: number, public property: string) {
    super(plugin);
  }

  public get State(): Editor.PluginDataDriver.IDataDriver {
    return {
      id: this.compId,
      property: this.property,
      value: this.getChildren().map((exp) => (exp as Expression).State)
    };
  }

  public clear(compId: number) {
    let hasClear = false;
    this.getChildren().forEach((child) => {
      (child as BaseNode).clear(compId) && (hasClear = true);
    });
    if (hasClear) {
      formatExp(this);
      this.syncDataDriverState();
    }
    return hasClear;
  }

  public clone() {
    const node = Factory.Instance.Node(this.plugin, this.compId, this.property);
    this.getChildren().forEach((exp) => {
      node.appendChild((exp as BaseNode).clone());
    });
    return node;
  }
}
