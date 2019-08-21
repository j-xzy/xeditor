import { Factory } from '../lib/factory';
import { formatExp } from '../lib/formatExp';
import { EventPlugin } from '../plugin';
import { BaseNode } from './baenode';
import { WithTreeNode } from './withTreeNode';

export class Expression extends BaseNode {
  public type: Editor.PluginEvent.INodeType = 'Expression';

  constructor(plugin: EventPlugin, public id: number, public disabled = false, public value: Editor.PluginEvent.IExpression) {
    super(plugin, id, disabled);
  }

  get State(): Editor.PluginEvent.IExpressionNodeState {
    return {
      id: this.id,
      disabled: this.disabled,
      value: this.value
    };
  }

  public clear(compId: number) {
    if (typeof this.value !== 'string' && this.value.id === compId) {
      return this.dispatch('remove');
    }
    super.clear(compId);
  }

  public clone() {
    const node = super.clone();
    if (typeof node !== 'undefined') {
      if (typeof (node as Expression).value !== 'string' && typeof this.value !== 'string') {
        (node as Expression).value = { ...this.value };
      }
    }
    return node;
  }

  public dispatch(action: 'id' | 'disabled' | 'value' | '__delete' | 'remove', data?: any) {
    const parent = this.Parent;
    if (action === 'value') {
      if (typeof data !== 'string' && typeof this.value === 'string') {
        const copyedData = { ...data };

        if (copyedData.id !== -1) {
          const ftr = this.plugin.getFeatureById(data.id);
          if (!ftr) {
            return;
          }

          if (ftr.Option.group === '变量' || ftr.Option.group === '服务') {
            copyedData.property = 'data';
          }
        }

        // 更新组件属性
        this.insertAsSuccessor(Factory.Instance.Expression(this.plugin, {
          id: -1,
          disabled: false,
          value: copyedData
        }, true));

      } else {
        this.value = data;
      }
    }
    if (action === '__delete') {
      if (typeof this.Predecessor !== 'undefined' && typeof (this.Predecessor as Expression).value !== 'string') {
        // 删除
        this.Predecessor.remove();
      }
    }
    super.dispatch(action, data);
    if (typeof parent !== 'undefined') {
      formatExp(parent);
      (parent as WithTreeNode<Expression>).Base && (parent as WithTreeNode<Expression>).Base!.notify();
    }
    this.eventRootToState();
    this.notify();
  }
}
