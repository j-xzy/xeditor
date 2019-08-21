export class TreeNode implements Editor.ITreeNode {

  //#region 成员变量
  private parent: TreeNode | undefined;
  private firstChild: TreeNode | undefined;
  private predecessor: TreeNode | undefined;
  private successor: TreeNode | undefined;
  //#endregion

  //#region 属性

  get Size() {
    let s = 1; // 计入本身
    const node = this.firstChild;
    if (node) {
      s += 1;
      if (node.firstChild) {
        s += node.firstChild.Size;
      }
      if (node.successor) {
        s += node.successor.Size;
      }
    }
    return s;
  }

  get Parent() {
    return this.parent;
  }

  set Parent(parent: TreeNode | undefined) {
    this.parent = parent;
  }

  get FirstChild() {
    return this.firstChild;
  }

  get Predecessor() {
    return this.predecessor;
  }

  get Successor() {
    return this.successor;
  }

  //#endregion
  public remove() {
    // 如果前驱节点存在
    if (this.predecessor) {
      this.predecessor.successor = this.successor;
    } else {
      if (this.parent) {
        // 为firstchild
        this.parent.firstChild = this.successor;
      }
    }

    // 如后后继节点存在
    if (this.successor) {
      this.successor.predecessor = this.predecessor;
    }

    this.parent = this.predecessor = this.successor = undefined;
    return this;
  }

  public insertAsFirstChild(node: TreeNode) {
    // 如果firstChild节点存在
    if (this.firstChild) {
      this.firstChild.predecessor = node;
      node.successor = this.firstChild;
    }

    node.parent = this;
    this.firstChild = node;
    return node;
  }

  public insertAsPredecessor(node: TreeNode) {
    // 如果前驱节点存在
    if (this.predecessor) {
      this.predecessor.successor = node;
      node.predecessor = this.predecessor;
    }

    // 前驱节点不存在，当前也就是firstchild
    if (!this.predecessor && this.parent) {
      this.parent.firstChild = node;
    }

    this.predecessor = node;
    node.successor = this;
    node.parent = this.parent;

    return node;
  }

  public insertAsSuccessor(node: TreeNode) {
    // 如果后继节点存在
    if (this.successor) {
      this.successor.predecessor = node;
      node.successor = this.successor;
    }

    this.successor = node;
    node.predecessor = this;
    node.parent = this.parent;

    return node;
  }

  public getChildren() {
    const children: TreeNode[] = [];
    const firstChild = this.FirstChild;

    if (!firstChild) {
      return children;
    }

    children.push(firstChild);
    let successor = firstChild.Successor;

    while (successor) {
      children.push(successor);
      successor = successor.Successor;
    }

    return children;
  }

  public appendChild(child: TreeNode) {
    // 如果FirstChild不存在
    if (!this.FirstChild) {
      this.insertAsFirstChild(child);
      return child;
    }

    let target = this.FirstChild;
    while (target.Successor) {
      target = target.Successor;
    }
    target.insertAsSuccessor(child);

    return child;
  }
}
