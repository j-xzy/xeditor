import { Action, Condition, Event, EventRoot, Expression, ForLoop, PropertyExpression, Time, WhileLoop, WithTreeNode } from '../node';
import { EventPlugin } from '../plugin';
import { Uid } from './uid';

export class Factory {

  private static _instance: Factory;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  protected constructor() {
    //
  }

  public condStateToConditonTree(plugin: EventPlugin, state: Editor.PluginEvent.IConditionNodeState[], newId: boolean) {
    const condition = new WithTreeNode<Condition>();

    state.forEach((condState) => {
      condition.appendChild(this.Condition(plugin, { ...condState }, newId));
    });

    return condition;
  }

  public expStatesToWithTreeNode(plugin: EventPlugin, state: Editor.PluginEvent.IExpressionNodeState[], newId: boolean) {
    const expression = new WithTreeNode<Expression>();

    state.forEach((expState) => {
      expression.appendChild(this.Expression(plugin, { ...expState }, newId));
    });

    return expression;
  }

  public propertyexpStatesToWithTreeNode(plugin: EventPlugin, state: Editor.PluginEvent.IPropertyExpressionState[], newId: boolean) {
    const propertyExpression = new WithTreeNode<PropertyExpression>();
    state.forEach((propertyExpState) => {
      propertyExpression.appendChild(this.PropertyExpression(plugin, { ...propertyExpState }, newId));
    });
    return propertyExpression;
  }

  public Action(plugin: EventPlugin, state: Editor.PluginEvent.IActionNodeState, newId = false) {
    const id = newId ? Uid.instance.generateId() : state.id;
    if (isPropertyExpression(state.data)) {
      return new Action(plugin, id, state.targetId, state.disabled, state.type, this.propertyexpStatesToWithTreeNode(plugin, state.data, newId));
    } else {
      return new Action(plugin, id, state.targetId, state.disabled, state.type, this.expStatesToWithTreeNode(plugin, state.data, newId));
    }
  }

  public Condition(plugin: EventPlugin, state: Editor.PluginEvent.IConditionNodeState, newId = false) {
    const id = newId ? Uid.instance.generateId() : state.id;
    return new Condition(
      plugin,
      id,
      state.disabled,
      state.logic,
      state.operator,
      this.expStatesToWithTreeNode(plugin, state.leftExps, newId),
      this.expStatesToWithTreeNode(plugin, state.rightExps, newId)
    );
  }

  public Event(plugin: EventPlugin, state: Editor.PluginEvent.IEventNodeState, newId = false) {
    const id = newId ? Uid.instance.generateId() : state.id;
    return new Event(plugin, id, state.sourceId, state.disabled, state.trigger, this.condStateToConditonTree(plugin, state.conditions, newId));
  }

  public ForLoop(plugin: EventPlugin, state: Editor.PluginEvent.IForLoopNodeState, newId = false) {
    const id = newId ? Uid.instance.generateId() : state.id;
    return new ForLoop(plugin, id, state.disabled, this.expStatesToWithTreeNode(plugin, state.countExps, newId));
  }

  public WhileLoop(plugin: EventPlugin, state: Editor.PluginEvent.IWhileLoopNodeState, newId = false) {
    const id = newId ? Uid.instance.generateId() : state.id;
    return new WhileLoop(plugin, id, state.disabled, this.condStateToConditonTree(plugin, state.conditions, newId));
  }

  public Time(plugin: EventPlugin, state: Editor.PluginEvent.ITimeState, newId = false) {
    const id = newId ? Uid.instance.generateId() : state.id;
    return new Time(plugin, id, state.disabled, state.timeType, this.expStatesToWithTreeNode(plugin, state.time, newId));
  }

  public Expression(plugin: EventPlugin, state: Editor.PluginEvent.IExpressionNodeState, newId = false) {
    const id = newId ? Uid.instance.generateId() : state.id;
    return new Expression(plugin, id, state.disabled, state.value);
  }

  public PropertyExpression(plugin: EventPlugin, state: Editor.PluginEvent.IPropertyExpressionState, newId = false) {
    const id = newId ? Uid.instance.generateId() : state.id;
    return new PropertyExpression(plugin, id, state.disabled, state.property, this.expStatesToWithTreeNode(plugin, state.data, newId));
  }

  public EventRoot(plugin: EventPlugin, state: Editor.PluginEvent.IEventRootState) {
    return new EventRoot(plugin, state.id, state.disabled);
  }

  public EmptyEvent(plugin: EventPlugin) {
    const event = this.Event(plugin, {
      id: -1,
      sourceId: -1,
      disabled: false,
      trigger: '',
      conditions: []
    }, true);
    const action = this.Action(plugin, {
      id: -1,
      targetId: -1,
      type: '',
      data: [{ id: -1, value: '', disabled: false }],
      disabled: false
    }, true);
    event.insertAsFirstChild(action);
    return event;
  }

  public EmptyCondition(plugin: EventPlugin) {
    return this.Condition(plugin, {
      id: -1,
      disabled: false,
      logic: '&&',
      operator: '===',
      leftExps: [{ id: -1, value: '', disabled: false }],
      rightExps: [{ id: -1, value: '', disabled: false }]
    }, true);
  }

  public EmptyWithCondition(plugin: EventPlugin) {
    return this.EmptyCondition(plugin);
  }

  public EmptyTime(plugin: EventPlugin) {
    return this.Time(plugin, {
      id: -1,
      timeType: 'Timeout',
      disabled: false,
      time: [{ disabled: false, id: -1, value: '' }]
    }, true);
  }

  public EmptyAction(plugin: EventPlugin) {
    return this.Action(plugin, {
      id: -1,
      targetId: -1,
      type: '',
      data: [{ id: -1, value: '', disabled: false }],
      disabled: false
    }, true);
  }

  public EmptyForLoop(plugin: EventPlugin) {
    return this.ForLoop(plugin, {
      id: -1,
      disabled: false,
      countExps: [{
        disabled: false,
        id: -1,
        value: ''
      }]
    }, true);
  }

  public EmptyWhileLoop(plugin: EventPlugin) {
    return this.WhileLoop(plugin, {
      id: -1,
      disabled: false,
      conditions: [{
        id: -1,
        disabled: false,
        logic: '&&',
        operator: '===',
        leftExps: [{
          disabled: false,
          id: -1,
          value: ''
        }],
        rightExps: [{
          disabled: false,
          id: -1,
          value: ''
        }]
      }]
    }, true);
  }

  public EmptyExpression(plugin: EventPlugin) {
    return this.Expression(plugin, {
      id: -1,
      value: '',
      disabled: false
    }, true);
  }

  public EmptyPropertyExpression(plugin: EventPlugin) {
    return this.PropertyExpression(plugin, {
      id: -1,
      disabled: false,
      property: '',
      data: [{
        id: -1,
        disabled: false,
        value: ''
      }]
    }, true);
  }
}

function isPropertyExpression(param: Editor.PluginEvent.IExpressionNodeState[] | Editor.PluginEvent.IPropertyExpressionState[]): param is Editor.PluginEvent.IPropertyExpressionState[] {
  return typeof (param[0] as Editor.PluginEvent.IPropertyExpressionState).property !== 'undefined';
}
