import { TreeNode } from '@xeditor/core';
import { Factory } from '../lib/factory';
import { EventPlugin } from '../plugin';
import { BaseNode } from './baenode';

export class Loop extends BaseNode {
  public type:  Editor.PluginEvent.INodeType = 'Loop';

  constructor(plugin: EventPlugin, public id: number, public disabled = false) {
    super(plugin, id, disabled);
  }

  public dispatch(action: 'WhileLoop' | 'ForLoop' | 'id' | 'disabled' | 'remove', data?: any) {
    if (action === 'WhileLoop' || action === 'ForLoop') {
      const parent = this.Parent as BaseNode;
      const children = this.getChildren();
      let newNode!: TreeNode;
      action === 'WhileLoop' && (newNode = this.insertAsSuccessor(Factory.Instance.EmptyWhileLoop(this.plugin)));
      action === 'ForLoop' && (newNode = this.insertAsSuccessor(Factory.Instance.EmptyForLoop(this.plugin)));
      children[0] && newNode.insertAsFirstChild(children[0]);
      this.remove();
      children.forEach((child) => {
        child.Parent = newNode;
      });
      parent && parent.notify();
    }

    super.dispatch(action, data);
    this.eventRootToState();
    this.notify();
  }
}
