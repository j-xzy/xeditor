import { Loading } from '@/base/loading';
import { FloatPanel } from '@/components/floatPanel';
import * as React from 'react';

const Suspense = React.Suspense;
const CanvaStyle = React.lazy(() => import('./canvaStyle'));
const Editor = React.lazy(() => import('./editor'));
const EventWidget = React.lazy(() => import('./event'));
const FeatureProperty = React.lazy(() => import('./ftrProperty'));

export function Widgets() {
  const { widgetType, selectedFtr, widgetPs } = window.useMappedState((s) => ({
    widgetType: s.widget,
    widgetPs: s.widgetPs,
    selectedFtr: s.selectedFtr
  }));

  const handleEndMove = React.useCallback((ps: [number, number]) => {
    window.commit('widgetPs', ps);
  }, []);

  let title = '';
  let Widget: React.ReactNode = null;

  if (widgetType === 'none' || !selectedFtr) {
    return null;
  }

  if (selectedFtr.type === 'canvas' && (widgetType === 'style' || widgetType === 'property')) {
    Widget = <CanvaStyle type={widgetType} />;
    title = widgetType === 'style' ? '画布样式' : '画布属性';
  }

  const state = (selectedFtr.state as Editor.IFeatureState);

  if (selectedFtr.type === 'node' && (widgetType === 'style' || widgetType === 'property')) {
    if (typeof state[widgetType] !== 'undefined') {
      Widget = <FeatureProperty type={widgetType} />;
      title = widgetType === 'style' ? '样式' : '属性';
    }
  }

  if (selectedFtr.type === 'node' && widgetType === 'event') {
    Widget = <EventWidget ftrId={(selectedFtr.state as Editor.IFeatureState).id!} />;
    title = '事件';
  }

  if (selectedFtr.type === 'node' && widgetType === 'data' && typeof state.data !== 'undefined') {
    // 改变key值,强制rerender!,避免切换feature时data不更新
    Widget = <Editor />;
    title = '数据';
  }

  if (!Widget) {
    window.commit('widget', 'none');
    return null;
  }

  return (
    <FloatPanel title={title} onEndMove={handleEndMove} initPs={widgetPs} onCloseClick={() => window.commit('widget', 'none')}>
      <Suspense fallback={<Loading />}>
        {Widget}
      </Suspense>
    </FloatPanel>
  );
}
