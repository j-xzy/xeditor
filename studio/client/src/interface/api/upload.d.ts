interface IApi {
  /**
   * 上传图片
   */
  '/upload?id': {
    get: never;
    put: never;
    delete: never;
    post: {
      params: never;
      body: any; // formData
      querys: {
        id: string;
      };
      response: IModel.IResponse<{ urls: string[] }>;
    };
  }
}