// 拖拽标识
export const DROP_TARGET_PREVIEW = 'DROP_TARGET_PREVIEW';

// event symbol
export const EventType = {
  SwitchStore: Symbol.for('SwitchStore'), // (param: store)
  UnSubscribeStore: Symbol.for('UnSubscribeStore'),
  RenderCanvas: Symbol.for('RenderCanvas'), // (param: history=true )
  Error: Symbol.for('Error') // (param: error:string )
};
