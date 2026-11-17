import { IWebSocketStreamGetStateFunction } from './web-socket-stream.get-state.function-definition';

export interface IWebSocketStreamGetStateTrait {
  readonly getState: IWebSocketStreamGetStateFunction;
}
