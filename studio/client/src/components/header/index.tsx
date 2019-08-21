import { Button } from 'lite-ui/lib/button';
import { Input } from 'lite-ui/lib/input';
import * as React from 'react';
import './style.styl';

// const logo = require('@/assets/images/logo.png');

interface IProps {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  getData: ((noBoxOutline: boolean) => Editor.ICanvaState) | null;
}

export function Header(props: IProps) {
  const projectName = window.useMappedState(React.useCallback((state) => state.projectName, []));

  const preivewClickHandler = React.useCallback(() => {
    props.getData && window.dispatch('previewProject', props.getData(true));
  }, [props.getData]);

  const saveClickHandler = React.useCallback(() => {
    props.getData && window.dispatch('saveCanvas', { canvas: props.getData(false), silent: false });
  }, [props.getData]);

  return (
    <div className='header'>
      {/* <img className='logo' src={logo} /> */}
      <span className='header-title'>简绘</span>
      <Input className='project-name-input' placeholder='项目名称' value={projectName} onChange={(e) => window.commit('projectName', e.target.value)} />
      <div className='header-tools'>
        <Button className='header-tool iconfont icon-eye' onClick={preivewClickHandler}> 预览</Button>
        <Button className='header-tool iconfont icon-undo' onClick={props.undo}>撤销</Button>
        <Button className='header-tool iconfont icon-recover' onClick={props.redo}>恢复</Button>
        <Button className='header-tool iconfont icon-clear' onClick={props.clear}>清空画布</Button>
        <Button className='header-tool iconfont icon-save' onClick={saveClickHandler}>保存</Button>
        <Button className='header-tool iconfont icon-exit' onClick={() => window.open('/home', '_self')}>退出</Button>
      </div>
    </div>
  );
}
