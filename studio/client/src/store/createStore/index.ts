import { createUseMappedState } from 'type-redux-hook';
import * as mutations from '../reducers/mutation';
import * as observables from '../reducers/observable';
import { initialState } from '../state';
import { store as devStore } from './store.dev';
import { store as prodStore } from './store.prod';

export const reducers = { mutations, actions: {...observables} };

const store = process.env.NODE_ENV === 'production' ? prodStore(initialState, reducers) : devStore(initialState, reducers);

export type IState = typeof initialState;
export type IGetState = () => IState;
export type IReducers = typeof reducers;
export type ICtx = TypeRedux.IContext<IState, IReducers['mutations'], IReducers['actions']>;
export type IRxCtx<T> = TypeRedux.IRxContext<IState, IReducers['mutations'], IReducers['actions'], T>;

export const useMappedState = createUseMappedState(store);
export const commit = store.commit;
export const dispatch = store.dispatch;

window.useMappedState = useMappedState;
window.commit = commit;
window.dispatch = dispatch;
