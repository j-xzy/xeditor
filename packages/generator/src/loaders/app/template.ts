const template = `import React from 'react';
import Root from './layout/root';

function App() {
  return <Root></Root>
}

export default App;
`;

export function appTemplateLoader() {
  return template;
}
