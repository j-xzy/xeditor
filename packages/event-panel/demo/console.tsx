import { useEvent } from '@xeditor/plugin-event';
import * as React from 'react';

export function Console(props: { style: React.CSSProperties }) {
  const evt = useEvent();
  const [, forceUpdate] = React.useState({});

  React.useEffect(() => {
    const update = () => forceUpdate({});
    const id = setInterval(() => update(), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <textarea onChange={() => {/* */ }} value={JSON.stringify(evt.getEvenState())} style={props.style} cols={50} rows={25}></textarea>
  );
}
