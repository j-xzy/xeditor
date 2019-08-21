export function equalExpreStates(pre: Editor.PluginEvent.IExpressionNodeState[], next: Editor.PluginEvent.IExpressionNodeState[]) {
  if (pre.length !== next.length) {
    return false;
  }
  for (let i = 0; i < pre.length; i++) {
    if (pre[i].disabled !== next[i].disabled || pre[i].id !== next[i].id) {
      return false;
    }
    if (typeof pre[i].value !== typeof next[i].value) {
      return false;
    }
    if (typeof pre[i].value === 'string' && pre[i].value !== next[i].value) {
      return false;
    }
    if (typeof pre[i].value === 'object') {
      const pV = pre[i].value as Editor.PluginEvent.ICompExpression;
      const nV = next[i].value as Editor.PluginEvent.ICompExpression;
      if (pV.id !== nV.id || pV.property !== nV.property) {
        return false;
      }
    }
  }
  return true;
}

export function equalActionState(pre: Editor.PluginEvent.IActionNodeState, next: Editor.PluginEvent.IActionNodeState) {
  if (pre.id !== next.id || pre.disabled !== next.disabled || pre.targetId !== next.targetId || pre.type !== next.type) {
    return false;
  }
  // todo
  return equalExpreStates(pre.data as any, next.data as any);
}

export function equalConditionState(pre: Editor.PluginEvent.IConditionNodeState, next: Editor.PluginEvent.IConditionNodeState) {
  if (pre.id !== next.id || pre.disabled !== next.disabled || pre.logic !== next.logic || pre.operator !== next.operator) {
    return false;
  }
  if (!equalExpreStates(pre.leftExps, next.leftExps)) {
    return false;
  }
  if (!equalExpreStates(pre.rightExps, next.rightExps)) {
    return false;
  }
  return true;
}

export function equalEventState(pre: Editor.PluginEvent.IEventNodeState, next: Editor.PluginEvent.IEventNodeState) {
  if (pre.id !== next.id || pre.sourceId !== next.sourceId || pre.disabled !== next.disabled || pre.trigger !== next.trigger) {
    return false;
  }
  if (pre.conditions.length !== next.conditions.length) {
    return false;
  }
  for (let i = 0; i < pre.conditions.length; i++) {
    if (!equalConditionState(pre.conditions[i], next.conditions[i])) {
      return false;
    }
  }
  return true;
}

export function equalForLoopState(pre: Editor.PluginEvent.IForLoopNodeState, next: Editor.PluginEvent.IForLoopNodeState) {
  if (pre.id !== next.id || pre.disabled !== next.disabled) {
    return false;
  }
  return equalExpreStates(pre.countExps, next.countExps);
}

export function equalWhileLoopState(pre: Editor.PluginEvent.IWhileLoopNodeState, next: Editor.PluginEvent.IWhileLoopNodeState) {
  if (pre.id !== next.id || pre.disabled !== next.disabled) {
    return false;
  }
  if (pre.conditions.length !== next.conditions.length) {
    return false;
  }
  for (let i = 0; i < pre.conditions.length; i++) {
    if (!equalConditionState(pre.conditions[i], next.conditions[i])) {
      return false;
    }
  }
  return true;
}
