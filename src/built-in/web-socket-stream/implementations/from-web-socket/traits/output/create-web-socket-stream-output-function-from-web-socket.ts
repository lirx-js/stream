import { Abortable, AsyncTask, asyncTimeout } from '@lirx/async-task';
import { createWebSocketNotInAnOpenStateError } from '../../../../errors/create-web-socket-not-in-an-open-state-error';
import { IWebSocketStreamOutputFunction } from '../../../../traits/output/web-socket-stream.output.function-definition';
import { IWebSocketOutValue } from '../../../../types/web-socket-out-value.type';

export function createWebSocketStreamOutputFunctionFromWebSocket(
  socket: WebSocket,
): IWebSocketStreamOutputFunction {
  return (
    value: IWebSocketOutValue,
    abortable: Abortable,
  ): AsyncTask<void> => {
    if (socket.readyState === socket.OPEN) {
      socket.send(value);

      const loop = (
        abortable: Abortable,
      ): AsyncTask<void> => {
        if (socket.readyState === socket.OPEN) {
          if (socket.bufferedAmount === 0) {
            return AsyncTask.void(abortable);
          } else {
            return asyncTimeout(10, abortable)
              .successful((): AsyncTask<void> => {
                return loop(abortable);
              });
          }
        } else {
          return AsyncTask.error<void>(createWebSocketNotInAnOpenStateError(), abortable);
        }
      };

      return loop(abortable);
    } else {
      return AsyncTask.error<void>(createWebSocketNotInAnOpenStateError(), abortable);
    }
  };
}
