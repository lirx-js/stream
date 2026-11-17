import {
  IWebSocketStreamGetStateFunction,
  WEB_SOCKET_STREAM_STATE,
} from '../../../../traits/get-state/web-socket-stream.get-state.function-definition';

export function createWebSocketStreamGetStateFunctionFromWebSocket(
  socket: WebSocket,
): IWebSocketStreamGetStateFunction {
  return (): WEB_SOCKET_STREAM_STATE => {
    switch (socket.readyState) {
      case socket.CONNECTING:
        return WEB_SOCKET_STREAM_STATE.CONNECTING;
      case socket.OPEN:
        return WEB_SOCKET_STREAM_STATE.OPEN;
      case socket.CLOSING:
        return WEB_SOCKET_STREAM_STATE.CLOSING;
      case socket.CLOSED:
        return WEB_SOCKET_STREAM_STATE.CLOSED;
      default:
        throw new Error(`Invalid socket state: ${socket.readyState}`);
    }
  };
}
