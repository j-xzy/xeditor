import * as React from 'react';
import './style.styl';

interface IProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DoubleInput = React.memo(RawDoubleInput, (pre, next) => pre.value === next.value);

function RawDoubleInput(props: IProps) {
  const iptRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);
  const [disabled, setDisabled] = React.useState(true);
  return (
    <div className='layer-dbipt'>
      <p className='layer-dbipt-p layer-ipt' hidden={!disabled} onDoubleClick={() => { setDisabled(!disabled); setTimeout(() => iptRef.current!.focus(), 0); }} >
        {props.value}
      </p>
      <input className='layer-dbipt-ipt layer-ipt' onChange={props.onChange} hidden={disabled} ref={iptRef} type='text' tabIndex={0} value={props.value} onBlur={() => setDisabled(true)} />
    </div>
  );
}
