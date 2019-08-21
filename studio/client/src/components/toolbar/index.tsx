import * as React from 'react';
import './style.styl';

type IToobar = ((props: React.Props<any>) => JSX.Element) & {
  Tool: typeof Tool;
};

interface IToolProps {
  font: string;
  name?: string;
  title?: string;
  highlight?: boolean;
  onClick?: () => void;
}

const Tool = function(props: IToolProps) {
  return (
    <div className={'tool ' + `${props.highlight ? 'high-light' : ''}`} onClick={props.onClick}>
      <i className={`iconfont ${props.font}`} title={props.title} />
      {props.name && <span className='tool-name'>{props.name}</span>}
    </div>
  );
};

export const Toolbar = function(props: React.Props<any>) {
  return (
    <div className='toolbar'>
      {props.children}
    </div>
  );
} as IToobar;

Toolbar.Tool = Tool;
