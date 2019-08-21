import { clearExpres } from '../lib/formatExp';
import { EventPlugin } from '../plugin';
import { Condition } from './condition';
import { Loop } from './loop';
import { WithTreeNode } from './withTreeNode';

export class WhileLoop extends Loop {
  public type: Editor.PluginEvent.INodeType = 'WhileLoop';

  constructor(plugin: EventPlugin, public id: number, public disabled = false, public condition: WithTreeNode<Condition>) {
    super(plugin, id, disabled);
    condition.setBase(this);
  }

  get State(): Editor.PluginEvent.IWhileLoopNodeState {
    return {
      conditions: this.condition.getChildren().map((cond) => cond.State),
      id: this.id,
      disabled: this.disabled
    };
  }

  public clear(compId: number) {
    clearExpres(this.condition, compId);
    super.clear(compId);
  }

  public disable() {
    super.disable();
    this.condition.getChildren().forEach((cond) => (cond as Condition).dispatch('disabled', true));
  }

  public enable() {
    super.enable();
    this.condition.getChildren().forEach((cond) => (cond as Condition).dispatch('disabled', false));
  }
}
