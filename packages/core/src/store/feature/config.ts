const defaultBearing = {
  top: '0',
  left: '0',
  right: '0',
  bottom: '0'
};

const defaultGeneral: Editor.IGeneral = {
  float: 'none',
  display: 'block',
  position: 'relative',
  visibility: 'visible',
  ...defaultBearing
};

const defaultDimension: Editor.IDimension = {
  margin: '0',
  padding: '0',
  width: '100px',
  height: '100px'
};

export const defaultBaseStyle: Editor.IBaseStyle = { ...defaultDimension, ...defaultGeneral };

export const defaultOption: Required<Editor.IFeatureOption> = {
  resizer: true,
  toolbar: true,
  container: false,
  history: true,
  group: '画布'
};
