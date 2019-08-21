import update from 'immutability-helper';

const defaulResponse: Required<Required<Editor.IFeatureOption>['event']>['response'] = [
  {
    name: '显示',
    type: 'show'
  }, {
    name: '隐藏',
    type: 'hide'
  }, {
    name: '切换',
    type: 'toggle'
  }, {
    name: '设置属性',
    type: 'setProperty'
  }, {
    name: '设置样式',
    type: 'setStyle'
  }, {
    name: '设置数据',
    type: 'setData'
  }
];

const defaulTrigger: Required<Required<Editor.IFeatureOption>['event']>['trigger'] = [
  {
    name: '初始',
    type: 'init'
  }
];

const defaultProperty: Required<Required<Editor.IFeatureOption>>['property'] = {
  refresh: {
    type: 'input',
    name: '刷新',
    binded: false
  }
};

export function advanceOption(opt: Editor.IFeatureOption) {
  let option = opt;

  if (!option.event) {
    option = update(option, {
      event: {
        $set: {}
      }
    });
  }

  if (!option.event!.response) {
    option = update(option, {
      event: {
        $merge: {
          response: []
        }
      }
    });
  }

  if (!option.event!.trigger) {
    option = update(option, {
      event: {
        $merge: {
          trigger: []
        }
      }
    });
  }

  if (!option.property) {
    option = update(option, {
      property: {
        $set: {}
      }
    });
  }

  option = update(option, {
    property: {
      $merge: defaultProperty
    }
  });

  return update(option, {
    event: {
      response: {
        $push: [...defaulResponse]
      },
      trigger: {
        $push: [...defaulTrigger]
      }
    }
  });
}
