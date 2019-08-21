export const initialState = {
  projectName: '项目名称',
  openCanvasLoadingId: -1,
  saveCanvasLoadingId: -1,
  widget: 'none' as 'none' | 'style' | 'property' | 'event' | 'data',
  widgetPs: JSON.parse(window.sessionStorage.getItem('widgetPs')!) || [310, 50] as [number, number],
  componentList: [] as IModel.IComponentList,
  selectedFtr: null as Editor.IFeatureInfo | null,
  mask: null as string | null,
  progress: false
};
