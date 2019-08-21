import { Plugin } from '@xeditor/core';
import { reducer } from '@xeditor/core/lib/store/canvaStore/reducer';
import { advanceReducer } from '../../util/advanceReducer';

export class CanvasPlugin extends Plugin {

  public static pluginName = 'CanvasPlugin';

  public static initialState: Partial<Editor.ICanvaStoreState> = {
    property: {
      adaptation: false,
      refresh: -1
    }
  };

  public static reducer = advanceReducer(reducer as any);
}
