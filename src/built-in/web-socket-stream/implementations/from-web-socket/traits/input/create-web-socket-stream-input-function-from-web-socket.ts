import { Abortable, AsyncTask, IAsyncTaskErrorFunction, IAsyncTaskSuccessFunction } from '@lirx/async-task';
import { createEventListener } from '@lirx/utils';
import { IPushSinkWithBackPressure } from '../../../../../../push-sink/push-sink-with-back-pressure.type';
import { createWebSocketError } from '../../../../errors/create-web-socket-error';
import { createWebSocketNotInAnOpeningStateError } from '../../../../errors/create-web-socket-not-in-an-opening-state-error';
import { IWebSocketStreamInputFunction } from '../../../../traits/input/web-socket-stream.input.function-definition';
import { IWebSocketInValue } from '../../../../types/web-socket-in-value.type';

export function createWebSocketStreamInputFunctionFromWebSocket(
  socket: WebSocket,
): IWebSocketStreamInputFunction {
  return (
    sink: IPushSinkWithBackPressure<IWebSocketInValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    if (
      (socket.readyState === socket.CONNECTING)
      || (socket.readyState === socket.OPEN)
    ) {

      /* DATA */

      const data: IWebSocketInValue[] = [];
      const successFunctionsList: IAsyncTaskSuccessFunction<IWebSocketInValue>[] = [];
      let sinkQueue: AsyncTask<void> = AsyncTask.void(abortable);

      const unsubscribeOfMessage = createEventListener<'message', MessageEvent<IWebSocketInValue>>(socket, 'message', (event: MessageEvent<IWebSocketInValue>): void => {
        if (successFunctionsList.length > 0) {
          successFunctionsList.forEach(_ => _(event.data));
          successFunctionsList.length = 0;
        } else {
          data.push(event.data);
        }
      });

      const untilData = (
        abortable: Abortable,
      ): AsyncTask<IWebSocketInValue> => {
        if (data.length > 0) {
          return AsyncTask.success(data.shift()!, abortable);
        } else {
          return new AsyncTask<IWebSocketInValue>((
            success: IAsyncTaskSuccessFunction<IWebSocketInValue>,
          ): void => {
            successFunctionsList.push(success);
          }, abortable);
        }
      };

      const dataLoop = (
        abortable: Abortable,
      ): AsyncTask<void> => {
        return untilData(abortable)
          .successful((
            data: IWebSocketInValue,
          ): AsyncTask<void> => {
            return sinkQueue = sink(data, abortable);
          })
          .successful((): AsyncTask<void> => {
            return dataLoop(abortable);
          });
      };

      /* CLOSE */

      const untilClose = (
        abortable: Abortable,
      ): AsyncTask<void> => {
        return new AsyncTask<void>((
          success: IAsyncTaskSuccessFunction<void>,
          error: IAsyncTaskErrorFunction,
          abortable: Abortable,
        ): void => {
          const unsubscribe = createEventListener<'close', CloseEvent>(socket, 'close', (): void => {
            unsubscribe();
            success();
          });
          abortable.onAbort(unsubscribe);
        }, abortable);
      };

      const untilCloseFull = (
        abortable: Abortable,
      ): AsyncTask<void> => {
        return untilClose(abortable)
          .successful((): AsyncTask<void> => {
            return sinkQueue;
          });
      };

      /* ERROR */

      const untilError = (
        abortable: Abortable,
      ): AsyncTask<void> => {
        return new AsyncTask<void>((
          success: IAsyncTaskSuccessFunction<void>,
          error: IAsyncTaskErrorFunction,
          abortable: Abortable,
        ): void => {
          const unsubscribe = createEventListener<'error', Event>(socket, 'error', (): void => {
            unsubscribe();
            error(createWebSocketError());
          });
          abortable.onAbort(unsubscribe);
        }, abortable);
      };

      /* MERGE */

      return AsyncTask.race(
        [
          dataLoop,
          untilCloseFull,
          untilError,
        ],
        abortable,
      )
        .finally((): void => {
          unsubscribeOfMessage();
        });
    } else {
      return AsyncTask.error(createWebSocketNotInAnOpeningStateError(), abortable);
    }
  };
}
