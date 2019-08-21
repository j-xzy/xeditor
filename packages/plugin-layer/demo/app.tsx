// tslint:disable:no-console
import { Canvas } from '@xeditor/core';
import * as React from 'react';
import { Panel } from './eventPanel';
import { Block } from './feature/block';
import { Container } from './feature/container';
import { LayerWidget } from './layerWidget';

const canvaStyle: ICanvasStyle = {
  backgroundImage: 'url()',
  height: '800px',
  position: 'absolute',
  top: '150px',
  width: '800px',
  left: '0px',
  scale: 0.9,
  border: '1px solid black'
};

export function App() {
  const undo = React.useRef(() => { /** */ });
  const redo = React.useRef(() => { /** */ });
  const clear = React.useRef(() => { /** */ });
  const getData: React.MutableRefObject<() => ICanvaState | void> = React.useRef(() => {/** */ });

  return (
    <>
      <div style={{ border: '1px solid #000', padding: '10px', margin: '5px', width: '200px' }}>
        <h3>tools</h3>
        <button onClick={() => undo.current()}>undo</button>
        <button onClick={() => redo.current()}>redo</button>
        <button onClick={() => clear.current()}>clear</button>
        <button onClick={() => console.log(JSON.stringify(getData.current()))}>getData</button>
      </div>
      <div className='feature_container'>
        <Block name='Block' />
        <Container />
      </div>
      <Canvas
        getData={(_getData) => getData.current = _getData}
        defaultStyle={canvaStyle}
        undo={(_undo) => undo.current = _undo}
        redo={(_redo) => redo.current = _redo}
        clear={(_clear) => clear.current = _clear}
      />
      <div style={{ position: 'absolute', left: 800 }}>
        <LayerWidget />
      </div>
      <div style={{ position: 'absolute', left: 1200 }}>
        {/* <Panel /> */}
      </div>
    </>
  );
}
