import { cls } from '@/lib/util';
import * as React from 'react';
import './style.styl';

interface IProps extends React.Props<any> {
  style?: React.CSSProperties;
  className?: string;
}

type ITemplate = ReturnType<typeof createTemplate>;

type ILayout = ITemplate & {
  Content: ITemplate;
  Header: ITemplate;
  Footer: ITemplate;
  Sider: ITemplate;
  Middle: ITemplate;
  Float: ITemplate;
};

function createTemplate(prefix: string) {
  function Template(props: IProps) {
    return (
      <div
        className={cls(prefix, props.className)}
        style={props.style}
      >
        {props.children}
      </div>
    );
  }

  return Template;
}

export const Layout = createTemplate('layout') as ILayout;

Layout.Content = createTemplate('layout-content');
Layout.Header = createTemplate('layout-header');
Layout.Footer = createTemplate('layout-footer');
Layout.Sider = createTemplate('layout-sider');
Layout.Middle = createTemplate('layout-middle');
Layout.Float = createTemplate('layout-float');
