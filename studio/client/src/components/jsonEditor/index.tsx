import * as ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/dracula';
import * as React from 'react';

interface IProps {
  value?: string;
  style?: React.CSSProperties;
  className?: string;
  onChange?: (value: string) => void;
}

export function JsonEditor(props: IProps) {
  const elRef: React.MutableRefObject<null | HTMLDivElement> = React.useRef(null);
  const editor: React.MutableRefObject<null | ace.Editor> = React.useRef(null);

  const handleChange = React.useCallback(() => {
    if (props.onChange && editor.current) {
      props.onChange(editor.current.getValue());
    }
  }, [props.onChange]);

  React.useEffect(() => {
    if (!elRef.current) {
      return;
    }
    editor.current = ace.edit(elRef.current);
    editor.current.getSession().setMode('ace/mode/json');
    editor.current.setTheme('ace/theme/dracula');
    editor.current.$blockScrolling = Infinity;

    return () => {
      if (editor.current) {
        editor.current.destroy();
        editor.current.off('change', handleChange);
        editor.current = null;
      }
    };
  }, []);

  React.useEffect(() => {
    if (editor.current) {
      editor.current && editor.current.on('change', handleChange);
      return () => {
        editor.current && editor.current.off('change', handleChange);
      };
    }
  }, [props.onChange]);

  React.useEffect(() => {
    if (editor.current && editor.current.getValue() !== props.value) {
      editor.current.setValue(props.value || '');
    }
  }, [props.value]);

  return (<div ref={elRef} className={props.className} style={props.style}></div>);
}
