import { injectable } from 'inversify';

@injectable()
export class Tree implements Editor.ITree {

  public static inTraverse<T extends Editor.ITreeNode>(node: T | undefined, visitor: (node: T) => void) {

    function traverse(_node: T | undefined) {
      if (!_node) {
        return null;
      }

      traverse(_node.FirstChild as T);
      visitor(_node);
      traverse(_node.Successor as T);
    }

    traverse(node);
  }

  public static preTraverse<T extends Editor.ITreeNode>(node: T | undefined, visitor: (node: T) => void) {

    function traverse(_node: T | undefined) {
      if (!_node) {
        return null;
      }

      visitor(_node);
      traverse(_node.FirstChild as T);
      traverse(_node.Successor as T);
    }

    traverse(node);
  }

  /**
   * 层次遍历，返回ture结束
   * @param node
   * @param visitor
   */
  public static bfsTraverse<T extends Editor.ITreeNode>(node: T | undefined, visitor: (node: T) => void | boolean) {
    const queue = [node];

    while (queue.length !== 0) {
      const curNode = queue.shift()!;
      const isDone = visitor(curNode);
      if (isDone) {
        break;
      }

      if (curNode.FirstChild) {
        queue.push(curNode.FirstChild as T);
        let brother = curNode.FirstChild.Successor;
        while (brother) {
          queue.push(brother as T);
          brother = brother.Successor;
        }
      }
    }
  }

  private root: Editor.ITreeNode | undefined;

  get Root() {
    return this.root;
  }

  public replaceNode(des: Editor.ITreeNode, newNode: Editor.ITreeNode) {
    const { FirstChild, Parent, Predecessor, Successor } = des;
    this.removeNode(des);

    if (FirstChild) {
      this.insertAsFirstChild(newNode, FirstChild);
    }

    if (!Parent) {
      this.insertAsRoot(newNode);
      return;
    }

    if (Predecessor) {
      this.insertAsSuccessor(Predecessor, newNode);
    } else if (Successor) {
      this.insertAsPredecessor(Successor, newNode);
    } else {
      this.insertAsFirstChild(Parent, newNode);
    }
  }

  public removeNode(node: Editor.ITreeNode) {
    node.remove();
  }

  public insertAsRoot(root: Editor.ITreeNode) {
    this.root = root;
    return this.root;
  }

  public appendChild(node: Editor.ITreeNode, child: Editor.ITreeNode) {
    return node.appendChild(child);
  }

  public insertAsFirstChild(node: Editor.ITreeNode, firstChild: Editor.ITreeNode) {
    return node.insertAsFirstChild(firstChild);
  }

  public insertAsPredecessor(node: Editor.ITreeNode, predecessor: Editor.ITreeNode) {
    return node.insertAsPredecessor(predecessor);
  }

  public insertAsSuccessor(node: Editor.ITreeNode, successor: Editor.ITreeNode) {
    return node.insertAsSuccessor(successor);
  }

  public insertAsLastChild(node: Editor.ITreeNode, last: Editor.ITreeNode) {
    return node.appendChild(last);
  }

  public getAllBrother(node: Editor.ITreeNode) {
    if (node.Parent) {
      return this.getAllChildren(node.Parent);
    }
    return [];
  }

  public getAllChildren(node: Editor.ITreeNode) {
    return node.getChildren();
  }
}
