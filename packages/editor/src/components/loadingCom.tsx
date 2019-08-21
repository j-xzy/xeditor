import * as React from 'react';
import { advanceOption } from '../util/advanceOption';
import { advanceReducer } from '../util/advanceReducer';
import { pullFeature } from '../util/pullFeature';

interface IProps extends Editor.IWrappedFeatureComponentProps {
  comPath: string;
  placeholder?: React.ReactNode;
}

export const loadingState: Editor.IFeatureState = {
  name: '正在加载...',
  style: {
    width: '300px',
    height: '300px',
    display: 'block'
  }
};

export function loadingReducer(action: Editor.IAction, state = loadingState) {
  switch (action.type) {
    default:
      return state;
  }
}

export function LoadingCom(props: IProps) {
  React.useEffect(() => {
    pullFeature(props.comPath, 10000, (err: string | null, param) => {
      try {
        if (err) {
          props.remove();
        } else {
          let comReducer = advanceReducer(param!.reducer);
          if (props.state) {
            const newState = props.state;
            const rawReducer = comReducer;
            comReducer = function(action: Editor.IAction, state = newState) {
              return rawReducer(action, state);
            };
          }
          // 传入空的event trigger
          props.replace(advanceOption(param!.option), comReducer as any, { trigger: () => { /** */ } }, param!.component, false, false);
        }
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
        props.remove();
      }
    });
  }, []);

  let placeholder = props.placeholder;

  if (typeof placeholder === 'undefined') {
    placeholder = '正在加载...';
  }

  return props.connect(
    <div style={props.style}>
      {placeholder}
    </div>
  );
}

export const loadingOption: Editor.IFeatureOption = {
  resizer: false,
  toolbar: false,
  history: false
};
