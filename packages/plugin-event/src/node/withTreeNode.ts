import { TreeNode } from '@xeditor/core';
import { BaseNode } from './baenode';

export class WithTreeNode<T extends TreeNode> extends TreeNode {
  private base: BaseNode | undefined;

  get Base() {
    return this.base;
  }

  constructor(_base?: BaseNode) {
    super();
    this.base = _base;
  }

  public setBase(base: BaseNode) {
    this.base = base;
  }

  public getChildren() {
    return super.getChildren() as T[];
  }

  public insertAsFirstChild(node: T) {
    return super.insertAsFirstChild(node) as T;
  }

  public insertAsPredecessor(node: T) {
    return super.insertAsPredecessor(node) as T;
  }

  public insertAsSuccessor(node: T) {
    return super.insertAsSuccessor(node) as T;
  }

  public appendChild(child: T) {
    return super.appendChild(child) as T;
  }
}
