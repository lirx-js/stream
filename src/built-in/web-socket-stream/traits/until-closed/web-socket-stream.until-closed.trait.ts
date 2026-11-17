import { IWebSocketStreamUntilClosedFunction } from './web-socket-stream.until-closed.function-definition';

export interface IWebSocketStreamUntilClosedTrait {
  readonly untilClosed: IWebSocketStreamUntilClosedFunction;
}
