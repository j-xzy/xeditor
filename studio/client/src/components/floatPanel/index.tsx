import { useDebounce } from '@/hooks/useDebounce';
import { Draggable } from 'rc-dragger';
import * as React from 'react';
import './style.styl';

interface IProps extends React.Props<any> {
  title?: string;
  initPs?: [number, number];
  onCloseClick?: () => void;
  onEndMove?: (ps: [number, number]) => void;
}

export function FloatPanel(props: IProps) {
  const initPs = props.initPs || [0, 0];
  const handleMove = useDebounce((ps: [number, number]) => {
    props.onEndMove && props.onEndMove(ps);
  }, 300);

  return (
    <Draggable handle='.dragHandle' initPs={props.initPs} onMove={handleMove}>
      <div className='float-panel' style={{ transform: `translate(${initPs[0]}px, ${initPs[1]}px)` }}>
        <div className='dragHandle'>
          <span className='float-panel-title'>{props.title}</span>
          <i className='iconfont icon-close' onClick={props.onCloseClick} />
        </div>
        {props.children}
      </div>
    </Draggable>
  );
}
