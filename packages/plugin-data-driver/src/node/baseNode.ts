import { TreeNode } from '@xeditor/core';
import { DataDriverPlugin } from '../plugin';

export class BaseNode extends TreeNode {

  private listeners: Array<(...params: any[]) => void> = [];

  constructor(public plugin: DataDriverPlugin) {
    super();
  }

  public dispatch(_action: string, _data?: any) {
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
  }

  public unSubscribe(listener: () => void) {
    const idx = this.listeners.indexOf(listener);
    idx >= 0 && this.listeners.splice(idx, 1);
  }

  public notify() {
    this.listeners.forEach((callback) => {
      callback();
    });
  }

  public clear(_compId: number): boolean {
    return false;
  }

  public clone() {
    return new BaseNode(this.plugin);
  }

  public syncDataDriverState() {
    this.plugin.syncDataDriverState();
  }

  public notifyPluginWidget() {
    this.plugin.notify();
  }
}
