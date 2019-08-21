interface IApi {
  /**
   * 下载
   */
  '/studio/download?id': {
    get: never;
    put: never;
    delete: never;
    post: {
      params: never;
      querys: {
        id: string | null;
      };
      body: any;
      response: IModel.IResponse<{ id: string }>;
    };
  }
}