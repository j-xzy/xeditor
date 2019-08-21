import * as React from 'react';
import { useDataDriver } from '../src';

export function Console() {
  const d = useDataDriver();
  const [state, setState] = React.useState(d.getDataDriverState());
  return (
    <div>
      <button onClick={() => setState(d.getDataDriverState())}>刷新</button>
      <textarea cols={80} rows={50} value={JSON.stringify(state)} onChange={() => {/** */ }}></textarea>
    </div>
  );
}
