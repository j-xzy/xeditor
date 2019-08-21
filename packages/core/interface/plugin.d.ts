declare namespace Editor {
  interface IPluginControl {
    reducer(action: Editor.IAction, currState?: Readonly<any>): any;

    beforeDispatch(action: Editor.IAction, state: Readonly<any>): void;

    afterDispatch(action: Editor.IAction, state: Readonly<any>): void;

    setPlugins(middlewares: INewabblPlugin[]): void;

    canvasDidMount(): void;

    canvasWillUnmount(): void;

    getPluginByName(name: string): undefined | IPlugin;
  }

  interface IPlugin {

    /**
     * dispatch之前触发
     * @param action 
     * @param state 
     */
    beforeDispatch(action: Editor.IAction, state: Readonly<any>): void;

    /**
     * dispatch之后触发
     * @param action 
     * @param state 
     */
    afterDispatch(action: Editor.IAction, state: Readonly<any>): void;

    /**
     * <Canvas />DidMount时触发
     */
    canvasDidMount(): void;

    /**
     * <Canvas />WillUnmount时触发
     */
    canvasWillUnmount(): void;

    /**
     * 返回结果会以props的形式给对应的pluginHook或pluginconnector
     * @param action 
     * @param state 
     */
    state(): any;
    unSubscribe(callback: () => void): void;
    subscribe(callback: () => void): void;
  }

  interface INewabblPlugin {
    new(canvaStore: ICanvaStore, featureStore: IFeatureStore, refresh: (history?: boolean) => void): IPlugin;
    reducer: Editor.IReducer<any>;
    pluginName: string;
    initialState: { [p: string]: any };
  }
}