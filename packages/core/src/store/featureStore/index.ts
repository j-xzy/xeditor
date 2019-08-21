import { EvtEmitter } from 'evt-emit';
import { inject, injectable } from 'inversify';
import { featureAdvance } from '../../components/feature';
import { FeatureRoot, option as rootOption, reducer as rootReducer } from '../../components/featureRoot';
import { EventType } from '../../lib/common';
import { Tree } from '../tree';
import { TYPES } from '../types';

@injectable()
export class FeatureStore extends Tree implements Editor.IFeatureStore {
  private lastSelectedFeature: Editor.IFeature | null = null; // 上一次的selectedFeature

  private store!: Editor.IStore<Editor.IFeatureStoreState>;

  private isHidden = false;
  //#endregion

  // 注入工厂函数
  constructor(
    @inject(TYPES.FeatureFactory) private featureFactory: Editor.ICreateFeature
  ) {
    super();
  }

  //#region 属性
  get HoverFeature() {
    return this.store.getState().hoverFeature;
  }

  get SelectedFeature() {
    return this.store.getState().selectedFeature;
  }

  get InsertedAimsFeature() {
    return this.store.getState().insertedAimsFeature;
  }

  get DragEnterFeature() {
    return this.store.getState().dragEnterFeature;
  }

  get IsMoving() {
    return this.store.getState().isMoving;
  }

  get Store() {
    return this.store;
  }

  set Store(store: Editor.IStore<Editor.IFeatureStoreState>) {
    this.store = store;
  }

  get LastSelectedFeature() {
    return this.lastSelectedFeature;
  }

  set IsHidden(isHidden: boolean) {
    this.isHidden = isHidden;
  }

  get IsHidden() {
    return this.isHidden;
  }

  //#endregion

  //#region action

  public removeNode(node: Editor.IFeature) {
    this.store.dispatch({ type: 'delete', data: node });
    super.removeNode(node);
  }

  public replaceNodeNoDispatchDelete(des: Editor.IFeature, newNode: Editor.ITreeNode) {
    const { FirstChild, Parent, Predecessor, Successor } = des;
    super.removeNode(des);

    if (FirstChild) {
      this.insertAsFirstChild(newNode, FirstChild);
    }

    if (!Parent) {
      this.insertAsRoot(newNode);
      return;
    }

    if (Predecessor) {
      this.insertAsSuccessor(Predecessor, newNode);
    } else if (Successor) {
      this.insertAsPredecessor(Successor, newNode);
    } else {
      this.insertAsFirstChild(Parent, newNode);
    }
  }

  public refreshTools() {
    this.store.dispatch({ type: '__refresh', data: null });
  }

  public createFeature(option: Editor.IFeatureOption, reducer: Editor.IReducer<Editor.IFeatureState>, props: any, FeatureComponentClass?: Editor.IFeatureComponentClass): Editor.IFeature {
    return this.featureFactory(option, reducer, props, this, FeatureComponentClass);
  }

  public updateIsMoving(isMove: boolean) {
    this.store.dispatch({ type: 'isMoving', data: isMove });
  }

  public updateHoverFeature(feature: Editor.IFeature) {
    this.store.dispatch({ type: 'hoverFeature', data: feature });
  }

  public updateSelectedFeature(ftr: Editor.IFeature | null) {
    this.lastSelectedFeature = this.store.getState().selectedFeature;

    this.store.dispatch({ type: 'selectedFeature', data: ftr });
    const selectedFeature = this.store.getState().selectedFeature;

    // 若是根节点或为null则解除<Control />中的store绑定
    if (selectedFeature === this.Root || selectedFeature === null) {
      EvtEmitter.Instance.emit(EventType.UnSubscribeStore);
    }

    // 选中节点未改变
    if (selectedFeature === this.lastSelectedFeature) {
      return;
    }

    let currStore: Editor.IStore<Editor.IFeatureState> | null = null;

    if (selectedFeature && selectedFeature !== this.Root) {
      currStore = selectedFeature.Store;
    }

    let lastStore: Editor.IStore<Editor.IFeatureState> | null = null;
    if (this.lastSelectedFeature && this.lastSelectedFeature !== this.Root) {
      lastStore = this.lastSelectedFeature.Store;
    }

    // 出发切换store事件，通知<Control />
    EvtEmitter.Instance.emit(EventType.SwitchStore, currStore, lastStore);
  }

  public updateDragEnterFeature(feature: Editor.IFeature | null) {
    this.store.dispatch({ type: 'dragEnterFeature', data: feature });
  }

  public updateAimsFeature(x: number, y: number) {
    // 默认插入dragEnterFeature的孩子节点
    const insertedAimsFeature = {
      method: 'child',
      feature: this.store.getState().dragEnterFeature
    };

    let yLimit = 0;
    let xLimit = 0;
    let leftLimit = 0;

    for (const feature of this.getAlternativeAims()) {
      if (!feature.BoundingClientRect) {
        continue;
      }
      const { right, left, bottom, top, width, height } = feature.BoundingClientRect;
      const xCenter = left + width / 2;
      const yCenter = top + height / 2;

      const isLefterXLimit = xLimit && left > xLimit;
      const isBottomerYLimit = yLimit && yCenter >= yLimit;
      const isRighterLeftLimit = leftLimit && right < leftLimit;

      if (isLefterXLimit || isBottomerYLimit || isRighterLeftLimit) {
        continue;
      }

      insertedAimsFeature.feature = feature;

      if (typeof feature.BaseStyle === 'undefined') {
        return;
      }

      const inFlow = feature.BaseStyle.display === 'block' && feature.BaseStyle.float === 'none';

      if (inFlow) {
        if (y < yCenter) {
          insertedAimsFeature!.method = 'predecessor';
          break;
        } else {
          insertedAimsFeature!.method = 'successor';
        }
      } else {
        // tslint:disable-next-line:no-unused-expression
        y < bottom && (yLimit = bottom);

        if (x < xCenter) {
          xLimit = xCenter;
          insertedAimsFeature!.method = 'predecessor';
        } else {
          leftLimit = xCenter;
          insertedAimsFeature!.method = 'successor';
        }
      }
    }

    this.store.dispatch({ type: 'insertedAimsFeature', data: insertedAimsFeature });
  }
  //#endregion

