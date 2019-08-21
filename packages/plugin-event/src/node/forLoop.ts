import { clearExpres } from '../lib/formatExp';
import { EventPlugin } from '../plugin';
import { Expression } from './expression';
import { Loop } from './loop';
import { WithTreeNode } from './withTreeNode';

export class ForLoop extends Loop {
  public type:  Editor.PluginEvent.INodeType = 'ForLoop';

  constructor(plugin: EventPlugin, public id: number, public disabled = false, public countExp: WithTreeNode<Expression>) {
    super(plugin, id, disabled);
    countExp.setBase(this);
  }

  get State():  Editor.PluginEvent.IForLoopNodeState {
    return {
      disabled: this.disabled,
      countExps: this.countExp.getChildren().map((node) => node.State),
      id: this.id
    };
  }

  public clear(compId: number) {
    clearExpres(this.countExp, compId);
    super.clear(compId);
  }
}
