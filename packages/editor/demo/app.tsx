// tslint:disable:no-console
import * as React from 'react';
import { Canvas, EventWidget, LayerWidget, Provider } from '../src';
import { Api } from './feature/api';
import { Comp } from './feature/comp';
import { Container } from './feature/container';
import { DynamicComp } from './feature/dynamic';
import { Var } from './feature/var';
import { CanvaStyleWidget } from './widget/canvaStyle';
import { EvtBtn } from './widget/evtBtn';
import { StyleWidget } from './widget/styleWidget';

interface IState {
  selectedFtrId: number;
}

export class App extends React.Component<{}, IState> {

  private getData!: (noBoxOutline: boolean) => Editor.ICanvaState;
  private setCanvas!: (data: Editor.ICanvaData) => void;
  private canvasData: any;
  private noSelectedFeature: any;
  private undo!: () => void;
  private redo!: () => void;
  private clear!: () => void;

  constructor(props: {}) {
    super(props);
    this.handleSwitchFeature = this.handleSwitchFeature.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleOpenClick = this.handleOpenClick.bind(this);
    this.state = {
      selectedFtrId: -1
    };
  }

  public handleSwitchFeature(data: Editor.IFeatureInfo | null) {
    if (data) {
      this.setState({ selectedFtrId: data.id });
    } else {
      this.setState({ selectedFtrId: -1 });
    }
  }

  public render() {
    return (
      <Provider>
        <Comp name='组件' />
        <Container />
        <DynamicComp name='动态加载按钮' path='/public/component/button.js' />
        <DynamicComp name='动态加载文字' path='/public/component/text.js' />
        <Var name='变量' />
        <Api name='Api' />
        <Canvas
          setCanvas={(setCanvas) => this.setCanvas = setCanvas}
          defaultStyle={{
            backgroundImage: 'url()', height: '600px', position: 'absolute',
            top: '180px', width: '600px', left: '10px', scale: 1, border: '1px solid black'
          }}
          clear={(clear) => this.clear = clear}
          undo={(undo) => this.undo = undo}
          redo={(redo) => this.redo = redo}
          getData={(getData) => this.getData = getData}
          noSelectedFeature={(noSelectedFeature) => this.noSelectedFeature = noSelectedFeature}
          onSwitchSelectedFeature={this.handleSwitchFeature}
        />

        <div style={{ position: 'absolute', left: '110px', top: '0px' }}>
          <button onClick={this.handleSaveClick}>save</button>
          <button onClick={this.handleOpenClick}>open</button>
          <button onClick={() => this.undo()}>undo</button>
          <button onClick={() => this.redo()}>redo</button>
          <button onClick={() => this.clear()}>clear</button>
          <button onClick={() => this.noSelectedFeature()}>noSelectedFeature</button>
        </div>
        <div style={{ position: 'absolute', left: '650px' }}>
          <LayerWidget />
        </div>
        <div style={{ position: 'absolute', left: '910px', background: '#000' }}>
          <EvtBtn compId={this.state.selectedFtrId} />
          <EventWidget compId={this.state.selectedFtrId} />
        </div>
        <div style={{ position: 'absolute', left: 650, top: 400 }}>
          <StyleWidget />
          <CanvaStyleWidget />
        </div>
      </Provider>
    );
  }

  private handleOpenClick() {
    // this.setCanvas(this.canvasData);
  }

  private handleSaveClick() {
    console.log(JSON.stringify(this.getData(true)));
  }
}
