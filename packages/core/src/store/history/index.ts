import { injectable } from 'inversify';

@injectable()
export class History<T> implements Editor.IHistory<T> {

  private maxStep = 12;
  private queue: T[] = [];
  private cursor: number = -1;

  public setMaxStep(step: number) {
    this.maxStep = step;
  }

  public pop() {
    this.queue.pop();
    if (this.cursor > -1) {
      this.cursor--;
    }
  }

  public clear() {
    this.cursor = -1;
    this.queue = [];
  }

  public undo() {
    // tslint:disable-next-line:no-unused-expression
    this.cursor > 0 && this.cursor--;
  }

  public redo() {
    if (this.cursor >= this.queue.length - 1) {
      return;
    }

    this.cursor++;
  }

  public takeSnapshot(snapshot: T) {
    this.queue.splice(this.cursor + 1, this.queue.length - this.cursor - 1, snapshot);
    if (this.isOver()) {
      this.queue.shift();
    }
    this.cursor = this.queue.length - 1;
  }

  public getSnapshop() {
    return this.queue[this.cursor];
  }

  private isOver() {
    return this.queue.length >= this.maxStep;
  }
}
