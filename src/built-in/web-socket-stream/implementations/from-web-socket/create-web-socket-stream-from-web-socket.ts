import { IWebSocketStream } from '../../web-socket-stream.type';
import { createWebSocketStreamCloseFunctionFromWebSocket } from './traits/close/create-web-socket-stream-close-function-from-web-socket';
import { createWebSocketStreamInputFunctionFromWebSocket } from './traits/input/create-web-socket-stream-input-function-from-web-socket';
import { createWebSocketStreamOutputFunctionFromWebSocket } from './traits/output/create-web-socket-stream-output-function-from-web-socket';
import {
  createWebSocketStreamUntilClosedFunctionFromWebSocket,
} from './traits/until-closed/create-web-socket-stream-until-closed-function-from-web-socket';

export function createWebSocketStreamFromWebSocket(
  socket: WebSocket,
): IWebSocketStream {
  const input$ = createWebSocketStreamInputFunctionFromWebSocket(socket);
  const $output = createWebSocketStreamOutputFunctionFromWebSocket(socket);
  const close = createWebSocketStreamCloseFunctionFromWebSocket(socket);
  const untilClosed = createWebSocketStreamUntilClosedFunctionFromWebSocket(socket);

  return {
    input$,
    $output,
    close,
    untilClosed,
  };
}
