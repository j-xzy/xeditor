import { TreeNode } from '@xeditor/core';
import { clearExpres } from '../lib/formatExp';
import { EventPlugin } from '../plugin';
import { BaseNode } from './baenode';
import { Condition } from './condition';
import { WithTreeNode } from './withTreeNode';

export class Event extends BaseNode {
  public type:  Editor.PluginEvent.INodeType = 'Event';

  constructor(plugin: EventPlugin, public id: number, public sourceId: number, public disabled = false, public trigger: string, public condition: WithTreeNode<Condition>) {
    super(plugin, id, disabled);
    condition.setBase(this);
  }

  get State():  Editor.PluginEvent.IEventNodeState {
    return {
      disabled: this.disabled,
      conditions: this.condition.getChildren().map((cond) => cond.State),
      sourceId: this.sourceId,
      trigger: this.trigger,
      id: this.id
    };
  }

  public dispatch(action: 'id' | 'sourceId' | 'disabled' | 'trigger' | 'remove', data?: any) {
    if (action === 'sourceId' || action === 'trigger') {
      (this as any)[action] = data;
    }
    super.dispatch(action, data);
    this.eventRootToState();
    this.notify();
  }

  public clear(compId: number) {
    if (this.sourceId === compId) {
      return this.dispatch('remove');
    }
    clearExpres(this.condition, compId);
    super.clear(compId);
  }

  public clone() {
    const node = super.clone();
    if (typeof node !== 'undefined') {
      const condition = new TreeNode();
      this.condition.getChildren().forEach((child) => {
        condition.appendChild((child as Condition).clone());
      });
      node.condition = condition;
    }
    return node;
  }

  public disable() {
    super.disable();
    this.condition.getChildren().forEach((cond) => {
      (cond as Condition).dispatch('disabled', true);
    });
  }

  public enable() {
    super.enable();
    this.condition.getChildren().forEach((cond) => {
      (cond as Condition).dispatch('disabled', false);
    });
  }
}
