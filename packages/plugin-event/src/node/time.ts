import { clearExpres } from '../lib/formatExp';
import { EventPlugin } from '../plugin';
import { BaseNode } from './baenode';
import { Expression } from './expression';
import { WithTreeNode } from './withTreeNode';

export class Time extends BaseNode {

  public type: Editor.PluginEvent.INodeType = 'Time';

  constructor(
    plugin: EventPlugin,
    public id: number,
    public disabled: boolean,
    public timeType: 'Interval' | 'Timeout',
    public time: WithTreeNode<Expression> // expression
  ) {
    super(plugin, id);
    time.setBase(this);
  }

  get State(): Editor.PluginEvent.ITimeState {
    return {
      disabled: this.disabled,
      id: this.id,
      timeType: this.timeType,
      time: this.time.getChildren().map((node) => node.State)
    };
  }

  public dispatch(action: 'id' | 'disabled' | 'remove' | 'Timeout' | 'Interval', data?: any) {
    if (action === 'Timeout' || action === 'Interval') {
      this.timeType = action;
    }
    super.dispatch(action, data);
    this.eventRootToState();
    this.notify();
  }

  public clear(compId: number) {
    clearExpres(this.time, compId);
    super.clear(compId);
  }

  public clone() {
    const node = super.clone();
    if (typeof node !== 'undefined') {
      node.time = this.cloneTime(this.time);
    }
    return node;
  }

  public disable() {
    super.disable();
    this.time.getChildren().forEach((exp) => {
      (exp as Expression).disable();
    });
  }

  public enable() {
    super.enable();
    this.time.getChildren().forEach((exp) => {
      (exp as Expression).enable();
    });
  }

  private cloneTime(node: WithTreeNode<Expression>) {
    const exp = new WithTreeNode<Expression>();
    node.getChildren().forEach((child) => {
      exp.appendChild(child.clone());
    });
    return exp;
  }
}
