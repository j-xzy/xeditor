import { TreeNode } from '@xeditor/core';
import { Factory } from '../lib/factory';
import { clearExpres } from '../lib/formatExp';
import { EventPlugin } from '../plugin';
import { BaseNode } from './baenode';
import { Expression } from './expression';
import { PropertyExpression } from './propertyExpression';
import { WithTreeNode } from './withTreeNode';

export class Action extends BaseNode {
  public type: Editor.PluginEvent.INodeType = 'Action';

  constructor(
    plugin: EventPlugin,
    public id: number,
    public targetId: number = -1,
    public disabled: boolean = false,
    public actType: string,
    public data: WithTreeNode<Expression | PropertyExpression>// data: treenode: expression
  ) {
    super(plugin, id, disabled);
    data.setBase(this);
  }

  get State(): Editor.PluginEvent.IActionNodeState {
    return {
      targetId: this.targetId,
      type: this.actType,
      data: this.data.getChildren().map((exp) => exp.State) as Editor.PluginEvent.IExpressionNodeState[] | Editor.PluginEvent.IPropertyExpressionState[],
      id: this.id,
      disabled: this.disabled
    };
  }

  public dispatch(action: 'id' | 'targetId' | 'disabled' | 'actType' | 'remove' | 'newPropertyExp', data?: any) {
    if (action === 'actType') {
      if (this.data === data) {
        return;
      }
      if (data === 'setProperty' || data === 'setStyle') {
        this.setEmptyPropertyExpData();
      } else {
        this.setEmptyExpData();
      }
      this.actType = data;
    }
    if (action === 'targetId') {
      this.targetId = data;
      this.actType = '';
      this.setEmptyExpData();
    }
    if (action === 'newPropertyExp') {
      (this.data as WithTreeNode<PropertyExpression>).appendChild(Factory.Instance.EmptyPropertyExpression(this.plugin));
    }

    super.dispatch(action, data);
    this.eventRootToState();
    this.notify();
  }

  public appendChild(node: TreeNode) {
    return node;
  }

  public clear(compId: number) {
    if (this.targetId === compId) {
      this.dispatch('targetId', -1);
      this.dispatch('actType', '');
    }

    clearExpres(this.data, compId);
    super.clear(compId);
  }

  private setEmptyPropertyExpData() {
    const withPropertyExp = new WithTreeNode<PropertyExpression>();
    withPropertyExp.appendChild(Factory.Instance.EmptyPropertyExpression(this.plugin));
    this.data = withPropertyExp;
    this.data.setBase(this);
  }

  private setEmptyExpData() {
    const withExpre = new WithTreeNode<Expression>();
    withExpre.appendChild(Factory.Instance.EmptyExpression(this.plugin));
    this.data = withExpre;
    this.data.setBase(this);
  }
}
