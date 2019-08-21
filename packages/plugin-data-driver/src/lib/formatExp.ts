import { Expression } from '../node';
import { Factory } from './factory';

export function formatExp(expParent: Editor.ITreeNode) {
  const expres = expParent.getChildren() as Expression[];

  for (let i = 1; i < expres.length; i++) {
    if (typeof expres[i] === 'undefined') {
      break;
    }
    const last = expres[i - 1];
    const next = expres[i];
    if (typeof last.value === 'string' && typeof next.value === 'string') {
      last.value += next.value;
      next.remove();
      expres.splice(i, 1);
      i--;
    }
    if (typeof last.value !== 'string' && typeof next.value !== 'string') {
      last.insertAsSuccessor(Factory.Instance.Expression(last.plugin, ''));
    }
  }

  if (typeof expres[expres.length - 1].value !== 'string') {
    expres[expres.length - 1].insertAsSuccessor(Factory.Instance.Expression(expres[expres.length - 1].plugin, ''));
  }
}

// export function clearExpres(node: WithTreeNode<BaseNode>, compId: number) {
//   let beClear = false;
//   node.getChildren().forEach((child) => {
//     if (child.type === 'PropertyExpression') {
//       clearExpres((child as PropertyExpression).data, compId);
//     }
//     const clearedNode = (child as Expression).clear(compId);
//     if (typeof clearedNode !== 'undefined') {
//       beClear = true;
//     }
//   });

//   if (beClear) {
//     formatExp(node);
//   }
// }
