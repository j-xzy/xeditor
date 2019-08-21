// tslint:disable: no-console
import * as React from 'react';
import { applyPlugins, Canvas, Provider } from '../src/index';
import { CanvasControl } from './control/canvas';
import { CanvasHookControl } from './control/canvasHook';
import { DisplayControl } from './control/display';
import { FloatControl } from './control/float';
import { MarginControl } from './control/margin';
import { NameControl } from './control/name';
import { PaddingControl } from './control/padding';
import { PositionControl } from './control/position';
import { SizeControl } from './control/size';
import { TextControl } from './control/text';
import { Block, initialState as blcState, option as blcOpt, RawBlock, reducer as blcReducer } from './feature/block';
import { Container, containerInitialState, containerOption, containerReducer, RawContainer } from './feature/container';
import { ErrorBlock } from './feature/error';
import { Hidden, reducer as hiddenReducer } from './feature/hidden';
import { RemoveBlock } from './feature/remove';
import { Replace } from './feature/replace';
import { HiddenFtrStore } from './plugins/hiddenFtrStore';
import { ShortCut } from './plugins/shortCut';

applyPlugins([
  ShortCut, HiddenFtrStore
]);

export class App extends React.Component<{}, { sizeControl: boolean }> {

  private undo!: () => void;
  private redo!: () => void;
  private clear!: () => void;
  private getData!: () => Editor.ICanvaState;
  private noSelectedFeature!: () => void;
  private setCanvas!: (root: Editor.ICanvaData) => void;
  private getStyle!: () => Editor.ICanvasStyle;

  constructor(props: {}) {
    super(props);
    this.state = {
      sizeControl: false
    };
    this.handleSwitchFeature = this.handleSwitchFeature.bind(this);
    this.handleSetCanvas = this.handleSetCanvas.bind(this);
  }

  public render() {
    return (
      <Provider>
        <div className='feature_container'>
          <Block name='Block' />
          <Replace name='Replace' />
          <Container />
          <ErrorBlock />
          <RemoveBlock />
          <Hidden />
        </div>
        <div className='canvas_container'>
          <Canvas
            defaultStyle={{
              height: '800px', position: 'absolute', outline: '1px solid black',
              top: '140px', width: '790px', left: '200px', scale: 0.9
            }}
            getStyle={(getStyle) => this.getStyle = getStyle}
            noSelectedFeature={(noSelectedFeature) => this.noSelectedFeature = noSelectedFeature}
            onError={(err) => console.log(err)}
            onSwitchSelectedFeature={this.handleSwitchFeature}
            getData={(getData) => { this.getData = getData; }}
            setCanvas={(setCanvas) => { this.setCanvas = setCanvas; }}
            undo={(undo) => { this.undo = undo; }}
            redo={(redo) => { this.redo = redo; }}
            clear={(clear) => { this.clear = clear; }}
          />
        </div>
        <div className='controls' style={{ position: 'absolute', left: '1200px', top: 0 }}>
          <button onClick={() => this.noSelectedFeature()}>noSelectedFeature</button>
          <button onClick={() => console.log(this.getData())}>getData</button>
          <button onClick={() => console.log(this.getStyle())}>getStyle</button>
          <button onClick={this.handleSetCanvas}>setCanvas</button>
          <button onClick={() => this.undo()}>undo</button>
          <button onClick={() => this.redo()}>redo</button>
          <button onClick={() => this.clear()}>clear</button>
          <SizeControl />
          <CanvasControl style={{ position: 'absolute', top: 300, left: 300 }} />
          <CanvasHookControl style={{ position: 'absolute', top: 600, left: 300 }} />
          <TextControl style={{ position: 'absolute', top: 100, left: 300 }} />
          <NameControl />
          <DisplayControl />
          <FloatControl />
          <MarginControl />
          <PaddingControl />
          <PositionControl />
        </div>
      </Provider>
    );
  }

  private handleSetCanvas() {
    // tslint:disable-next-line:no-empty
    const fn: any = () => { };

    const root: Editor.IRootData = {
      option: {} as any,
      state: {
        style: {
          background: '#efefef', height: '800px', position: 'absolute',
          top: '140px', width: '700px', left: '200px', scale: 0.9
        }
      } as any,
      reducer: fn,
      component: null as any,
      props: {},
      children: [
        {
          props: {},
          option: containerOption,
          reducer: containerReducer,
          state: { ...containerInitialState, id: 2 },
          component: RawContainer,
          children: [
            {
              props: { foo: 'foo' },
              option: blcOpt,
              reducer: blcReducer,
              state: { ...blcState, name: '1', style: { ...blcState.style, width: '600px' }, id: 3 },
              component: RawBlock,
              children: []
            }
          ]
        },
        {
          props: {},
          option: blcOpt,
          reducer: blcReducer,
          state: { ...blcState, name: '2', style: { ...blcState.style, width: '600px' }, id: 4 },
          component: RawBlock,
          children: []
        }
      ]
    };
    // tslint:disable-next-line:prefer-const
    // tslint:disable-next-line:variable-name
    const any: any = 0;
    const data: Editor.ICanvaData = {
      root,
      hidden: [{
        option: { group: '变量' },
        state: { name: 'xxx' },
        reducer: any,
        children: [
          {
            option: { group: '变量' },
            state: { name: '1', id: 5 },
            reducer: hiddenReducer,
            children: []
          }, {
            option: { group: '变量' },
            state: { name: '2', id: 6 },
            reducer: hiddenReducer,
            children: []
          }
        ]
      }],
      canvas: {
        name: 'canvaStore',
        id: 0,
        style: {
          scale: 1.2,
          width: 1000,
          height: 1100
        }
      }
    };

    this.setCanvas(data);
  }

  private handleSwitchFeature(info: Editor.IFeatureInfo | null) {
    // if (info === null) {
    //   return this.setState({ sizeControl: false });
    // } else {
    //   if ((info.state as Editor.IFeatureState).name === '组件一, block') {
    //     return this.setState({ sizeControl: true });
    //   }
    // }
    // return this.setState({ sizeControl: false });
  }
}
