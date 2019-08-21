import { Loading } from '@/base/loading';
import { ApiComp, Box, DynamicFeature, VarComp } from '@xeditor/editor';
import { Collapse } from 'lite-ui';
import * as React from 'react';
import './style.styl';

export function CompPanel() {
  const compList = window.useMappedState((state) => state.componentList);
  return (
    <div className='comp-panel'>
      <Common />
      {
        compList.map(({ type, comps }) => (
          <Collapse title={type} key={type}>
            <div className='comp-group'>
              {
                comps.map(({ name, path, img }) => (
                  <div className='comp' key={path}>
                    <DynamicFeature comPath={path} placeholder={<Loading />}>
                      <div className='comp-preview' style={{ backgroundImage: `url(${img})` }}></div>
                    </DynamicFeature>
                    <div className='comp-name'>{name}</div>
                  </div>
                ))
              }
            </div>
          </Collapse>
        ))
      }
    </div>
  );
}

function Common() {
  return (
    <Collapse title='通用'>
      <div className='common-group'>
        <ApiComp>
          <i className='iconfont icon-api' title='API' />
        </ApiComp>
        <VarComp>
          <i className='iconfont icon-var' title='变量' />
        </VarComp>
        <Box>
          <i className='iconfont icon-box' title='容器' />
        </Box>
      </div>
    </Collapse>
  );
}