  //#region super overload

  public insertAsRoot(_root: Editor.ITreeNode) {
    const root = super.insertAsRoot(_root);
    this.store.dispatch({ type: 'insertAsRoot', data: { node: root, root } });

    return root;
  }

  public insertAsFirstChild(node: Editor.ITreeNode, firstChild: Editor.ITreeNode) {
    const result = super.insertAsFirstChild(node, firstChild);
    this.store.dispatch({ type: 'insertAsFirstChild', data: { node, firstChild } });

    return result;
  }

  public insertAsPredecessor(node: Editor.ITreeNode, predecessor: Editor.ITreeNode) {
    const result = node.insertAsPredecessor(predecessor);
    this.store.dispatch({ type: 'insertAsPredecessor', data: { node, predecessor } });

    return result;
  }

  public insertAsSuccessor(node: Editor.ITreeNode, successor: Editor.ITreeNode) {
    const result = super.insertAsSuccessor(node, successor);
    this.store.dispatch({ type: 'insertAsSuccessor', data: { node, successor } });

    return result;
  }

  public insertAsLastChild(node: Editor.ITreeNode, lastChild: Editor.ITreeNode) {
    const result = super.insertAsLastChild(node, lastChild);
    this.store.dispatch({ type: 'insertAsLastChild', data: { node, lastChild } });

    return result;
  }

  //#endregion

  // 将feature插入Tree
  public insertFeature(feature: Editor.IFeature) {
    if (this.isHidden) {
      this.Root && this.insertAsLastChild(this.Root, feature);
    }
    const { insertedAimsFeature } = this.store.getState();
    if (insertedAimsFeature === null) {
      return;
    }
    const { method, feature: aimsFeature } = insertedAimsFeature;

    if (!aimsFeature) {
      return;
    }

    if (method === 'child') {
      this.insertAsFirstChild(aimsFeature, feature);
    }

    if (method === 'predecessor') {
      this.insertAsPredecessor(aimsFeature, feature);
    }

    if (method === 'successor') {
      this.insertAsSuccessor(aimsFeature, feature);
    }
  }

  // 得到一个深复制的feature
  public copy(feature: Editor.IFeature) {
    const treeObj: any = {};
    let cpFeature!: Editor.IFeature;

    Tree.preTraverse<Editor.IFeature>(feature, (node) => {
      const ftr = node;
      const cpFtr = this.getShallowCopy(ftr);
      treeObj[ftr.Id] = cpFtr;

      // 此节点为被复制的节点
      if (ftr === feature) {
        cpFeature = cpFtr;
      } else if (!ftr.Predecessor) { // 此节点为firstChild节点
        // 调用super方法，不去触发dispatch
        super.insertAsFirstChild(treeObj[(ftr.Parent as Editor.IFeature).Id], cpFtr);
      }

      if (ftr.Predecessor && treeObj[(ftr.Predecessor as Editor.IFeature)!.Id]) {
        // 调用super方法，不去触发dispatch
        super.insertAsSuccessor(treeObj[(ftr.Predecessor as Editor.IFeature)!.Id], cpFtr);
      }

    });

    return cpFeature;
  }

  // 创建rootFeature(只能画布调用)
  public createRootFeature() {
    return this.createFeature(
      rootOption,
      rootReducer,
      {},
      featureAdvance(FeatureRoot)
    );
  }

  // 得到feature的浅副本
  private getShallowCopy(feature: Editor.IFeature) {
    const copyFeature = this.createFeature(
      feature.Option,
      feature.Store.Reducer,
      feature.OwnProps,
      feature.FeatureComponentClass);

    // 将设置为最新的state
    copyFeature.State = feature.State;

    // 将feature.style设置为最新(与store中的同步)
    feature.State.style && copyFeature.updateBaseStyle(feature.State.style);

    // 设置IsCopy标志位
    copyFeature.IsCopy = true;

    return copyFeature;
  }

  /** 得到待选的插入目标集合 */
  private getAlternativeAims() {
    const { dragEnterFeature, selectedFeature } = this.store.getState();
    if (dragEnterFeature === null) {
      return [];
    }

    // move时
    if (selectedFeature && this.IsMoving) {
      // mselectedFeature不能是dragEnterFeature或其长辈节点
      if (this.isNesting(dragEnterFeature, selectedFeature)) {
        this.updateDragEnterFeature(null);
        return [];
      }
    }

    return this.getAllChildren(dragEnterFeature) as Editor.IFeature[];
  }

  // 是否嵌套，非body组件
  private isNesting(node: Editor.ITreeNode, father: Editor.ITreeNode) {
    let isFather = false;
    let parent: Editor.ITreeNode | undefined = node;
    while (parent) {
      if (parent === this.Root) {
        return;
      }
      if (parent === father) {
        isFather = true;
        break;
      }
      parent = parent.Parent;
    }
    return isFather;
  }
}
