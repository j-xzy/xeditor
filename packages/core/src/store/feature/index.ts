import { debounce, getUid } from '../../lib/tool';
import { COPY } from '../store';
import { TreeNode } from '../tree';
import { defaultOption } from './config';

export class Feature extends TreeNode implements Editor.IFeature {

  //#region 成员变量
  private neededUpDateTool = false;
  private readonly id: number;
  private readonly option!: Required<Editor.IFeatureOption>;
  private readonly store: Editor.IStore<Editor.IFeatureState>;
  private dom: HTMLElement | undefined; // 真实dom
  private isCopy = false; // 此feature是否是被copy出的
  private ownProps: any;
  private error = false;
  //#endregion

  constructor(option: Editor.IFeatureOption, store: Editor.IStore<Editor.IFeatureState>, props: any, private readonly featureStore: Editor.IFeatureStore, private readonly featureComponentClass?: Editor.IFeatureComponentClass) {
    super();

    this.id = getUid();
    this.store = store;
    this.ownProps = props;

    // 与默认值合并
    this.option = Object.assign({}, defaultOption, option);
    this.updateSize = debounce(this.updateSize, 0);
    this.updatePosition = debounce(this.updatePosition, 0);
  }

  //#region 属性

  get Error() {
    return this.error;
  }

  set Error(error: boolean) {
    this.error = error;
  }

  get OwnProps() {
    return this.ownProps;
  }

  get Store() {
    return this.store;
  }

  get Id() {
    return this.id;
  }

  get FeatureComponentClass(): Editor.IFeatureComponentClass | undefined {
    return this.featureComponentClass;
  }

  get Name() {
    return this.store.getState().name;
  }

  get Container() {
    return this.option.container;
  }

  get Resizer() {
    return this.option.resizer;
  }

  get Toolbar() {
    return this.option.toolbar;
  }

  get BaseStyle() {
    return this.store.getState().style;
  }

  get ComputedStyle() {
    if (!this.dom) {
      return null;
    }
    return window.getComputedStyle(this.dom, null);
  }

  get BoundingClientRect() {
    if (!this.dom) {
      return null;
    }
    return this.dom.getBoundingClientRect();
  }

  get Option() {
    return this.option;
  }

  get IsCopy() {
    return this.isCopy;
  }

  set IsCopy(isCopy: boolean) {
    this.isCopy = isCopy;
  }

  get HasDom() {
    return !!this.dom;
  }

  get NeededUpDateTool() {
    return this.neededUpDateTool;
  }

  set NeededUpDateTool(needed: boolean) {
    this.neededUpDateTool = needed;
  }

  get State() {
    return this.store.getState() as Editor.IFeatureState;
  }

  set State(state: Editor.IFeatureState) {
    this.store.dispatch({ type: COPY, data: state });
  }

  get FeatureStore() {
    return this.featureStore;
  }

  //#endregion

  //#region action
  public updateSize(width: string, height: string) {
    this.store.dispatch({ type: 'style', data: { ...this.store.getState().style, width, height } });
  }

  public updatePosition(position: Editor.IPosition) {
    this.store.dispatch({ type: 'style', data: { ...this.store.getState().style, ...position } });
  }

  public updateBaseStyle(style: Editor.IBaseStyle) {
    this.store.dispatch({ type: 'style', data: { ...style } });
  }
  //#endregion

  public setDom(dom: HTMLElement) {
    this.dom = dom;
  }
}
