interface IApi {
  /**
   * 打开项目
   */
  '/studio/open?id': {
    get: {
      params: never;
      body: never;
      querys: {
        id: string | null;
      };
      response: IModel.IResponse<{ name: string; data: any }>;
    };
    put: never;
    delete: never;
    post: never;
  }
}