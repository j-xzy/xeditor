/*
 * @Author: whj
 * @Email: wuhongjiang@hiynn.com
 * @Description: 增强CanvaState,使其格式符合<LoadingCom />
 * @Date: 2018-10-16
 * @Last Modified by: whj
 * @Last Modified time: 2018-11-22
*/

import { boxReducer, RawBox } from '../components/box';
import { LoadingCom, loadingOption, loadingReducer } from '../components/loadingCom';

export function enpowerCanvasData(data: Editor.IRootData) {
  enpowerRoot(data);
}

function enpowerRoot(root: any) {
  // 如果是box容器组件
  if (root.option.box) {
    root.reducer = boxReducer;
    root.component = RawBox;
  } else {
    root.props = {
      comPath: root.option.path,
      state: root.state
    };
    // root.state = loadingState; // 注释、保留id
    root.reducer = loadingReducer;
    root.component = LoadingCom;
    root.option = loadingOption;
  }

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < root.children.length; i++) {
    enpowerRoot(root.children[i]);
  }
}
