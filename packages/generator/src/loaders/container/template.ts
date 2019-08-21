const template = `  import React from 'react';
import update from 'immutability-helper';
function Comp(props) {
  return <CompReducer.component >{props.children}</ CompReducer.component>;
}

export default Comp;
`;

export function containerTemplateLoader() {
  return template;
}
