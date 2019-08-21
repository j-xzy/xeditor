import { Program } from '@babel/types';
import { Plugin } from './plugin';

export interface IGeneratorConfig extends IBaseConfig {
  template: string;
  indexHtmlLoaders: ILoader[];
  indexjsLoaders: ILoader[];
  appLoaders: ILoader[];
  compLoaders: ILoader[];
  containerLoaders: ILoader[];
  layoutLoaders: ILoader[];
  rootLayoutLoaders: ILoader[];
  plugins: Array<Plugin | undefined>;
}

export interface IBaseConfig {
  body: IBody;
  srcMap: { [p: string]: string };
  dest: string;
  downloadAssets: boolean;
  compatible: boolean;
}

export interface IBody {
  data: {
    canvas: Editor.ICanvaStoreState;
    root: INode;
    hidden: INode[];
  };
  name: string;
}

export interface INode {
  _srcPath?: string; // 源码地址
  _ast: Program;
  option: Editor.IFeatureOption & { path: string, box: boolean, __uploads?: string[] };
  state: Editor.IFeatureState & { data: any, property: any };
  children: INode[];
}

export interface ICompInfo {
  fileName: string;
  dir: string;
  path: string;
  code: string;
}

export interface IContainerInfo extends ICompInfo {
  compFileName: string;
  id: number;
}

export interface ICompiler {
  compPath: string;
  containerPath: string;
  srcPath: string;
  layoutPath: string;
  app: ICompInfo;
  indexjs: ICompInfo;
  compInfos: { [p: string]: ICompInfo };
  layoutInfos: { [p: string]: ICompInfo };
  containerInfos: { [p: string]: IContainerInfo };
  config: IGeneratorConfig;
}

export type ILoader = (...params: any[]) => any;

export type IEnterExit = {
  enter?: (node: INode, parent: INode | null) => void;
  exit?: (node: INode, parent: INode | null) => void;
};

export type IVisitor = {
  com?: IEnterExit;
  root?: IEnterExit;
  box?: IEnterExit;
  default?: IEnterExit;
};
