import { clearExpres } from '../lib/formatExp';
import { EventPlugin } from '../plugin';
import { BaseNode } from './baenode';
import { Expression } from './expression';
import { WithTreeNode } from './withTreeNode';

export class Condition extends BaseNode {

  public type:  Editor.PluginEvent.INodeType = 'Condition';

  constructor(
    plugin: EventPlugin,
    public id: number,
    public disabled: boolean,
    public logic:  Editor.PluginEvent.ILogicOperator = '&&',
    public operator:  Editor.PluginEvent.IConditionOperator = '===',
    public leftExp: WithTreeNode<Expression>, // expression
    public rightExp: WithTreeNode<Expression> // expression
  ) {
    super(plugin, id, disabled);
    leftExp.setBase(this);
    rightExp.setBase(this);
  }

  get State():  Editor.PluginEvent.IConditionNodeState {
    return {
      disabled: this.disabled,
      logic: this.logic,
      operator: this.operator,
      leftExps: this.leftExp.getChildren().map((node) => node.State),
      rightExps: this.rightExp.getChildren().map((node) => node.State),
      id: this.id
    };
  }

  public dispatch(action: 'id' | 'disabled' | 'logic' | 'operator' | 'remove', data?: any) {
    if ( action === 'logic' || action === 'operator') {
      (this as any)[action] = data;
    }
    super.dispatch(action, data);
    this.eventRootToState();
    this.notify();
  }

  public clear(compId: number) {
    clearExpres(this.leftExp, compId);
    clearExpres(this.rightExp, compId);
    super.clear(compId);
  }

  public clone() {
    const node = super.clone();
    if (typeof node !== 'undefined') {
      node.leftExp = this.cloneExp(this.leftExp);
      node.rightExp = this.cloneExp(this.rightExp);
    }
    return node;
  }

  public disable() {
    super.disable();
    this.leftExp.getChildren().forEach((exp) => {
      (exp as Expression).disable();
    });
    this.rightExp.getChildren().forEach((exp) => {
      (exp as Expression).disable();
    });
  }

  public enable() {
    super.enable();
    this.leftExp.getChildren().forEach((exp) => {
      (exp as Expression).enable();
    });
    this.rightExp.getChildren().forEach((exp) => {
      (exp as Expression).enable();
    });
  }

  private cloneExp(node: WithTreeNode<Expression>) {
    const exp = new WithTreeNode<Expression>();
    node.getChildren().forEach((child) => {
      exp.appendChild(child.clone());
    });
    return exp;
  }
}
