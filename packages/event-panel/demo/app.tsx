// tslint:disable:no-console
import { Canvas, Provider } from '@xeditor/core';
import * as React from 'react';
import { Console } from './console';
import { data } from './data';
import { EventComp1 } from './eventComp1';
import { EventComp2 } from './eventComp2';
import { Panel } from './eventPanel';

const canvaStyle: Editor.ICanvasStyle = {
  backgroundImage: 'url()',
  height: '800px',
  position: 'absolute',
  top: '170px',
  width: '800px',
  left: '0px',
  scale: 0.9,
  border: '1px solid black'
};

export class App extends React.Component {
  private undo!: () => void;
  private redo!: () => void;
  private clear!: () => void;
  private setCanvas!: (data: Editor.ICanvaData) => void;
  private getData!: () => Editor.ICanvaState;

  public render() {
    return (
      <Provider>
        <div style={{ border: '1px solid #000', padding: '10px', margin: '5px', width: '200px' }}>
          <h3>tools</h3>
          <button onClick={() => this.undo()}>undo</button>
          <button onClick={() => this.redo()}>redo</button>
          <button onClick={() => this.clear()}>clear</button>
          <button onClick={() => console.log(JSON.stringify(this.getData()))}>getData</button>
          <button onClick={() => this.setCanvas(data)} >setCanvas</button>
        </div>
        <EventComp1 trigger={(e) => { console.log(e); }} />
        <EventComp2 trigger={(e) => { console.log(e); }} />
        <Canvas
          setCanvas={(setCanvas) => this.setCanvas = setCanvas}
          getData={(getData) => this.getData = getData}
          defaultStyle={canvaStyle}
          undo={(undo) => this.undo = undo}
          redo={(redo) => this.redo = redo}
          clear={(clear) => this.clear = clear}
        />
        <div style={{ position: 'absolute', left: 800, top: 100, background: '#333' }}>
          <Panel />
        </div>
        <Console style={{ position: 'absolute', left: 800, top: 500 }} />
      </Provider>
    );
  }
}
