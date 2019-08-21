import { EventPlugin } from '../plugin';
import { BaseNode } from './baenode';
import { Expression } from './expression';
import { WithTreeNode } from './withTreeNode';

export class PropertyExpression extends BaseNode {
  public type:  Editor.PluginEvent.INodeType = 'PropertyExpression';

  constructor(
    plugin: EventPlugin,
    public id: number,
    public disabled = false,
    public property = '',
    public data: WithTreeNode<Expression>
  ) {
    super(plugin, id, disabled);
    data.setBase(this);
  }

  get State():  Editor.PluginEvent.IPropertyExpressionState {
    return {
      id: this.id,
      disabled: this.disabled,
      property: this.property,
      data: this.data.getChildren().map((exp) => exp.State)
    };
  }

  public dispatch(action: 'property' | 'remove', data?: any) {
    if (action === 'property') {
      this.property = data;
      this.notifyParent(this.Parent as BaseNode);
    }
    super.dispatch(action, data);
    this.eventRootToState();
  }
}
