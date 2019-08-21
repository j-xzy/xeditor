import generate from '@babel/generator';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as util from '../util';
import * as I from './type';

export class Generator {

  // components路径与信息
  private compPath: string;
  private compInfos: { [p: string]: I.ICompInfo } = {};

  // containers路径与信息
  private containerPath: string;
  private containerInfos: { [p: string]: I.IContainerInfo } = {};

  // layout路径与信息
  private layoutPath: string;
  private layoutInfos: { [p: string]: I.ICompInfo } = {};

  // src路径
  private srcPath: string;

  // index.js信息
  private indexjs!: I.ICompInfo;

  // app.jsx的信息
  private app!: I.ICompInfo;

  // app的节点
  private appNode!: I.INode;

  constructor(private config: I.IGeneratorConfig) {
    this.srcPath = path.join(config.dest, 'src');
    this.compPath = path.join(this.srcPath, 'components');
    this.containerPath = path.join(this.srcPath, 'containers');
    this.layoutPath = path.join(this.srcPath, 'layout');
  }

  /**
   * 代码生成
   */
  public async generate() {
    try {
      // plugin hook
      await this.runPlugin('beforeGenerate');

      // 初始化src目录
      await this.initDir();

      // plugin hook
      await this.runPlugin('afterInitDir');

      // 设置index.html
      await this.setIndexHtml();

      // 设置index.js
      await this.setIndexJs();

      // 设置root的样式
      await this.setRootLayout();

      // 处理component
      await this.setComponent();

      // 遍历节点
      await util.traverserAsync(this.config.body.data.root, {
        root: {
          enter: async (node) => {
            await this.appEnter(node);
          },
          exit: async (node) => {
            await this.appExit(node);
          }
        },
        com: {
          enter: async (node) => {
            await this.containerEnter(node);
          },
          exit: async (node, parent) => {
            await this.containerExit(node, parent);
          }
        },
        box: {
          enter: async (node, parent) => {
            await this.layoutEnter(node, parent);
          },
          exit: async (node) => {
            await this.layoutExit(node);
          }
        }
      });

      await this.runPlugin('afterGenerate');
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(e);
      return {
        error: true,
        msg: e
      };
    }

    return {
      error: false,
      msg: '生成成功'
    };
  }

  /**
   * 初始src目录下的文件夹与文件
   */
  private async initDir() {
    await fs.copy(this.config.template, this.config.dest);
    // 复制component到目标路径
    for (const fileName in this.config.srcMap) {
      const src = this.config.srcMap[fileName];
      const dest = path.join(this.compPath, fileName);
      await fs.ensureDir(dest);
      await fs.copy(src, dest);
    }
  }

  /**
   * 初始index.html
   */
  private async setIndexHtml() {
    const src = this.pipeLoaders(this.config.indexHtmlLoaders, this.config.body.name);
    await fs.writeFile(path.join(this.srcPath, 'index.html'), src);
  }

  /**
   * 初始index.js
   */
  private async setIndexJs() {
    // 流经indexjs的loaders
    const code = this.pipeLoaders(this.config.indexjsLoaders);

    this.indexjs = {
      fileName: 'index',
      dir: this.srcPath,
      path: path.join(this.srcPath, 'index.js'),
      code
    };

    // 写
    await fs.writeFile(this.indexjs.path, code);
  }

  /**
   * 设置layout下的root.jsx(root的样式)
   */
  private async setRootLayout() {
    const code = this.pipeLoaders(this.config.rootLayoutLoaders, this.config.body.data.canvas);

    this.layoutInfos.root = {
      fileName: 'root',
      dir: this.layoutPath,
      path: path.join(this.layoutPath, 'root.jsx'),
      code
    };

    // 写
    await fs.writeFile(this.layoutInfos.root.path, code);
  }

  /**
   * 设置component
   */
  private async setComponent() {
    // 遍历component
    for (const fileName in this.config.srcMap) {
      // 该component的文件夹目录
      const srcDirPath = this.config.srcMap[fileName];

      // 得到其代码
      const src = (await util.readFile(srcDirPath, /index.(js|jsx)$/))!.toString();

      // 流经component的loader
      const code = this.pipeLoaders(this.config.compLoaders, src);

      // 该component的相关信息
      const info = this.compInfos[fileName] = {
        fileName,
        dir: path.join(this.compPath, fileName),
        path: path.join(this.compPath, fileName, 'index.jsx'),
        code
      };

      await fs.remove(path.join(info.dir, 'index.js'));
      await fs.remove(path.join(info.dir, 'index.jsx'));

      // 写
      await fs.writeFile(info.path, code);
    }
  }

  /**
   * app节点的进入
   * @param node root节点
   */
  private appEnter(node: I.INode) {
    this.appNode = node;

    // 初始ast
    const ast = this.pipeLoaders(this.config.appLoaders, this.config.body.data.canvas, path.join(this.srcPath, 'app.jsx'));
    node._ast = ast;

    this.app = {
      fileName: 'app',
      dir: this.srcPath,
      path: path.join(this.srcPath, 'app.jsx'),
      code: '' // exit中设置
    };
  }

  /**
   * app节点的离开
   * @param node app节点
   */
  private async appExit(node: I.INode) {
    // app.jsx代码(最终)
    this.app.code = generate(node._ast).code;

    // 写
    await fs.writeFile(path.join(this.srcPath, 'app.jsx'), this.app.code);
  }

