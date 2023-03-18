import { Abortable, AsyncTask, IAsyncTaskErrorFunction, IAsyncTaskSuccessFunction } from '@lirx/async-task';
import { createEventListener, IUnsubscribe, mergeUnsubscribeFunctions } from '@lirx/utils';
import { createWebSocketError } from '../../../../errors/create-web-socket-error';
import {
  IWebSocketStreamUntilClosedFunction,
  IWebSocketStreamUntilClosedResult,
} from '../../../../traits/until-closed/web-socket-stream.until-closed.function-definition';

const UNKNOWN_CLOSED_RESULT = Object.freeze({
  code: -1,
  reason: 'Unknown close reason',
  wasClean: true,
});

export function createWebSocketStreamUntilClosedFunctionFromWebSocket(
  socket: WebSocket,
): IWebSocketStreamUntilClosedFunction {
  let result: IWebSocketStreamUntilClosedResult = UNKNOWN_CLOSED_RESULT;
  return (
    abortable: Abortable,
  ): AsyncTask<IWebSocketStreamUntilClosedResult> => {
    return new AsyncTask<IWebSocketStreamUntilClosedResult>((
      success: IAsyncTaskSuccessFunction<IWebSocketStreamUntilClosedResult>,
      error: IAsyncTaskErrorFunction,
      abortable: Abortable,
    ): void => {
      if (socket.readyState === socket.CLOSED) {
        success(result);
      } else {
        const end: IUnsubscribe = mergeUnsubscribeFunctions([
          createEventListener<'close', CloseEvent>(socket, 'close', (event: CloseEvent): void => {
            end();
            result = Object.freeze({
              code: event.code,
              reason: event.reason,
              wasClean: event.wasClean,
            });
            success(result);
          }),
          createEventListener<'error', Event>(socket, 'error', (): void => {
            end();
            error(createWebSocketError());
          }),
          abortable.onAbort(() => {
            end();
          }),
        ]);
      }
    }, abortable);
  };
}
