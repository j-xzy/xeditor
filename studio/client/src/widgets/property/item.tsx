import * as React from 'react';

interface IProps extends React.Props<any> {
  name: string;
}

export function Item(props: IProps) {
  return (
    <div className='property-item'>
      <span className='property-name'>{props.name}：</span>
      <div className='property-content'>{props.children}</div>
    </div>
  );
}
