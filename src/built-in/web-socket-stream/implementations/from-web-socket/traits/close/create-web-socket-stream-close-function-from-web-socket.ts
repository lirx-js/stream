import {
  IWebSocketStreamCloseFunction,
  IWebSocketStreamCloseOptions,
} from '../../../../traits/close/web-socket-stream.close.function-definition';

export function createWebSocketStreamCloseFunctionFromWebSocket(
  socket: WebSocket,
): IWebSocketStreamCloseFunction {
  return (
    {
      code,
      reason,
    }: IWebSocketStreamCloseOptions = {},
  ): void => {
    socket.close(code, reason);
  };
}
