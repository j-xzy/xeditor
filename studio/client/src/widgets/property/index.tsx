import { extractUrl, getUrlParam } from '@/lib/util';
import { IDataDriverPluginState, useDataDriver } from '@xeditor/editor';
import { Expression } from '@xeditor/expression';
import { Checkbox, Collapse, Input, message, Radio, Select, Slider, Switch, Upload } from 'lite-ui';
import * as React from 'react';
import { Item } from './item';
import './style.styl';

interface IProps {
  dic: Editor.IWidget;
  state: { [p: string]: any };
  dispatch: (p: { type: string, data: any }) => void;
  type?: 'style' | 'property';
  ftrId?: number;
}

type IRenderPropertyProps = Omit<IProps, 'type'> & { fullNames: string[] };

const RadioGroup = Radio.Group;
const SelectOpt = Select.Option;

export function PropertyWidget(props: IProps) {
  const driver = useDataDriver();

  return (
    <div className='property-panel-wrapper'>
      {
        renderProperty({
          ftrId: props.ftrId,
          fullNames: [props.type || ''],
          dispatch: props.dispatch,
          dic: props.dic,
          state: props.state
        }, driver)
      }
    </div>
  );
}

function renderProperty(props: IRenderPropertyProps, driver: IDataDriverPluginState) {
  return (
    <div className='property-panel'>
      {
        Object.keys(props.state).map((property, idx) => {
          const widget = props.dic[property];
          if (!widget) {
            return null;
          }

          if (widget.type === 'collapse') {
            return (
              <Collapse defaultCollapse={true} key={idx} title={widget.name} iconPosition='right'>
                {
                  renderProperty({
                    ftrId: props.ftrId,
                    fullNames: [...props.fullNames, property],
                    dispatch: props.dispatch,
                    dic: widget.items,
                    state: props.state[property]
                  }, driver)
                }
              </Collapse>
            );
          }

          const fullName = `${props.fullNames.map((s) => s).join('.')}.${property}`;
          let binded: ReturnType<typeof driver.getBinded>;
          if (typeof props.ftrId !== 'undefined') {
            binded = driver.getBinded(props.ftrId, `${fullName}`);
          }

          return (
            <div className='property-item-wrapper' key={property}>
              <Item name={widget.name}>
                {
                  binded
                    ? <Expression flag={`binded-${props.ftrId}-${fullName}`} getFeatureById={driver.getFeatureById} nodes={binded.getChildren() as any} />
                    : renderItem(widget, props.state[property], (value: any) => props.dispatch({ type: `${props.fullNames.map((s) => s).join('-')}-${property}`, data: value }))
                }
              </Item>
              {
                widget.binded !== false && widget.type !== 'upload' &&
                <i
                  title='绑定'
                  className={`iconfont icon-bind ${binded ? 'binding' : ''}`}
                  onClick={
                    () => binded
                      ? driver.dispatch('delete', { id: props.ftrId, property: `${fullName}` })
                      : driver.dispatch('new', { id: props.ftrId, property: `${fullName}` })
                  }
                />
              }
            </div>
          );
        })
      }
    </div>
  );
}

function renderItem(widget: Editor.IWidget['value'], value: any, update: any) {
  if (widget.type === 'input') {
    return <Input value={value} onChange={(e) => update(e.target.value)} />;
  }

  if (widget.type === 'slider') {
    return <Slider style={{ width: '161px' }} value={value} {...widget.config} onChange={update} />;
  }

  if (widget.type === 'checkbox') {
    return widget.config.map((info) =>
      <Checkbox
        key={info.name}
        checked={value.includes(info.value)}
        onChange={(checked) => {
          if (checked) {
            update([...value, info.value]);
          } else {
            const idx = value.indexOf(info.value);
            if (idx > -1) {
              const values = [...value];
              values.splice(idx, 1);
              update(values);
            }
          }
        }}>
        {info.name}
      </Checkbox>);
  }

  if (widget.type === 'radio') {
    return (
      <RadioGroup value={value} onChange={update}>
        {
          widget.config.map((info) =>
            <Radio key={info.name} value={info.value}>
              {info.name}
            </Radio>
          )
        }
      </RadioGroup>
    );
  }

  if (widget.type === 'select') {
    return (
      <Select value={value} onChange={update}>
        {
          widget.config.map((info) =>
            <SelectOpt key={info.name} value={info.value}>
              {info.name}
            </SelectOpt>
          )
        }
      </Select>
    );
  }

  if (widget.type === 'switch') {
    return (
      <Switch checked={value === widget.config.on} onChange={(checked) => {
        if (checked) {
          update(widget.config.on);
        } else {
          update(widget.config.off);
        }
      }} />
    );
  }

  if (widget.type === 'color') {
    return <input type='color' value={value} onChange={(e) => update(e.target.value)} />;
  }

  if (widget.type === 'upload') {
    if (typeof value === 'undefined' || value === '' || value === '""' || value === '\'\'' || value === 'url()') {
      return <Upload
        label='选择图片'
        onchange={async (files) => {
          if (!files) {
            return;
          }
          window.commit('progress', true);

          const formdata = new FormData();
          formdata.append('image', files[0], files[0].name);

          const apiData = await window.Post('/upload?id', {
            querys: {
              id: getUrlParam('id') || ''
            },
            body: formdata
          });

          window.commit('progress', false);

          if (apiData.code === 0) {
            return message.error('图片上传失败');
          }

          update(apiData.result.urls[0]);
        }} />;
    }
    let url = extractUrl(value);
    if (!url) {
      url = value;
    }
    return (
      <div className='preview-image' style={{ backgroundImage: `url(${url})` }}>
        <i className='iconfont icon-close' onClick={() => update('')} />
      </div>
    );
  }

  return null;
}
