interface IApi {
  /**
   * 保存
   */
  '/studio/save?id': {
    get: never;
    put: never;
    delete: never;
    post: {
      params: never;
      querys: {
        id: string | null;
      };
      body: any;
      response: IModel.IResponse<any>;
    };
  }
}