declare namespace IModel {
  type IResponse<T> = {
    code: 1;
    msg: string;
    result: T;
  } | {
    code: 0;
    msg: string;
  }
}