import { JsonEditor } from '@/components/jsonEditor';
import { useDebounce } from '@/hooks/useDebounce';
import { useDataDriver, useFeatureDispatch, useFeatureState } from '@xeditor/editor';
import { Expression } from '@xeditor/expression';
import { Radio } from 'lite-ui';
import * as React from 'react';
import './style.styl';

const RadioGroup = Radio.Group;

// tslint:disable-next-line: no-default-export
export default React.memo(() => {
  const state = useFeatureState(React.useCallback(
    (s) => ({ data: s.state.data, id: s.state.id, option: s.option }), [])
  );
  const dispatch = useFeatureDispatch();
  const driver = useDataDriver();

  const stringify = React.useCallback((data) => {
    let value = JSON.stringify({}, null, '\t');
    try {
      value = JSON.stringify(data, null, '\t');
    } catch (e) {
      //
    }
    return value;
  }, []);

  const handleRadioChange = React.useCallback((t: string) => {
    const type = t === 'static' ? 'delete' : 'new';
    driver.dispatch(type, {
      id: state!.id,
      property: 'data'
    });
  }, [driver, state!.id]);

  const handleEditorChange = useDebounce((value) => {
    if (!dispatch) {
      return;
    }
    try {
      const data = JSON.parse(value);
      dispatch({ type: 'data', data });
    } catch (e) {
      //
    }
  }, 300);

  if (!state || !dispatch) {
    return null;
  }

  if (typeof state.data === 'undefined') {
    return null;
  }

  // 画布上元素的数据才能绑定,api与变量不行
  const showBinded = state.option.group === '画布';

  const binded = driver.getBinded(state.id!, 'data');

  return (
    <div className='data-panel'>
      {
        showBinded &&
        <RadioGroup
          value={binded ? 'exp' : 'static'}
          className='data-panel-tool'
          onChange={handleRadioChange}
        >
          <Radio value='static'>静态</Radio>
          <Radio value='exp'>表达式</Radio>
        </RadioGroup>
      }
      {
        binded
          ? <Expression className='data-expre' flag={`binded-${state.id}-data`} getFeatureById={driver.getFeatureById} nodes={binded.getChildren() as any} />
          : <div className='data-static-panel'>
            <JsonEditor className='json-editor' value={stringify(state.data)} onChange={handleEditorChange} />
          </div>
      }
    </div>
  );
});
