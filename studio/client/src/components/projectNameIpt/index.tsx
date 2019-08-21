import { Input } from 'lite-ui/lib/input';
import * as React from 'react';

export function ProjectNameIpt() {
  const projectName = window.useMappedState((state) => state.projectName);
  return (
    <Input placeholder='项目名称' value={projectName} onChange={(e) => window.commit('projectName', e.target.value)} />
  );
}
