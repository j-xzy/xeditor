import { CompPanel } from '@/components/compPanel';
import { Header as HeaderBar } from '@/components/header';
import { Layout } from '@/components/layout';
import { LeftTools } from '@/components/leftTools';
import { Mask } from '@/components/mask';
import { Progress } from '@/components/progress';
import { RightTools } from '@/components/rightTools';
import { Scale } from '@/components/scale';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { useInterval } from '@/hooks/useInterval';
import { useResizeObserver } from '@/hooks/useResizeObserver';
import { useThrottle } from '@/hooks/useThrottle';
import { getComputedStyles } from '@/lib/util';
import { Widgets } from '@/widgets';
import { Canvas, LayerWidget } from '@xeditor/editor';
import * as React from 'react';
import './style.styl';

const { Header, Content, Middle, Sider, Float } = Layout;

const defaultStyle: Editor.ICanvasStyle = {
  width: '1920px',
  height: '1080px',
  backgroundSize: 'cover',
  backgroundImage: 'url()',
  backgroundColor: '#ffffff',
  scale: 0.55
};

export function App() {
  const undo: React.MutableRefObject<() => void> = React.useRef(() => {/** */ });
  const redo: React.MutableRefObject<() => void> = React.useRef(() => {/** */ });
  const clear: React.MutableRefObject<() => void> = React.useRef(() => {/** */ });
  const noSelect: React.MutableRefObject<() => void> = React.useRef(() => {/** */ });
  const getCanvas: React.MutableRefObject<((noBoxOutline: boolean) => Editor.ICanvaState) | null> = React.useRef(null);
  const getStyle: React.MutableRefObject<(() => Editor.ICanvasStyle) | null> = React.useRef(null);
  const setCanvas: React.MutableRefObject<((data: Editor.ICanvaData) => void) | null> = React.useRef(null);

  const forceUpdate = useForceUpdate();

  // 更新Canvas的位置使其居中
  const updateCanvasPos = useThrottle(() => {
    if (!canvasContainerRef.current || !getStyle.current) {
      return;
    }
    const { width, height } = getComputedStyles(canvasContainerRef.current)!;
    const canvaStyle = getComputedStyles('.studio-canvas')!;

    const canvasWidth = parseFloat(canvaStyle.width as string) * getStyle.current().scale;
    const canvasHeight = parseFloat(canvaStyle.height as string) * getStyle.current().scale;

    let paddingLeft = (parseFloat(width!) - canvasWidth) / 2 + 'px';
    let paddingTop = (parseFloat(height!) - canvasHeight) / 2 + 'px';

    paddingLeft = parseFloat(paddingLeft) < 0 ? '20px' : paddingLeft;
    paddingTop = parseFloat(paddingTop) < 0 ? '20px' : paddingTop;

    canvasContainerRef.current.style.paddingLeft = paddingLeft;
    canvasContainerRef.current.style.paddingTop = paddingTop;
  }, 600);

  const canvasContainerRef: React.MutableRefObject<null | HTMLDivElement> = React.useRef(null);

  useResizeObserver(canvasContainerRef, updateCanvasPos);

  const handleMiddleClick = React.useCallback(() => {
    noSelect.current();
    window.commit('selectedFtr', null);
    window.commit('widget', 'none');
  }, [noSelect.current]);

  React.useEffect(() => {
    // 强制刷新一次以更新undo/redo等方法
    forceUpdate();
  }, []);

  React.useEffect(() => {
    window.dispatch('getComponentList');
    window.dispatch('openCanvas', setCanvas.current!);
  }, []);

  useInterval(() => {
    // 自动保存
    getCanvas.current && window.dispatch('saveCanvas', { canvas: getCanvas.current(false), silent: true });
  }, 40000);

  return (
    <Layout className='studio'>
      <Header className='studio-header'>
        <HeaderBar undo={undo.current} redo={redo.current} clear={clear.current} getData={getCanvas.current} />
      </Header>
      <Content>
        <Sider className='studio-left-side'>
          <LeftTools getData={getCanvas.current} />
          <CompPanel />
        </Sider>
        <Middle className='studio-middle'>
          <div
            className='studio-canvas-container'
            onClick={handleMiddleClick}
            ref={canvasContainerRef}
          >
            <Canvas
              className='studio-canvas'
              defaultStyle={defaultStyle}
              getData={(f) => getCanvas.current = f}
              getStyle={(f) => getStyle.current = f}
              setCanvas={(f) => setCanvas.current = f}
              undo={(f) => undo.current = f}
              redo={(f) => redo.current = f}
              clear={(f) => clear.current = f}
              noSelectedFeature={(f) => noSelect.current = f}
              onSwitchSelectedFeature={(info) => window.commit('selectedFtr', info)}
            />
          </div>
          <div className='studio-middle-bottom'>
            <Scale onChange={updateCanvasPos} />
          </div>
        </Middle>
        <Sider className='studio-right-sider'>
          <RightTools />
          <LayerWidget />
        </Sider>
      </Content>
      <Float>
        <Progress />
        <Widgets />
        <Mask />
      </Float>
    </Layout>
  );
}
