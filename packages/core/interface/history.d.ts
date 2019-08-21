declare namespace Editor {
  interface IHistory<T> {

    // pop最后一次快照
    pop(): void;

    // 设置最大history
    setMaxStep(step: number): void;

    // 清空历史记录
    clear(): void;

    // 撤销
    undo(): void;

    // 恢复
    redo(): void;

    // 快照
    takeSnapshot(snapshot: T): void;

    // 得到当前cursor快照
    getSnapshop(): T;
  }
}