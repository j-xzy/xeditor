import { EventPlugin } from '../plugin';
import { BaseNode } from './baenode';

export class EventRoot extends BaseNode {
  public type:  Editor.PluginEvent.INodeType = 'EventRoot';

  constructor(plugin: EventPlugin, public id = 0, public disabled = false) {
    super(plugin, id, disabled);
  }
}
