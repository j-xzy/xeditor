declare namespace Editor {
  interface ITreeNode {

    /** 规模 包括本节点（1） */
    Size: number;

    /** 父节点 */
    Parent: ITreeNode | undefined;

    /** 长子节点 */
    FirstChild: ITreeNode | undefined;

    /** 前驱结点 */
    Predecessor: ITreeNode | undefined;

    /** 后继节点 */
    Successor: ITreeNode | undefined;

    /** 删除节点 */
    remove(): ITreeNode;

    /**
     * 插入长子节点
     * @param node 长子节点
     */
    insertAsFirstChild(node: ITreeNode): ITreeNode;

    /**
     * 插入前驱节点
     * @param node 前驱节点
     */
    insertAsPredecessor(node: ITreeNode): ITreeNode;

    /**
     * 插入后继节点
     * @param node 后继节点
     */
    insertAsSuccessor(node: ITreeNode): ITreeNode;

    /**
   * 得到node的所有孩子节点
   * @param node 
   * @return 所有的孩子节点
   */
    getChildren(): ITreeNode[];

    /**
   * 追加child节点
   * @param child 
   */
    appendChild(child: ITreeNode): ITreeNode;
  }

  interface ITree {
    /** 根 */
    Root: ITreeNode | undefined;

    /**
     * 替换节点
     * @param des 被替换的节点
     * @param source new node
     */
    replaceNode(des: ITreeNode, newNode: ITreeNode): void;
    /**
     * 插入根结点
     * @param root 根结点
     */
    insertAsRoot(root: ITreeNode): ITreeNode;

    /**
     * 追加child节点
     * @param node 
     * @param child 
     */
    appendChild(node: ITreeNode, child: ITreeNode): ITreeNode;

    /**
     * 插入长子节点
     * @param node 被插入的节点
     * @param firstChild 长子节点
     */
    insertAsFirstChild(node: ITreeNode, firstChild: ITreeNode): ITreeNode;

    /**
     * 插入前驱节点
     * @param node 被插入的前驱节点
     * @param predecessor 前驱节点
     */
    insertAsPredecessor(node: ITreeNode, predecessor: ITreeNode): ITreeNode;

    /**
     * 插入后继节点
     * @param node 被插入的后继节点
     * @param successor 后继节点
     */
    insertAsSuccessor(node: ITreeNode, successor: ITreeNode): ITreeNode;

    /**
     * 得到node的所有孩子节点
     * @param node 
     * @return 所有的孩子节点
     */
    getAllChildren(node: ITreeNode): ITreeNode[];

    /**
     * 得到所有兄弟节点
     * @param node 
     * @return 所有的兄弟节点
     */
    getAllBrother(node: ITreeNode): ITreeNode[];

    /**
     * 删除节点
     * @param node 被删除的节点 
     */
    removeNode(node: ITreeNode): void;
  }
}