import { TreeNode } from '@xeditor/core';
import { Factory } from '../lib/factory';
import { EventPlugin } from '../plugin';
import { Condition } from './condition';
import { WithTreeNode } from './withTreeNode';

export class BaseNode extends TreeNode {

  public type:  Editor.PluginEvent.INodeType = 'BaseNode';

  private listeners: Array<(...params: any[]) => void> = [];

  constructor(public plugin: EventPlugin, public id: number, public disabled = false) {
    super();
  }

  get State() {
    return { id: this.id, disabled: this.disabled };
  }

  public dispatch(action: string, data?: any) {
    if (action === 'id') {
      this.id = data;
    }
    if (action === 'disabled') {
      if (data === true) {
        this.disable();
      }
      if (data === false) {
        this.enable();
      }
    }
    if (action === 'remove') {
      const parent = this.Parent as BaseNode;
      this.remove();
      this.notifyParent(parent);
    }
    if (action.includes('Empty')) {
      const newNode = (Factory.Instance as any)[action](this.plugin) as BaseNode;

      if (action === 'EmptyWithCondition' && (this.type === 'Event' || this.type === 'WhileLoop')) {
        (this as any).condition.appendChild(newNode as Condition);
      } else if (action === 'EmptyCondition' && (this.type === 'Condition') && !data.nested) {
        this.insertAsSuccessor(newNode);
      } else if (action === 'EmptyAction' && (this.type === 'Action')) {
        this.insertAsSuccessor(newNode);
      } else {
        this.appendChild(newNode);
      }
      this.notifyParent(this.Parent as BaseNode);
    }
  }

  public clone() {
    if (typeof (Factory.Instance as any)[this.type] !== 'undefined') {
      const node = (Factory.Instance as any)[this.type](this.plugin, { ...this.State }, true);
      this.getChildren().forEach((child) => {
        node.appendChild((child as any).clone());
      });
      return node;
    }
  }

  public clear(compId: number) {
    this.getChildren().forEach((child) => {
      (child as BaseNode).clear(compId);
    });
  }

  public disable() {
    this.disabled = true;
    this.getChildren().forEach((child) => {
      (child as BaseNode).dispatch('disabled', true);
    });
  }

  public enable() {
    this.disabled = false;
    this.getChildren().forEach((child) => {
      (child as BaseNode).dispatch('disabled', false);
    });
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

  public notifyParent(parent: BaseNode | undefined) {
    if (!parent) {
      return;
    }
    if (parent.type === 'EventRoot') {
      return this.freshTree();
    }
    if (parent instanceof BaseNode) {
      parent.notify();
    }
    if (parent instanceof WithTreeNode) {
      parent.Base && parent.Base.notify();
    }
  }

  public freshTree() {
    this.plugin.freshTree();
  }

  public eventRootToState() {
    this.plugin.eventRootToState();
  }
}
