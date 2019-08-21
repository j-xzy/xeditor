class Store {
  constructor() {
    this.isDone = false;
    this.inits = [];
    this.state = {};
    this.listeners = [];
    this.reducers = new Map();
    this.ons = new Map();
    this.dispatch = this.dispatch.bind(this);
    this.emit = this.emit.bind(this);
    this.getState = this.getState.bind(this);
  }

  model({ namespace, state, reducer, on, init }) {
    this.reducers.set(namespace, reducer);
    on && this.ons.set(namespace, on);
    init && this.inits.push({ init, namespace });
    const names = namespace.split('/');
    let s = this.state;
    for (let i = 0; i < names.length; i++) {
      if (typeof s[names[i]] === 'undefined') {
        s[names[i]] = {};
      }
      if (i === names.length - 1) {
        s[names[i]] = state;
      }
      s = s[names[i]]
    }
  }

  done() {
    this.isDone = true;
    this.inits.forEach(({ init, namespace }) => {
      init(this.emit, this.getState(namespace), this.getState());
    });
  }

  dispatch({ type, data }) {
    if (!this.isDone) {
      return;
    }
    const namespace = type.slice(0, type.lastIndexOf('/'));
    const actType = type.slice(type.lastIndexOf('/') + 1);
    const reducer = this.reducers.get(namespace);
    if (!reducer) {
      throw Error('命名空间未找到!');
    }
    const lastNamespace = namespace.slice(namespace.lastIndexOf('/') + 1);
    const result = reducer({ type: actType, data }, this.getState(namespace), this.getState());
    if (result instanceof Promise) {
      result.then((data) => {
        this.notify(namespace, lastNamespace, data);
      });
    } else {
      this.notify(namespace, lastNamespace, result);
    }
  }

  notify(namespace, lastNamespace, result) {
    this.state[lastNamespace] = result;
    this.ons.get(namespace) && this.ons.get(namespace)(this.emit, this.getState(namespace), this.getState());
    this.listeners.forEach((callback) => {
      callback(namespace);
    });
  }

  emit(namespace, type, data) {
    this.dispatch({ type: `${namespace}/${type}`, data });
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => this.unSubscribe(listener);
  }

  unSubscribe(listener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  getState(namespace) {
    if (typeof namespace === 'undefined') {
      return this.state;
    }
    const names = namespace.split('/');
    let s = this.state;
    for (let i = 0; i < names.length; i++) {
      s = s[names[i]];
    }
    return s;
  }

  getLastNamespaceState(namespace) {
    let lastIdx = namespace.lastIndexOf('/');
    if (lastIdx === -1) {
      return this.getState();
    }
    const lastNamespace = namespace.slice(0, lastIdx);
    return this.getState(lastNamespace);
  }
}

export function createStore() {
  return new Store();
}