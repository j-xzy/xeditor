import * as React from 'react';
import { ILayerPluginState } from '../../src';
import { Block } from './block';
import { Node } from './node';
import { Placeholder } from './placeholder';
import './style.styl';

interface IProps {
  layer: ILayerPluginState;
}

export interface IPlaceProps {
  nodeId: number;
  type: 'child' | 'predecessor' | 'successor' | 'none';
}

export class Layer extends React.Component<IProps, IPlaceProps> {

  private rootRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: IProps) {
    super(props);
    this.getPlaceHolder = this.getPlaceHolder.bind(this);
    this.setPlaceholder = this.setPlaceholder.bind(this);
    this.state = {
      nodeId: -1,
      type: 'none'
    };
  }

  public render() {
    const { layer } = this.props;
    const roots = layer.roots;
    return (
      <div className='layer-root' ref={this.rootRef}>
        {
          roots.map((root, idx) => {
            if (!root) {
              return null;
            }
            return <Node key={idx} node={root} getPlaceholder={this.getPlaceHolder} level={0} layer={layer} setPlaceholder={this.setPlaceholder} />;
          })
        }
        <Placeholder {...this.state} rootEL={this.rootRef.current} />
        <Block {...this.state} rootEL={this.rootRef.current} />
      </div>
    );
  }

  private getPlaceHolder() {
    return this.state;
  }

  private setPlaceholder(state: IPlaceProps) {
    this.setState(state);
  }
}
