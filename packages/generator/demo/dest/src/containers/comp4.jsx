import { useStore } from '../../packages/annie';
import CompReducer from "../components/property";
import React from 'react';
import update from 'immutability-helper';

function Comp(props) {
  const {
    state,
    emit
  } = useStore([4]);
  const style = update(state[4]['style'], {});
  const data = state[4]['data'];
  const property = update(state[4]['property'], {});
  const {
    data: _data,
    property: _property,
    style: _style,
    ...rest
  } = { ...state[4]
  };
  return <CompReducer.component style={style} data={data} property={property} {...rest} trigger={() => {}}>{props.children}</CompReducer.component>;
}

export default Comp;