  /**
   * container节点进入
   * @param node container节点
   * @param parent 父节点
   */
  private containerEnter(node: I.INode) {
    // component的名称（其文件夹名称）
    const compName = this.getCompNameBySrcPath(node._srcPath!)!;

    // container的名称
    const containerName = this.getContainerName(node.state.id!);

    // tslint:disable-next-line:prefer-const
    node._ast = this.pipeLoaders(this.config.containerLoaders, node, `../components/${compName}`);

    // 初始次container的info
    this.containerInfos[node.state.id!] = {
      fileName: containerName,
      dir: this.containerPath,
      path: path.join(this.containerPath, `${containerName}.jsx`),
      code: '', // exit中设置
      compFileName: compName,
      id: node.state.id!
    };
  }

  /**
   * container节点离开
   * @param node container节点
   * @param parent 父节点
   */
  private async containerExit(node: I.INode, parent: I.INode | null) {
    // 生成最终代码
    const code = this.containerInfos[node.state.id!].code = generate(node._ast).code;

    // 写Container
    await fs.writeFile(this.containerInfos[node.state.id!].path, code);

    const containerName = this.containerInfos[node.state.id!].fileName;
    const containerPath = parent === this.appNode ? `./containers/${containerName}` : `../containers/${containerName}`;

    // 向父组件文件中添加应用和将本组件推入父组件jsx中(<Parent><Child/></Parent>)
    this.appendComp(parent!, util.firstWordUpper(containerName), containerPath);
  }

  /**
   * 容器节点进入
   * @param node 容器节点
   * @param parent 父节点
   */
  private layoutEnter(node: I.INode, parent: I.INode | null) {
    // 容器组件名称
    const name = this.getLayoutName(node.state.id!);
    const layoutPath = path.join(this.layoutPath, `${name}.jsx`);
    const ast = this.pipeLoaders(this.config.layoutLoaders, node, layoutPath);
    node._ast = ast;

    this.layoutInfos[node.state.id!] = {
      fileName: name,
      dir: this.layoutPath,
      path: layoutPath,
      code: '' // exit中设置
    };

    // 得到父组件返回的JSX
    const nodeJsxAst = util.getRenderReturnJsx(parent!._ast);

    if (!nodeJsxAst) {
      // tslint:disable-next-line:no-console
      console.error('未找到容器组件的父组件返回的jsx');
      return;
    }

    const boxPath = parent === this.appNode ? `./layout/${name}` : `../layout/${util.firstWordLower(name)}`;

    // 向父组件文件中添加应用和将本组件推入父组件jsx中(<Parent><Child/></Parent>)
    this.appendComp(parent!, name, boxPath);
  }

  /**
   * layout节点的离开
   * @param node layout节点
   */
  private async layoutExit(node: I.INode) {
    // 生成最终代码
    const code = this.layoutInfos[node.state.id!].code = generate(node._ast).code;

    // 写
    await fs.writeFile(this.layoutInfos[node.state.id!].path, code);
  }

  // 内部信息
  private get compiler(): I.ICompiler {
    return {
      compPath: this.compPath,
      containerPath: this.containerPath,
      srcPath: this.srcPath,
      layoutPath: this.layoutPath,
      app: this.app,
      indexjs: this.indexjs,
      compInfos: this.compInfos,
      layoutInfos: this.layoutInfos,
      containerInfos: this.containerInfos,
      config: this.config
    };
  }

  /**
   * 得到component的name根据路径
   * @param srcPath
   */
  private getCompNameBySrcPath(srcPath: string) {
    for (const name in this.config.srcMap) {
      if (this.config.srcMap[name] === srcPath) {
        return name;
      }
    }
  }

  /**
   * 得到container的名称
   * @param id id
   */
  private getContainerName(id: number) {
    return `comp${id}`;
  }

  /**
   * 得到容器layout的名称
   * @param id id
   */
  private getLayoutName(id: number) {
    return 'box' + id;
  }

  /**
   * ast流过loaders得到新的ast
   * @param loaders loaders
   * @param ast ast
   */
  private pipeLoaders(loaders: I.ILoader[], ...params: any[]) {
    let result;
    for (let i = 0; i < loaders.length; i++) {
      if (typeof result === 'undefined') {
        result = loaders[i](...params, this.compiler);
        continue;
      }
      result = loaders[i](result, ...params, this.compiler);
    }
    return result;
  }

  /**
   * 增加组件依赖
   * @param node 被加入的组件
   * @param name 加入组件的名称
   * @param _path 计入组件的路径
   */
  private appendComp(node: I.INode, name: string, _path: string) {
    // 得到父组件返回的JSX
    const nodeJsxAst = util.getRenderReturnJsx(node!._ast);

    if (!nodeJsxAst) {
      // tslint:disable-next-line:no-console
      console.error('未找到容器组件的父组件返回的jsx');
      return;
    }

    // 向父组件的Program中加入本组件引用
    util.appendImportStatement(node!._ast, util.makeDefaultImport(util.firstWordUpper(name), _path));

    // 将本组件jsx推入父组件jsx中(<Parent><Child/></Parent>)
    nodeJsxAst.children.push(util.makeJsx(util.firstWordUpper(name), [], [], true));
  }

  /**
   * 执行plugin
   * @param hook
   */
  private async runPlugin(hook: string) {
    for (let i = 0; i < this.config.plugins.length; i++) {
      if (this.config.plugins[i]) {
        await (this.config.plugins[i] as any)[hook](this.compiler);
      }
    }
  }
}
