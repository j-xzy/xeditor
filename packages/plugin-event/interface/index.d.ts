declare namespace Editor {
  interface IFeatureOption {
    event?: PluginEvent.IEventOpt;
  }

  interface ICanvaStoreState {
    eventState: PluginEvent.IEventState;
  }

  namespace PluginEvent {
    type IDeepPartial<T> = T extends IPrimitive ? T : T extends any[] ? Partial<T> : IDeepPartialObject<T>

    type IDeepPartialObject<T> = {
      [P in keyof T]?: IDeepPartial<T[P]>
    }

    interface ICompEventOpt {
      event: IEventOpt;
      name: string;
    }

    interface IVisitor<T> {
      [p: string]: {
        enter?: (node: T, parent: T) => void;
        exit?: (node: T, parent: T) => void;
      }
    }

    type INodeType = 'BaseNode' | 'Time' | 'Expression' | 'PropertyExpression' | 'Action' | 'Condition' | 'Event' | 'ForLoop' | 'EventRoot' | 'WhileLoop' | 'Loop';

    interface IEventState {
      type: INodeType;
      state: IActionNodeState | IExpressionNodeState | IConditionNodeState | IEventNodeState | IForLoopNodeState | IWhileLoopNodeState | IEventRootState;
      children: IEventState[];
    }

    interface IPropertyExpressionState {
      id: number;
      disabled: boolean;
      property: string;
      data: IExpressionNodeState[];
    }

    interface IExpressionNodeState {
      id: number,
      disabled: boolean;
      value: IExpression;
    }

    interface IActionNodeState {
      id: number;
      disabled: boolean;
      targetId: number;
      type: string;
      data: IExpressionNodeState[] | IPropertyExpressionState[];
    }


    interface ITimeState {
      id: number;
      disabled: boolean;
      timeType: 'Interval' | 'Timeout';
      time: IExpressionNodeState[];
    }

    interface IConditionNodeState {
      id: number;
      disabled: boolean;
      logic: ILogicOperator;
      operator: IConditionOperator;
      leftExps: IExpressionNodeState[];
      rightExps: IExpressionNodeState[];
    }

    interface IEventNodeState {
      id: number;
      sourceId: number;
      disabled: boolean;
      trigger: string;
      conditions: IConditionNodeState[];
    }

    interface IForLoopNodeState {
      id: number;
      disabled: boolean;
      countExps: IExpressionNodeState[];
    }

    interface IWhileLoopNodeState {
      id: number;
      disabled: boolean;
      conditions: IConditionNodeState[];
    }

    interface IEventRootState {
      id: number;
      disabled: boolean;
    }

    interface IEventOpt {
      trigger?: Array<{ name: string; type: string }>;
      response?: Array<{ name: string; type: string }>;
    }

    type ILogicOperator = '&&' | '||';

    type IConditionOperator = '===' | '!=' | '>' | '<' | '>=' | '<=';

    type IExpression = string | ICompExpression;

    interface ICompExpression {
      id: number;
      property: string;
    }

    type IFtrMap = Map<number, { state: IFeatureState, option: IFeatureOption }>
  }
}