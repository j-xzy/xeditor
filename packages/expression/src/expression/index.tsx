import { AutoWidthInput } from 'lite-ui/lib/autoWidthInput';
import { Input } from 'lite-ui/lib/input';
import { Select } from 'lite-ui/lib/select';
import * as React from 'react';
import { ChooseArrow } from '../chooseArrow';
import { IWidget, styleDic } from '../dic';
import { useDebounce } from '../useDebounce';
import { useFtrSubscribe } from '../useFtrSubscribe';
import './style.styl';
import { validExp } from './validExp';

type IDispatch<T> = (type: T, data?: T extends 'value' ? { id: number, property: string } | string : never) => void;

export type IExpression = string | ICompExpression;

interface ICompExpression {
  id: number;
  property: string;
}

interface IProps {
  flag: string;
  className?: string;
  nodes: Array<{
    value: IExpression;
    dispatch: IDispatch<'value' | '__delete'>;
    subscribe(listener: () => void): void;
    unSubscribe(listener: () => void): void;
  }>;
  placeholder?: string;
  getFeatureById: (id: number) => Editor.IFeature | null;
  selectOpts?: Array<{ name: string; value: any }>;
}

export function Expression(props: IProps) {
  const exps = props.nodes;
  const foucsIdx = React.useRef(typeof exps[0] !== 'undefined' ? 0 : -1);
  const [, forceUpdate] = React.useState({});
  const [hasError, setError] = React.useState(false);
  const [expand, setExpand] = React.useState(false);

  const vaild = useDebounce((value) => {
    validExp(value).then((result) => {
      if (typeof result !== 'string') {
        setError(result.err);
      } else {
        // tslint:disable-next-line: no-console
        console.error(result);
      }
    });
  }, 500);

  const ftrs: Editor.IFeature[] = [];
  exps.forEach(({ value }) => {
    if (isCompExpression(value)) {
      const ftr = props.getFeatureById(value.id);
      ftr && ftrs.push(ftr);
    }
  });

  useFtrSubscribe(ftrs);

  React.useEffect(() => {
    const updata = () => forceUpdate({});
    exps.forEach((exp) => {
      exp.subscribe(updata);
    });
    return () => {
      exps.forEach((exp) => {
        exp.unSubscribe(updata);
      });
    };
    // 必须每次update时重新绑定监听,因为回退时node会发生变化
  });

  React.useEffect(() => {
    vaild(exps.map(({ value }) => value));
  });

  const handleChoose = React.useCallback((state: Editor.IFeatureState | null) => {
    if (state === null) {
      return;
    }
    if (foucsIdx.current === -1 || typeof state.id === 'undefined') {
      return;
    }

    const exp = exps[foucsIdx.current];
    exp && exp.dispatch('value', { id: state.id, property: '' });
  }, [exps]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = (e.target as HTMLInputElement);
    if (e.key === 'Backspace' && target.selectionStart === 0 && target.selectionEnd === 0) {
      const exp = exps[foucsIdx.current];
      return exp && exp.dispatch('__delete');
    }
  }, [exps]);

  return (
    <div className={`expre ${typeof props.className === 'undefined' ? '' : props.className}`}>
      <ChooseArrow flag={props.flag} onChoose={handleChoose} />
      <div className={`expre ${hasError ? 'expre-error' : ''}`}>
        {
          props.selectOpts && props.selectOpts.length > 0 &&
          <Select
            className='expre-select'
            expand={expand}
            value='default'
            onBlur={() => setExpand(false)}
            onDownClick={setExpand}
            onChange={(e) => exps[foucsIdx.current] && exps[foucsIdx.current].dispatch('value', { id: -1, property: e })}
          >
            {
              props.selectOpts.map(({ value, name }) => <Select.Option key={name} value={value} >{name}</Select.Option>)
            }
          </Select>
        }
        {
          exps.map((exp, idx) => {
            if (isCompExpression(exp.value)) {
              if (exp.value.id === -1) {
                // 等于-1为一个其它变量
                const property = exp.value.property;
                const item = (props.selectOpts || []).find((e) => e.value === property);
                return <span key={idx} className='expre-other-var' >{item ? item.name : property}</span>;
              }

              const feature = props.getFeatureById(exp.value.id);
              if (!feature) {
                return null;
              }

              // 未选择属性
              if (exp.value.property === '' && feature.Option.group === '画布') {
                return renderExpreCompSelect(exp, feature, props.getFeatureById, idx);
              }

              // 属性已经选择完成
              return renderExpreCompDone(exp, feature, idx);
            }

            // 默认输入框
            if (exps.length === 1) {
              return (
                <Input
                  key={idx}
                  placeholder={props.placeholder}
                  className='expre-ipt'
                  value={exp.value}
                  onFocus={() => foucsIdx.current = idx}
                  onKeyDown={(e) => handleKeyDown(e)}
                  onChange={(e) => exp.dispatch('value', e.target.value)}
                />);
            }

            // 组件表达式两侧的输入框
            return (
              <AutoWidthInput
                key={idx}
                value={exp.value}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => exp.dispatch('value', e.target.value)}
                onFocus={() => foucsIdx.current = idx}
                className='expre-auto-ipt'
              />);
          })
        }
        {
          props.selectOpts && props.selectOpts.length > 0 &&
          <div className='expre-down-wrapper' onClick={() => setExpand(!expand)}>
            <span className='expre-down'></span>
          </div>
        }
      </div>
    </div>
  );
}

