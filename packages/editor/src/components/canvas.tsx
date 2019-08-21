import { Canvas as RawCanvas, ICanvasProps } from '@xeditor/core';
import * as React from 'react';
import { appendFont } from '../lib/appendFont';
import { traverser } from '../lib/tool';
import { option as apiOption, reducer as apiReducer } from '../plugins/serverPlugin/apiComp';
import { option as varOption, reducer as varReducer } from '../plugins/varPlugin/varComp';
import { advanceOption } from '../util/advanceOption';
import { enpowerCanvasData } from '../util/enpowerData';
import { boxOption } from './box';

interface IAdCanvasProps extends ICanvasProps {
  getData?: (getData: (noBoxOutline: boolean) => Editor.ICanvaState) => void;
}

export class Canvas extends React.Component<IAdCanvasProps, {}> {
  private _setCanvas!: (data: Editor.ICanvaData) => void;
  private _getData!: () => Editor.ICanvaState;

  constructor(props: IAdCanvasProps) {
    super(props);
    this.setCanvas = this.setCanvas.bind(this);
    this.getData = this.getData.bind(this);

    if (props.setCanvas) {
      props.setCanvas(this.setCanvas);
    }
    if (props.getData) {
      props.getData(this.getData);
    }
  }

  public render() {
    const { setCanvas, getData, ...p } = this.props;
    return <RawCanvas {...p} getData={(callback) => this._getData = callback} setCanvas={(callback) => this._setCanvas = callback} />;
  }

  private setCanvas(data: Editor.ICanvaData) {
    traverser(data.root, {
      com: {
        enter(node) {
          if (node.state.property && node.state.property.fontFamily) {
            // 加入字体
            appendFont(node.state.property.fontFamily);
          }
        }
      },
      box: {
        enter(node) {
          node.option = { ...node.option, ...advanceOption(boxOption) };
        }
      }
    });
    data.hidden.forEach((root) => {
      traverser(root, {
        default: {
          enter(node) {
            if (node.option.group === '变量') {
              (node as any).reducer = varReducer;
              (node as any).option = varOption;
            }
            if (node.option.group === '服务') {
              (node as any).reducer = apiReducer;
              (node as any).option = apiOption;
            }
          }
        }
      });
    });
    enpowerCanvasData(data.root);
    this._setCanvas(data);
  }

  private getData(noBoxOutline = false) {
    const data = this._getData();

    traverser(data.root, {
      root: {
        enter(node) {
          node.option = { path: node.option.path, box: node.option.box, group: node.option.group };
        }
      },
      com: {
        enter: (node) => {
          const opt: any = { path: node.option.path, box: node.option.box, group: node.option.group };
          if (node.option.property) {
            opt.__uploads = this.getUploads(node.option.property, 'property');
          }
          node.option = opt;
        }
      },
      box: {
        enter: (node) => {
          if (noBoxOutline) {
            (node.state as any).style = { ...node.state.style, outline: '' };
          }
          const opt: any = { path: node.option.path, box: node.option.box, group: node.option.group };
          if (node.option.property) {
            opt.__uploads = this.getUploads(node.option.property, 'property');
          }
          node.option = opt;
        }
      }
    });

    data.hidden.forEach((root) => {
      traverser(root, {
        default: {
          enter(node) {
            node.option = { group: node.option.group };
          }
        }
      });
    });

    return data;
  }

  private getUploads(property: Editor.IWidget, name: string) {
    const uploads: string[] = [];
    for (const k in property) {
      if (property.hasOwnProperty(k)) {
        if (property[k].type === 'upload') {
          uploads.push(`${name}.${k}`);
        }
        if (property[k].type === 'collapse') {
          uploads.push(...this.getUploads((property[k] as Editor.ICollapse).items, `${name}.${k}`));
        }
      }
    }
    return uploads;
  }
}
