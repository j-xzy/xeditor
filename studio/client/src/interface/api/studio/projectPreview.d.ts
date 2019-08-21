interface IApi {
  /**
   * 下载
   */
  '/studio/project-preview?id': {
    get: never;
    put: never;
    delete: never;
    post: {
      params: never;
      querys: {
        id: string | null;
      };
      body: FormData;
      response: IModel.IResponse<{ url: string }>;
    };
  }
}