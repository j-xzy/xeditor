interface IApi {
  /**
   * 获取组件列表
   */
  '/studio/component-list': {
    get: {
      params: never;
      body: never;
      querys: never;
      response: IModel.IResponse<{
        list: IModel.IComponentList
      }>;
    };
    put: never;
    delete: never;
    post: never;
  }
}