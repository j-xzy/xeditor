import { Toolbar } from '@/components/toolbar';
import * as React from 'react';
import './style.styl';

const { Tool } = Toolbar;

export function RightTools() {
  const { widgetType, selectedFtr } = window.useMappedState((s) => ({
    widgetType: s.widget,
    selectedFtr: s.selectedFtr
  }));
  const type = widgetType;
  const handleTooClick = React.useCallback((t: IState['widget']) => {
    selectedFtr && window.commit('widget', t);
  }, [selectedFtr]);

  return (
    <Toolbar>
      <Tool font='icon-palette' onClick={() => handleTooClick('style')} highlight={type === 'style'} title='样式' />
      <Tool font='icon-property' onClick={() => handleTooClick('property')} highlight={type === 'property'} title='属性' />
      <Tool font='icon-event' onClick={() => handleTooClick('event')} highlight={type === 'event'} title='事件' />
      <Tool font='icon-data' onClick={() => handleTooClick('data')} highlight={type === 'data'} title='数据' />
    </Toolbar>
  );
}
