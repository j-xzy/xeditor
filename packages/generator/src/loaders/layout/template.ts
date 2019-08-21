const template = `import React from 'react';
import update from 'immutability-helper';
function Box(props) {
  return <div>{props.children}</div>
}
export default Box;
`;

export function layoutTemplateLoader() {
  return template;
}
