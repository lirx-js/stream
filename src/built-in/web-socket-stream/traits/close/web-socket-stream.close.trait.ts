import { IWebSocketStreamCloseFunction } from './web-socket-stream.close.function-definition';

export interface IWebSocketStreamCloseTrait {
  readonly close: IWebSocketStreamCloseFunction;
}
