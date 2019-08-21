import * as React from 'react';
import './style.css';

interface IProps {
  text?: string;
}

export function Loading(props: IProps) {
  const [flash, setFlash] = React.useState(false);

  React.useEffect(() => {
    const time = setTimeout(() => {
      setFlash(true);
    }, 300);
    return () => clearTimeout(time);
  }, []);

  if (!flash) {
    return null;
  }

  return (
    <div className='loading'>
      <div className='load4'>
        <div className='loader' />
      </div>
      {
        typeof props.text !== 'undefined'
        && <div className='load-text'>{props.text}</div>
      }
    </div>
  );
}