function renderExpreCompSelect(exp: IProps['nodes'][0], feature: Editor.IFeature, getFeatureById: (id: number) => Editor.IFeature | null, idx: number) {
  const { id, property } = exp.value as ICompExpression;

  const Opts: Array<React.ReactElement<any>> = [];

  for (const k in feature.State.style) {
    const pname = typeof styleDic[k] === 'undefined' ? k : styleDic[k];
    Opts.push(<Select.Option value={`style.${k}`} key={k}>{pname}</Select.Option>);
  }

  if (typeof feature.State.property !== 'undefined') {
    const dic = (feature.Option as any).property as IWidget;
    for (const k in feature.State.property) {
      const pname = typeof dic[k] === 'undefined' ? k : dic[k].name;
      Opts.push(<Select.Option value={`property.${k}`} key={k}>{pname}</Select.Option>);
    }
  }

  if (typeof feature.State.data !== 'undefined') {
    Opts.push(<Select.Option value='data' key={'_data'}>数据</Select.Option>);
  }

  if (typeof getFeatureById((exp.value as ICompExpression).id) === 'undefined') {
    return null;
  }

  // 选择属性
  return (
    <div key={`${idx}-select`} className='expre-comp'>
      <span className='expre-comp-name'>{getFeatureById((exp.value as ICompExpression).id)!.State.name}</span>
      <span className='expre-comp-dot'>.</span>
      <Select className='expre-comp-select' value={property} onChange={(e) => exp.dispatch('value', { id, property: e })}>
        {Opts}
      </Select>
    </div>
  );
}

function renderExpreCompDone(exp: IProps['nodes'][0], feature: Editor.IFeature, idx: number) {
  const [type, name] = (exp.value as ICompExpression).property.split('.');
  let dicMap: any = styleDic;
  if (type === 'property') {
    dicMap = ((feature.Option as any).property as IWidget);
  }
  let cName = name;

  if (typeof dicMap[name] !== 'undefined') {
    cName = type === 'property' ? dicMap[name].name : dicMap[name];
  }
  if (type === 'data') {
    cName = '数据';
  }

  const group = feature.Option.group;

  return (
    <div key={`-${idx}-done`} className='expre-comp expre-comp-bck'>
      <span className='expre-comp-name'>{feature.State.name}</span>
      {
        (exp.value as ICompExpression).property !== '' && group !== '变量' && group !== '服务'
        &&
        <>
          <span className='expre-comp-dot'>.</span>
          <span className='expre-comp-property'>
            {cName}
          </span>
        </>
      }
    </div>
  );
}

function isCompExpression(exp: IExpression): exp is ICompExpression {
  return typeof exp !== 'string';
}
