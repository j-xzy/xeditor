import { featureConnector } from '@xeditor/core';
import * as React from 'react';
import { advanceReducer } from '../util/advanceReducer';
import { LoadingCom, loadingOption, loadingReducer } from './loadingCom';

export interface IDynamicFeatureProps extends React.Props<any> {
  placeholder: React.ReactNode;
  comPath: string;
  previewStyle?: React.CSSProperties;
}

export function DynamicFeature(props: IDynamicFeatureProps) {
  function PreivewComponent(previewProps: Editor.IPreivewComponentProps) {
    return previewProps.connect(React.Children.only(props.children));
  }

  const preview: Editor.IPreviewArgs = { PreivewComponent, dragImg: new Image() };
  return React.createElement(featureConnector(loadingOption, preview, advanceReducer(loadingReducer) as any)(LoadingCom), { ...props } as any);
}
