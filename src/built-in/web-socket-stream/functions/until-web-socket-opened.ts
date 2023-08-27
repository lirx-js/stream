import { Abortable, AsyncTask, IAsyncTaskErrorFunction, IAsyncTaskSuccessFunction } from '@lirx/async-task';
import { createEventListener } from '@lirx/utils';
import { IUnsubscribe, mergeUnsubscribeFunctions } from '@lirx/unsubscribe';
import { createWebSocketError } from '../errors/create-web-socket-error';
import { createWebSocketNotInAnOpeningStateError } from '../errors/create-web-socket-not-in-an-opening-state-error';

export function untilWebSocketOpened(
  socket: WebSocket,
  abortable: Abortable,
): AsyncTask<void> {
  return new AsyncTask<void>((
    success: IAsyncTaskSuccessFunction<void>,
    error: IAsyncTaskErrorFunction,
    abortable: Abortable,
  ): void => {
    if (socket.readyState === socket.OPEN) {
      success();
    } else if (socket.readyState === socket.CONNECTING) {
      const end: IUnsubscribe = mergeUnsubscribeFunctions([
        createEventListener<'open', Event>(socket, 'open', (): void => {
          end();
          success();
        }),
        createEventListener<'close', CloseEvent>(socket, 'close', (): void => {
          end();
          error(createWebSocketNotInAnOpeningStateError());
        }),
        createEventListener<'error', Event>(socket, 'error', (): void => {
          end();
          error(createWebSocketError());
        }),
        abortable.onAbort((): void => {
          end();
        }),
      ]);
    } else {
      throw createWebSocketNotInAnOpeningStateError();
    }
  }, abortable);
}
