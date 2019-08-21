import * as path from 'path';
import { Generator, IBaseConfig } from './core';
import { adaptationLoader } from './loaders/app/adaptation';
import { appTemplateLoader } from './loaders/app/template';
import { eventLoader } from './loaders/common/eventLoader';
import { refreshLoader } from './loaders/common/refreshLoader';
import { toAstLoader } from './loaders/common/toAst';
import { toCodeLoader } from './loaders/common/toCode';
import { exportLoader } from './loaders/comp/export';
import { reducerLoader } from './loaders/comp/reducer';
import { conainerImportLoader } from './loaders/container/importLoader';
import { containerTemplateLoader } from './loaders/container/template';
import { indexHtmlTemplateLoader } from './loaders/indexHtml/template';
import { indexjsTemplateLoader } from './loaders/indexjs/template';
import { layoutTemplateLoader } from './loaders/layout/template';
import { dataLoader } from './loaders/store/dataLoader';
import { propertyLoader } from './loaders/store/propertyLoader';
import { restLoader } from './loaders/store/restLoader';
import { styleLoader } from './loaders/store/styleLoader';
import { useStoreLoader } from './loaders/store/useStoreLoader';
import { Babelrc } from './plugins/babelrc';
import { Dependency } from './plugins/dependency';
import { DownloadAssets } from './plugins/downloadAssets';
import { StorePlugin } from './plugins/store';

export async function generate(config: IBaseConfig) {
  const generator = new Generator({
    ...config,
    template: path.join(__dirname, '../template'),
    indexHtmlLoaders: [indexHtmlTemplateLoader],
    indexjsLoaders: [indexjsTemplateLoader],
    appLoaders: [appTemplateLoader, toAstLoader, adaptationLoader, refreshLoader],
    containerLoaders: [containerTemplateLoader, toAstLoader, conainerImportLoader, refreshLoader, styleLoader, dataLoader, propertyLoader, restLoader, eventLoader, useStoreLoader],
    layoutLoaders: [layoutTemplateLoader, toAstLoader, refreshLoader, styleLoader, propertyLoader, restLoader, eventLoader, useStoreLoader],
    rootLayoutLoaders: [layoutTemplateLoader, toAstLoader, styleLoader, useStoreLoader, toCodeLoader],
    compLoaders: [toAstLoader, exportLoader, reducerLoader, toCodeLoader],
    plugins: [new StorePlugin(), new DownloadAssets(), new Dependency(), new Babelrc()]
  });

  return await generator.generate();
}
