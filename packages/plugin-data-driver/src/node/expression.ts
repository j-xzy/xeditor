import { Factory } from '../lib/factory';
import { formatExp } from '../lib/formatExp';
import { DataDriverPlugin } from '../plugin';
import { BaseNode } from './baseNode';

export class Expression extends BaseNode {
  constructor(plugin: DataDriverPlugin, public value: Editor.PluginDataDriver.IExpression) {
    super(plugin);
  }

  public get State() {
    return this.value;
  }

  public dispatch(action: 'value' | '__delete' | 'remove', data?: any) {
    if (action === 'value') {
      this.doValue(data);
    }

    if (action === '__delete') {
      this.doDelete();
    }

    this.syncDataDriverState();
  }

  public clone() {
    return Factory.Instance.Expression(this.plugin, this.value);
  }

  public clear(compId: number) {
    if (typeof this.value === 'string') {
      return false;
    }
    if (this.value.id === compId) {
      this.remove();
    }
    return true;
  }

  private doValue(data: Editor.PluginDataDriver.IExpression) {
    if (typeof data !== 'string' && typeof this.value === 'string') {
      const copyedData = { ...data };

      if (copyedData.id !== -1) {
        const ftr = this.plugin.getFeatureById(copyedData.id);
        if (!ftr) {
          return;
        }
        if (ftr.Option.group === '变量' || ftr.Option.group === '服务') {
          copyedData.property = 'data';
        }
      }
      // 更新组件属性
      this.insertAsSuccessor(Factory.Instance.Expression(this.plugin, copyedData));
      this.formatExp();
      this.notifyPluginWidget();
    } else {
      this.value = data;
      this.notify();
    }
  }

  private doDelete() {
    if (typeof this.Predecessor !== 'undefined' && typeof (this.Predecessor as Expression).value !== 'string') {
      // 删除
      this.Predecessor.remove();
      this.formatExp();
      this.notifyPluginWidget();
    }
  }

  private formatExp() {
    typeof this.Parent !== 'undefined' && formatExp(this.Parent as BaseNode);
  }
}
