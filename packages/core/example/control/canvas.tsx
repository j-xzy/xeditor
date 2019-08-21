import * as React from 'react';
import { canvasConnector } from '../../src';

interface IProps {
  update: (style: any) => void;
  style: React.CSSProperties;
  state: Editor.ICanvasStyle;
}

function mapStateToProps(state: { style: Editor.ICanvasStyle }, ownProps: IProps) {
  return { state: state.style };
}

const mapDispatchToProps = {
  update: (style: any) => ({
    type: 'style',
    data: style
  })
};

function RawCanvasControl(props: IProps) {
  return (
    <div style={props.style}>
      <h3>Canvas属性</h3>
      <div>
        <label>width</label> <input type='text' value={props.state.width || ''} onChange={({ target: { value } }) => props.update({ ...props.state, width: value })} />
      </div>
      <div>
        <label>height</label> <input type='text' value={props.state.height || ''} onChange={({ target: { value } }) => props.update({ ...props.state, height: value })} />
      </div>
      <div>
        <label>scale</label> <input type='text' value={props.state.scale || ''} onChange={({ target: { value } }) => props.update({ ...props.state, scale: parseFloat(value) })} />
      </div>
    </div>
  );
}

export const CanvasControl = canvasConnector<{ style: React.CSSProperties }, IProps>(mapStateToProps, mapDispatchToProps)(RawCanvasControl);
