import * as React from 'react';
import { useEvent } from '../src';

export function Console(props: { style: React.CSSProperties }) {
  const evt = useEvent();
  const [, setState] = React.useState({});
  React.useEffect(() => {
    const update = () => setState({});
    const id = setInterval(() => update(), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <textarea onChange={() => {/* */ }} value={JSON.stringify(evt.getEvenState())} style={props.style} cols={50} rows={25}></textarea>
  );
}
