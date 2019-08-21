import { ICompiler } from '../core';

export abstract class Plugin {
  public async beforeGenerate(_compiler: ICompiler) {
    //
  }

  public async afterInitDir(_compiler: ICompiler) {
    //
  }

  public async afterGenerate(_compiler: ICompiler) {
    //
  }
}
