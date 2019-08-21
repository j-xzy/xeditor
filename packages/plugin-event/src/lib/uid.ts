export class Uid {
  private static _instance: Uid;

  private uid = 0;

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  protected constructor() {
    //
  }

  public generateId() {
    return ++this.uid;
  }

  get Id() {
    return this.uid;
  }

  set Id(id: number) {
    this.uid = id;
  }
}
