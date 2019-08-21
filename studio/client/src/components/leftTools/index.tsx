import { Toolbar } from '@/components/toolbar';
import * as React from 'react';
const { Tool } = Toolbar;

interface IProps {
  getData: ((noBoxOutline: boolean) => Editor.ICanvaState) | null;
}

export function LeftTools(props: IProps) {
  const downloadClickHandler = React.useCallback(() => {
    props.getData && window.dispatch('downloadProject', props.getData(true));
  }, [props.getData]);

  return (
    <Toolbar>
      <Tool font='icon-download' title='下载' onClick={downloadClickHandler} />
      <Tool font='icon-rule' title='标尺' />
    </Toolbar>
  );
}
